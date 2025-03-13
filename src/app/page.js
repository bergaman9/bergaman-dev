"use client";

import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";
import Header from './components/Header';
import Footer from './components/Footer';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { blogPosts } from "../data/blogPosts"; // Import blog posts

const CircularProgressbar = dynamic(() => import('react-circular-progressbar').then(mod => mod.CircularProgressbar), { ssr: false });
import 'react-circular-progressbar/dist/styles.css';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  // Sort blog posts by date (newest to oldest)
  const sortedBlogPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedBlogPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#0e1b12] to-[#2a3b22] text-[#d1d5db]">
      <Head>
        <title>Bergaman - The Dragon's Domain</title>
        <meta name="description" content="Bergaman - A futuristic cyber-military web application inspired by dragon mythology." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center gap-8 w-full max-w-3xl px-4 sm:px-6 md:px-8">
        <Image
          className="rounded-full border-4 border-[#e8c547] mt-10 shadow-[0_0_10px_5px_rgba(232,197,71,0.5)]"
          src="/images/profile.png"
          alt="Profile Picture"
          width={150}
          height={150}
        />
        <p className="text-center text-md max-w-2xl font-semibold leading-relaxed">
          Hey, I'm Omer! The dragon spirit behind Bergaman - blending futuristic technology with a military edge, specializing in artificial intelligence, blockchain, and full-stack development.
        </p>

        <div className="flex flex-col gap-8 w-full">
          <section className="border border-[#3e503e] p-6 rounded-lg bg-[#2e3d29]">
            <h2 className="text-lg font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3">Blog</h2>
            <div className="mt-4 space-y-2">
              {currentPosts.map((post, index) => (
                <div key={index} className="flex justify-between items-center border border-[#3e503e] px-4 py-2 rounded-lg bg-[#0e1b12] text-sm">
                  <Link href={`/blog/${post.slug}`} className="text-[#e8c547] hover:underline truncate">
                    {post.title}
                  </Link>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil(blogPosts.length / postsPerPage) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-[#e8c547] text-[#0e1b12]' : 'bg-[#0e1b12] text-[#e8c547]'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </section>

          <section className="border border-[#3e503e] p-6 rounded-lg bg-[#2e3d29] w-full">
            <h2 className="text-xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3">Featured Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">
                <img src="/images/contro.png" alt="Contro Bot" className="w-full h-32 object-cover rounded-lg mb-2" />
                <h3 className="font-bold">Contro Bot</h3>
                <p>It is a comprehensive Discord bot that I started to develop and made improvements to during the pandemic period.</p>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">
                <img src="/images/ligroup.png" alt="Ligroup" className="w-full h-32 object-cover rounded-lg mb-2" />
                <h3 className="font-bold">Ligroup</h3>
                <p>This is the first project where I stepped into full stack web development, thinking that this job cannot be done with just bots.</p>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">
                <img src="/images/generative-ai.png" alt="RVC & Stable Diffusion Projects" className="w-full h-32 object-cover rounded-lg mb-2" />
                <h3 className="font-bold">RVC & Stable Diffusion Projects</h3>
                <p>I developed experimental projects during the times when generative artificial intelligence was becoming popular.</p>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">
                <img src="/images/iaq.jpg" alt="Indoor Air Quality IoT Project" className="w-full h-32 object-cover rounded-lg mb-2" />
                <h3 className="font-bold">Indoor Air Quality IoT Project</h3>
                <p>I made a GUI application that enables wireless data transfer and real-time monitoring of data using Arduino Uno R4 WiFi.</p>
              </div>
            </div>
          </section>

          <section className="border border-[#3e503e] p-6 rounded-lg bg-[#2e3d29]">
            <h2 className="text-xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3">Interests</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-sm">
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">AI</div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">Embedded Systems</div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">Full Stack Development</div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">Cybersecurity</div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">Robotics</div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">Blockchain</div>
            </div>
          </section>

          <section className="border border-[#3e503e] p-6 rounded-lg bg-[#2e3d29]">
            <h2 className="text-xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3">Skills</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center">
                <h3 className="font-bold text-[#e8c547] mb-2">Python</h3>
                <div className="w-20 h-20">
                  <CircularProgressbar value={80} text={`${80}%`} styles={{
                    path: { stroke: `#e8c547` },
                    text: { fill: '#e8c547', fontSize: '16px' },
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center">
                <h3 className="font-bold text-[#e8c547] mb-2">JavaScript</h3>
                <div className="w-20 h-20">
                  <CircularProgressbar value={70} text={`${70}%`} styles={{
                    path: { stroke: `#e8c547` },
                    text: { fill: '#e8c547', fontSize: '16px' },
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center">
                <h3 className="font-bold text-[#e8c547] mb-2">C#</h3>
                <div className="w-20 h-20">
                  <CircularProgressbar value={60} text={`${60}%`} styles={{
                    path: { stroke: `#e8c547` },
                    text: { fill: '#e8c547', fontSize: '16px' },
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center">
                <h3 className="font-bold text-[#e8c547] mb-2">HTML & CSS</h3>
                <div className="w-20 h-20">
                  <CircularProgressbar value={90} text={`${90}%`} styles={{
                    path: { stroke: `#e8c547` },
                    text: { fill: '#e8c547', fontSize: '16px' },
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center">
                <h3 className="font-bold text-[#e8c547] mb-2">React</h3>
                <div className="w-20 h-20">
                  <CircularProgressbar value={75} text={`${75}%`} styles={{
                    path: { stroke: `#e8c547` },
                    text: { fill: '#e8c547', fontSize: '16px' },
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center">
                <h3 className="font-bold text-[#e8c547] mb-2">Node.js</h3>
                <div className="w-20 h-20">
                  <CircularProgressbar value={65} text={`${65}%`} styles={{
                    path: { stroke: `#e8c547` },
                    text: { fill: '#e8c547', fontSize: '16px' },
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center">
                <h3 className="font-bold text-[#e8c547] mb-2">SQL</h3>
                <div className="w-20 h-20">
                  <CircularProgressbar value={70} text={`${70}%`} styles={{
                    path: { stroke: `#e8c547` },
                    text: { fill: '#e8c547', fontSize: '16px' },
                  }} />
                </div>
              </div>
              <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547] flex flex-col items-center">
                <h3 className="font-bold text-[#e8c547] mb-2">Git</h3>
                <div className="w-20 h-20">
                  <CircularProgressbar value={85} text={`${85}%`} styles={{
                    path: { stroke: `#e8c547` },
                    text: { fill: '#e8c547', fontSize: '16px' },
                  }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
