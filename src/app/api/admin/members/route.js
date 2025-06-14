import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';

// Member model schema (we'll store in a members collection)
const memberSchema = {
  name: String,
  email: String,
  password: String, // hashed
  role: String, // 'admin' or 'editor'
  status: String, // 'active' or 'inactive'
  createdAt: Date,
  updatedAt: Date
};

export async function GET() {
  try {
    await connectDB();
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/bergaman-dev');
    await client.connect();
    const db = client.db();
    const members = await db.collection('members').find({}).sort({ createdAt: -1 }).toArray();
    await client.close();
    
    // Remove password from response
    const sanitizedMembers = members.map(member => {
      const { password, ...memberWithoutPassword } = member;
      return memberWithoutPassword;
    });

    return NextResponse.json(sanitizedMembers);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, password, role = 'editor' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    await connectDB();
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/bergaman-dev');
    await client.connect();
    const db = client.db();
    
    // Check if member already exists
    const existingMember = await db.collection('members').findOne({ email });
    if (existingMember) {
      return NextResponse.json({ error: 'Member with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newMember = {
      name,
      email,
      password: hashedPassword,
      role,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('members').insertOne(newMember);
    await client.close();
    
    // Return member without password
    const { password: _, ...memberWithoutPassword } = newMember;
    memberWithoutPassword._id = result.insertedId;

    return NextResponse.json(memberWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
} 