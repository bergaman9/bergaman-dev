import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BlogPost from '../../../../../models/BlogPost';
import { connectDB } from '../../../../../lib/mongodb';



// GET - Fetch single blog post
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const post = await BlogPost.findById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT - Update blog post
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const data = await request.json();
    
    const post = await BlogPost.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const post = await BlogPost.findByIdAndDelete(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 