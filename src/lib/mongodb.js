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

// Mongoose connection function
export async function connectDB() {
  // Skip connection during build phase
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Skipping MongoDB connection during build phase');
    return null;
  }

  // Check if already connected
  if (mongoose.connections[0].readyState === 1) {
    console.log('MongoDB already connected via Mongoose');
    return mongoose.connections[0];
  }
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB...');
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferCommands: true, // Enable mongoose buffering to prevent the error
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log('MongoDB connected successfully via Mongoose');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 