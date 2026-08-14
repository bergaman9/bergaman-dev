import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

let client;
let clientPromise;

// Only check for MONGODB_URI in runtime, not during build
if (!process.env.MONGODB_URI && process.env.NODE_ENV !== 'production' && typeof window === 'undefined' && !process.env.NEXT_PHASE) {
  console.warn('MongoDB URI not found, using fallback for build process');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise && process.env.MONGODB_URI) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  if (process.env.MONGODB_URI) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

const mongooseCache = globalThis.__bergamanMongoose || { connection: null, promise: null };
globalThis.__bergamanMongoose = mongooseCache;

// Mongoose connection function. Cache the promise in every environment so a
// warm Vercel function never opens a second pool for the same process.
export async function connectDB() {
  if (mongooseCache.connection) return mongooseCache.connection;
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    if (!mongooseCache.promise) {
      mongooseCache.promise = mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        maxPoolSize: 10,
      });
    }

    mongooseCache.connection = await mongooseCache.promise;
    return mongooseCache.connection;
  } catch (error) {
    mongooseCache.promise = null;
    console.error('MongoDB connection error:', error);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
