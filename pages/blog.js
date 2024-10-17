import Head from 'next/head';
import Link from 'next/link';
import "../src/app/globals.css";

export default function Blog() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-10 bg-gradient-to-b from-[#0e1b12] to-[#2a3b22] text-[#d1d5db]">
      <Head>
        <title>Bergaman Blog - Thoughts and Insights</title>
        <meta name="description" content="Bergaman Blog - Exploring technology, insights, and inspirations." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="w-full max-w-3xl flex justify-between items-center pb-6 border-b border-[#3e503e]">
        <h1 className="text-3xl font-extrabold text-[#e8c547]">Bergaman</h1>
        <nav className="flex gap-8 text-lg">
          <Link href="/" className="hover:text-[#e8c547] transition-colors">Home</Link>
          <Link href="/about" className="hover:text-[#e8c547] transition-colors">About</Link>
          <Link href="/portfolio" className="hover:text-[#e8c547] transition-colors">Portfolio</Link>
          <Link href="/blog" className="hover:text-[#e8c547] transition-colors">Blog</Link>
        </nav>
      </header>

      <main className="flex flex-col items-center gap-12 w-full max-w-3xl mt-12">
        <section className="border border-[#3e503e] p-6 rounded-lg bg-[#2e3d29] w-full">
          <h2 className="text-2xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3">Latest Posts</h2>
          <ul className="list-disc list-inside mt-6 text-lg">
            <li>
              <Link href="/blog/the-importance-of-electricity" className="hover:text-[#e8c547] transition-colors">
                The Importance of Electricity
              </Link>
            </li>
            <li>
              <Link href="/blog/modern-challenges-digital-age" className="hover:text-[#e8c547] transition-colors">
                Modern Challenges in the Digital Age
              </Link>
            </li>
            <li>
              <Link href="/blog/learning-for-survival" className="hover:text-[#e8c547] transition-colors">
                Learning for Survival
              </Link>
            </li>
            <li>
              <Link href="/blog/mastering-computers" className="hover:text-[#e8c547] transition-colors">
                Mastering Computers
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}