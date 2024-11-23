import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0e1b12] to-[#2a3b22] text-[#d1d5db]">
      {/* Header */}
      <Header showHomeLink={true}/>

      {/* Main Content */}

      <main className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto mt-12 px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-[#e8c547] text-center">About Me</h1>

       <div className="px-4">

       <p>Hi, I’m Omer! My journey in the tech world began with a passion for video games, which sparked my curiosity about computers. This early interest led me to pursue a degree in Electrical and Electronics Engineering. However, during my studies, I realized that the future and opportunities were shifting toward software. So, I took the initiative to teach myself programming and started developing my skills in the field of software engineering.</p>
       <br/>
<p>Today, I specialize in full-stack development, artificial intelligence, and blockchain technologies. I'm a constant learner, always exploring new domains and seeking innovative ways to apply my knowledge. My journey is one of continual improvement, always challenging myself with new, impactful projects to work on.</p>
<br/>
<p>In addition to my technical skills, I have a strong foundation in mathematics that helps me solve complex problems effectively. I also enjoy working with my hands, honing skills like soldering and mechanical repairs, and have a growing interest in the Internet of Things (IoT) and electric vehicles. I am always eager to learn and improve, not just in my technical skills but in my personal growth as well.</p>
<br/>
<p>Outside of tech, I enjoy a variety of hobbies including fitness, gaming, movies, and connecting with nature. I’m also an active community leader on Discord, where I engage in discussions related to gaming and engineering, eager to share insights and collaborate with others.</p>
<br/>
<p>I’m excited to contribute to the ever-evolving world of technology, building the future while adapting to the continuous advancements in the digital world. Let’s connect and create something great together! You can reach out via the links in the footer.</p>
</div>
      </main>


      {/* Footer */}
      <Footer />
    </div>
  );
}
