"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { blogPosts } from "../../data/blogPosts"; // Import blog posts

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0e1b12] to-[#2a3b22] text-[#d1d5db]">
      <Header showHomeLink={true}/>

      <main className="flex flex-col items-center w-full max-w-3xl mx-auto flex-1 px-6 mt-12">
        <h1 className="text-3xl font-bold text-[#e8c547] mb-8 text-center">
          Blog
        </h1>

        {/* Blog List Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
          {blogPosts.map((blog, index) => (
            <div
              key={index}
              className="bg-[#2e3d29] border border-[#3e503e] rounded-lg p-4 shadow-lg"
            >
              <Link href={`/blog/${blog.slug}`}>
                <h2 className="text-lg font-bold text-[#e8c547]">{blog.title}</h2>
              </Link>
              <p className="text-sm text-[#d1d5db]">{blog.description}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
