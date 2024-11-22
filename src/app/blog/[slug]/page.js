// app/blog/[slug]/page.js
import { notFound } from 'next/navigation'; // Sayfa bulunamazsa 404 yönlendirmesi için
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Blog içeriklerini buraya ekleyin
const blogPosts = [
  {
    slug: 'the-importance-of-electricity',
    title: 'The Importance of Electricity',
    content: `Electricity is one of the fundamental pillars of modern civilization. From the moment light bulbs were first introduced to society, electricity has evolved into an irreplaceable resource. Today, it is the driving force behind almost every aspect of our lives.

    Whether it's powering our homes, running factories, or enabling the complex systems behind our computers, electricity is at the heart of it all. The modern world, especially the global business and finance industries, heavily depends on electricity. Financial transactions are processed, markets are analyzed, and data is securely stored — all thanks to the reliable flow of electricity.

    More than just a utility, electricity also fuels the ongoing technological revolution. In the world of computers, electricity powers the data centers that process billions of transactions every day. The operations and functions that take place in the virtual world—such as machine learning computations, real-time data analysis, and server communications—are all made possible by electricity.

    Whether we are aware of it or not, every action in our digital world, from sending emails to running complex algorithms, is powered by electricity. This unseen force enables everything, from our daily activities to the most advanced technological feats. The vital role electricity plays cannot be overstated: without it, modern society as we know it would cease to function.`,
  },
  {
    slug: 'modern-challenges-in-the-digital-age',
    title: 'Modern Challenges in the Digital Age',
    content: 'Exploring technological advancements and their impacts. In today\'s digital age, data privacy and security are more important than ever, as we move further into the virtual world.',
  },
  {
    slug: 'learning-for-survival',
    title: 'Learning for Survival',
    content: 'Strategies for continuous learning and adaptation. Lifelong learning is key in today\'s fast-paced world, where new skills and knowledge are always in demand.',
  },
  {
    slug: 'mastering-computers',
    title: 'Mastering Computers',
    content: 'A guide to building expertise in computer systems. The world of computers is vast and understanding both hardware and software is crucial for those pursuing a career in tech.',
  },
];

export default function BlogDetail({ params }) {
  const post = blogPosts.find(blog => blog.slug === params.slug);

  if (!post) {
    return notFound(); // Sayfa bulunamazsa 404 sayfasına yönlendir
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#0e1b12] to-[#2a3b22] text-[#d1d5db]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center gap-8 w-full max-w-6xl mx-auto flex-1 px-6 mt-12">
        <h1 className="text-3xl font-bold text-[#e8c547] mb-8 text-center">{post.title}</h1>

        <div className="text-sm text-[#d1d5db] max-w-3xl">
          <p>{post.content}</p>
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
