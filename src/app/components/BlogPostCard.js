"use client";

import Link from 'next/link';
import Image from 'next/image';
import BlogImageGenerator from './BlogImageGenerator';

export default function BlogPostCard({ post, formatDate, formatCategoryName, openModal }) {
  const handleImageClick = (e) => {
    if (openModal) {
      e.preventDefault();
      openModal(post.image, post.title);
    }
  };

  return (
    <Link href={`/blog/${post.slug}`} className="h-full block rounded-lg overflow-hidden transition-all duration-300 bg-[#2e3d29]/20 backdrop-blur-md border border-[#3e503e]/30 hover:border-[#e8c547]/50 group">
      <div className="relative h-48">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={handleImageClick}
          />
        ) : (
          <div className="w-full h-full">
            <BlogImageGenerator 
              title={post.title} 
              category={post.category} 
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full mb-2 inline-block capitalize">
            {formatCategoryName(post.category)}
          </span>
          <h3 className="text-lg font-bold">{post.title}</h3>
        </div>
        <div className="absolute top-3 right-3 text-xs text-white bg-black/50 px-2 py-1 rounded-full">
          {formatDate(post.createdAt)}
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-300 mb-4 text-sm line-clamp-2">
          {post.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            <i className="fas fa-clock mr-1"></i>
            {post.readTime ? post.readTime.replace(' read', '') : '6 min'}
          </span>
          <div className="flex items-center space-x-3">
            <span>
              <i className="fas fa-eye mr-1"></i>
              {post.views || 0}
            </span>
            <span>
              <i className="fas fa-heart mr-1"></i>
              {post.likes || 0}
            </span>
            <span>
              <i className="fas fa-comments mr-1"></i>
              {post.commentCount || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 