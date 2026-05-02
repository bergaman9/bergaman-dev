import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import {
  clampString,
  jsonError,
  readJsonLimited,
  validateEmail,
  validateEnum,
} from '../../../../lib/serverSecurity';

const MEMBER_ROLES = ['admin', 'editor'];

async function getMembersCollection() {
  const connection = await connectDB();
  const db = connection?.db || connection?.connection?.db;

  if (!db) {
    throw Object.assign(new Error('Database connection is not available'), { status: 503 });
  }

  return db.collection('members');
}

export async function GET() {
  try {
    const membersCollection = await getMembersCollection();
    const members = await membersCollection.find({}).sort({ createdAt: -1 }).toArray();

    // Remove password from response
    const sanitizedMembers = members.map(member => {
      const { password, ...memberWithoutPassword } = member;
      return memberWithoutPassword;
    });

    return NextResponse.json(sanitizedMembers);
  } catch (error) {
    console.error('Error fetching members:', error);
    return jsonError(error, 500);
  }
}

export async function POST(request) {
  try {
    const body = await readJsonLimited(request, { maxBytes: 8 * 1024 });
    const name = clampString(body.name, 120);
    const email = clampString(body.email, 254).toLowerCase();
    const password = clampString(body.password, 256);
    const role = validateEnum(body.role || 'editor', MEMBER_ROLES, 'role');

    if (!name || !validateEmail(email) || password.length < 12) {
      return NextResponse.json({ error: 'Name, valid email, and a 12+ character password are required' }, { status: 400 });
    }

    const membersCollection = await getMembersCollection();

    // Check if member already exists
    const existingMember = await membersCollection.findOne({ email });
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

    const result = await membersCollection.insertOne(newMember);

    // Return member without password
    const { password: _, ...memberWithoutPassword } = newMember;
    memberWithoutPassword._id = result.insertedId;

    return NextResponse.json(memberWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return jsonError(error, 500);
  }
}
