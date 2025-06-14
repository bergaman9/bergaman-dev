import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Comment from '../../../models/Comment';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');
    
    if (!postSlug) {
      return NextResponse.json({ error: 'Post slug is required' }, { status: 400 });
    }
    
    const comments = await Comment.find({ postSlug }).sort({ createdAt: -1 });
    
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
    
    // Create new comment
    const comment = new Comment({
      postSlug,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });
    
    await comment.save();
    
    return NextResponse.json({ 
      message: 'Comment posted successfully',
      comment: {
        _id: comment._id,
        name: comment.name,
        message: comment.message,
        createdAt: comment.createdAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
} 