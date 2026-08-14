import { NextResponse } from 'next/server';
import BlogPost from '../../../../../models/BlogPost';
import { connectDB } from '../../../../../lib/mongodb';
import { parseObjectId, readJsonLimited } from '../../../../../lib/serverSecurity';
import { hashPassword } from '@/lib/userInfo';
import { revalidateTag } from 'next/cache';



// GET - Fetch single blog post
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'post ID');
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

    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'post ID');
    const data = await readJsonLimited(request, { maxBytes: 128 * 1024 });

    const updateData = { ...data, updatedAt: new Date() };
    const unsetFields = {};
    if (data.visibility === 'password' && data.password) {
      if (data.password.length < 12) {
        return NextResponse.json({ error: 'Protected post passwords must be at least 12 characters' }, { status: 400 });
      }
      updateData.passwordHash = await hashPassword(data.password);
      unsetFields.password = 1;
    }
    delete updateData.password;
    if (data.visibility && data.visibility !== 'password') {
      unsetFields.password = 1;
      unsetFields.passwordHash = 1;
    }

    const update = { $set: updateData };
    if (Object.keys(unsetFields).length) update.$unset = unsetFields;

    const post = await BlogPost.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    revalidateTag('blog-posts', 'max');

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

    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'post ID');
    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    revalidateTag('blog-posts', 'max');

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
