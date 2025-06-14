import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Comment from '../../../models/Comment';
import { getUserInfo } from '../../../lib/userInfo';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');
    
    if (!postSlug) {
      return NextResponse.json({ error: 'Post slug is required' }, { status: 400 });
    }
    
    const comments = await Comment.find({ postSlug, approved: true }).sort({ createdAt: -1 });
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const { postSlug, name, email, message } = await request.json();
    
    // Check if comments are allowed
    const db = await connectDB();
    const settings = await db.collection('settings').findOne({ type: 'site' });
    
    if (settings && !settings.allowComments) {
      return NextResponse.json({ error: 'Comments are currently disabled' }, { status: 403 });
    }
    
    // Validation
    if (!postSlug || !name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json({ error: 'Name must be between 2 and 50 characters' }, { status: 400 });
    }
    
    if (message.length < 10 || message.length > 1000) {
      return NextResponse.json({ error: 'Message must be between 10 and 1000 characters' }, { status: 400 });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    // Get user info (IP, browser, location, etc.)
    const userInfo = await getUserInfo(request);
    
    // Determine if comment should be auto-approved based on moderation settings
    const shouldAutoApprove = !settings || !settings.moderateComments;
    
    // Create new comment with user info
    const comment = new Comment({
      postSlug,
      name,
      email,
      message,
      approved: shouldAutoApprove,
      ipAddress: userInfo.ipAddress,
      userAgent: userInfo.userAgent,
      browser: userInfo.browser,
      os: userInfo.os,
      device: userInfo.device,
      location: userInfo.location,
      referrer: userInfo.referrer
    });
    
    await comment.save();
    
    // Return comment without sensitive info
    const publicComment = {
      _id: comment._id,
      postSlug: comment.postSlug,
      name: comment.name,
      message: comment.message,
      approved: comment.approved,
      createdAt: comment.createdAt
    };
    
    return NextResponse.json({ comment: publicComment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
} 