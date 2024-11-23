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
        <p className="text-center">
        Bergaman is a visionary software developer blending cutting-edge technology with creative design. 
This platform showcases artificial intelligence, blockchain, and full-stack development expertise.
       </p>
      </main>


      {/* Footer */}
      <Footer />
    </div>
  );
}
