import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const FaGithub = dynamic(() => import('react-icons/fa').then(mod => mod.FaGithub), { ssr: false });
const FaLinkedin = dynamic(() => import('react-icons/fa').then(mod => mod.FaLinkedin), { ssr: false });
const FaEnvelope = dynamic(() => import('react-icons/fa').then(mod => mod.FaEnvelope), { ssr: false });
const FaMedium = dynamic(() => import('react-icons/fa').then(mod => mod.FaMedium), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-10 bg-gradient-to-b from-[#0e1b12] to-[#2a3b22] text-[#d1d5db]">
      <Head>
        <title>Bergaman - The Dragon's Domain</title>
        <meta name="description" content="Bergaman - A futuristic cyber-military web application inspired by dragon mythology." />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>

      <header className="w-full max-w-3xl flex justify-between items-center pb-6 border-b border-[#3e503e]">
        <h1 className="text-3xl font-extrabold text-[#e8c547]">Bergaman</h1>
        <nav className="flex gap-8 text-lg">
          <Link href="/about" className="hover:text-[#e8c547] transition-colors">About</Link>
          <Link href="/portfolio" className="hover:text-[#e8c547] transition-colors">Portfolio</Link>
          <Link href="/suggestions" className="hover:text-[#e8c547] transition-colors">Suggestions</Link>
          <Link href="/blog" className="hover:text-[#e8c547] transition-colors">Blog</Link>
        </nav>
      </header>

      <main className="flex flex-col items-center gap-8 w-full max-w-3xl">
        <Image
          className="rounded-full border-4 border-[#e8c547] mt-10"
          src="/images/profile.png"
          alt="Profile Picture"
          width={150}
          height={150}
        />
        <p className="text-center text-md max-w-2xl font-semibold leading-relaxed">
          Hey, I'm Omer! The dragon spirit behind Bergaman - blending futuristic technology with a military edge, specializing in embedded systems, cybersecurity, and full-stack development.
        </p>

        <div className="flex flex-col gap-8 w-full">
          <section className="border border-[#3e503e] p-6 rounded-lg bg-[#2e3d29]">
            <h2 className="text-xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3">Blog</h2>
            <ul className="list-disc list-inside mt-6 text-md">
              <li>The Importance of Electricity</li>
              <li>Modern Challenges in the Digital Age</li>
              <li>Learning for Survival</li>
              <li>Mastering Computers</li>
            </ul>
          </section>

          <section className="border border-[#3e503e] p-6 rounded-lg bg-[#2e3d29] w-full">
          <h2 className="text-xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">
              <img src="/images/contro.png" alt="Contro Bot" className="w-full h-32 object-cover rounded-lg mb-2" />
              <h3 className="font-bold">Project 1 - Contro Bot</h3>
              <p>It is a comprehensive Discord bot that I started to develop and made improvements to during the pandemic period.</p>
            </div>
            <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">
              <img src="/images/ligroup.png" alt="Ligroup" className="w-full h-32 object-cover rounded-lg mb-2" />
              <h3 className="font-bold">Project 2 - Ligroup</h3>
              <p>This is the first project where I stepped into full stack web development, thinking that this job cannot be done with just bots.</p>
            </div>
            <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">
              <img src="/images/generative-ai.png" alt="RVC & Stable Diffusion Projects" className="w-full h-32 object-cover rounded-lg mb-2" />
              <h3 className="font-bold">Project 3 - RVC & Stable Diffusion Projects</h3>
              <p>I developed experimental projects during the times when generative artificial intelligence was becoming popular.</p>
            </div>
            <div className="border border-[#3e503e] p-4 rounded-lg text-center bg-[#0e1b12] text-[#e8c547]">
              <img src="/images/iaq.jpg" alt="Indoor Air Quality IoT Project" className="w-full h-32 object-cover rounded-lg mb-2" />
              <h3 className="font-bold">Project 4 - Indoor Air Quality IoT Projects</h3>
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
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-bold text-[#e8c547]">Python</h3>
                <div className="w-full bg-[#3e503e] rounded-full h-4">
                  <div className="bg-[#e8c547] h-4 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[#e8c547]">JavaScript</h3>
                <div className="w-full bg-[#3e503e] rounded-full h-4">
                  <div className="bg-[#e8c547] h-4 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[#e8c547]">C#</h3>
                <div className="w-full bg-[#3e503e] rounded-full h-4">
                  <div className="bg-[#e8c547] h-4 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="flex flex-col items-center gap-6 pt-10 pb-10 w-full max-w-3xl text-center">
        <div className="flex gap-8">
          <a
            href="https://github.com/bergaman9"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e8c547] text-2xl"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/omerguler"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e8c547] text-2xl"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://medium.com/@bergaman9"
            className="hover:text-[#e8c547] text-2xl"
          >
            <FaMedium />
          </a>
          <a
            href="mailto:omerguler53@gmail.com"
            className="hover:text-[#e8c547] text-2xl"
          >
            <FaEnvelope />
          </a>
        </div>
        <div className="mt-4 text-xs text-[#c4c4a8]">
          "Crafting technology inspired by the strength and wisdom of a dragon."
        </div>
      </footer>
    </div>
  );
}