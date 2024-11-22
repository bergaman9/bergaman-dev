"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BlogPage() {
  const blogs = [
    { title: "The Importance of Electricity", description: "Insights into electricity's role in modern life." },
    { title: "Modern Challenges in the Digital Age", description: "Exploring technological advancements and their impacts." },
    { title: "Learning for Survival", description: "Strategies for continuous learning and adaptation." },
    { title: "Mastering Computers", description: "A guide to building expertise in computer systems." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0e1b12] to-[#2a3b22] text-[#d1d5db]">
      <Header />

      <main className="flex flex-col items-center w-full max-w-6xl mx-auto flex-1 px-6 mt-12">
        <h1 className="text-4xl font-bold text-[#e8c547] mb-8 text-center">
          Blog
        </h1>

        {/* Blog List Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-[#2e3d29] border border-[#3e503e] rounded-lg p-4 shadow-lg"
            >
              <h2 className="text-lg font-bold text-[#e8c547]">{blog.title}</h2>
              <p className="text-sm text-[#d1d5db]">{blog.description}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
