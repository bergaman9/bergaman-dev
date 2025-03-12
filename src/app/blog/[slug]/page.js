"use client";

import { notFound } from 'next/navigation'; // Sayfa bulunamazsa 404 yönlendirmesi için
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { blogPosts } from '../../../data/blogPosts'; // Import blog posts
import { use } from 'react'; // Import use from React

export default function BlogDetail({ params }) {
  const unwrappedParams = use(params); // Unwrap params
  const post = blogPosts.find(blog => blog.slug === unwrappedParams.slug);

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const storedLikes = localStorage.getItem(`likes-${unwrappedParams.slug}`);
    if (storedLikes) {
      setLikes(parseInt(storedLikes, 10));
    }
    const storedLiked = localStorage.getItem(`liked-${unwrappedParams.slug}`);
    if (storedLiked) {
      setLiked(storedLiked === 'true');
    }
  }, [unwrappedParams.slug]);

  const handleLike = () => {
    if (!liked) {
      const newLikes = likes + 1;
      setLikes(newLikes);
      setLiked(true);
      localStorage.setItem(`likes-${unwrappedParams.slug}`, newLikes);
      localStorage.setItem(`liked-${unwrappedParams.slug}`, 'true');
    }
  };

  if (!post) {
    return notFound(); // Sayfa bulunamazsa 404 sayfasına yönlendir
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#0e1b12] to-[#2a3b22] text-[#d1d5db]">
      {/* Header */}
      <Header showHomeLink={true}/>

      {/* Main Content */}
      <main className="flex flex-col items-center gap-8 w-full max-w-3xl px-4 sm:px-6 md:px-8 mb-6 mt-12">
      <h1 className="text-3xl font-bold text-[#e8c547] text-center">{post.title}</h1>

        <div className="border border-[#3e503e] p-6 rounded-lg bg-[#2e3d29] w-full max-w-3xl">

          <div className="text-sm px-2 text-[#d1d5db] max-w-3xl">
            <p>{post.content}</p>
          </div>

          {/* Like Button */}
          <div className="flex justify-between w-full max-w-3xl px-2">
            <button 
              onClick={handleLike} 
              className={`mt-4 p-2 rounded ${liked ? 'bg-green-500' : 'bg-gray-500'}`}
              disabled={liked}
            >
              ❤️ {likes}
            </button>
            {/* Date Display */}
            <div className="mt-4 text-sm text-[#d1d5db]">
              {new Date(post.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// GetStaticPaths ile slug'ları tanımlama
export async function getStaticPaths() {
  const paths = blogPosts.map(blog => ({
    params: { slug: blog.slug },
  }));

  return {
    paths,
    fallback: false, // Sayfa bulunamazsa 404 verir
  };
}
