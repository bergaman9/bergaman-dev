import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  clampString,
  jsonError,
  parseObjectId,
  pickAllowedFields,
  readJsonLimited,
  validateEmail,
  validateEnum,
} from '../../../../../lib/serverSecurity';

const MEMBER_ROLES = ['admin', 'editor'];
const MEMBER_STATUSES = ['active', 'inactive'];

async function getMembersCollection() {
  const connection = await connectDB();
  const db = connection?.db || connection?.connection?.db;

  if (!db) {
    throw Object.assign(new Error('Database connection is not available'), { status: 503 });
  }

  return db.collection('members');
}

export async function PATCH(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'member ID');
    const body = await readJsonLimited(request, { maxBytes: 8 * 1024 });
    const updates = pickAllowedFields(body, ['name', 'email', 'role', 'status']);

    if (updates.name !== undefined) updates.name = clampString(updates.name, 120);
    if (updates.email !== undefined) {
      updates.email = clampString(updates.email, 254).toLowerCase();
      if (!validateEmail(updates.email)) {
        return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
      }
    }
    if (updates.role !== undefined) updates.role = validateEnum(updates.role, MEMBER_ROLES, 'role');
    if (updates.status !== undefined) updates.status = validateEnum(updates.status, MEMBER_STATUSES, 'status');

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const membersCollection = await getMembersCollection();

    // Add updatedAt timestamp
    updates.updatedAt = new Date();

    const result = await membersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Member updated successfully' });
  } catch (error) {
    console.error('Error updating member:', error);
    return jsonError(error, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'member ID');

    const membersCollection = await getMembersCollection();

    // Check if member exists and is not the main admin
    const member = await membersCollection.findOne({ _id: new ObjectId(id) });
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Prevent deletion of main admin (you can add more checks here)
    if (member.role === 'admin' && member.email === 'bergaman@admin.com') {
      return NextResponse.json({ error: 'Cannot delete main administrator' }, { status: 403 });
    }

    const result = await membersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    return jsonError(error, 500);
  }
}
