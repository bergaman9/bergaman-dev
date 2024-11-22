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
    content: 'In the rapidly evolving digital age, the challenges we face are more complex than ever. Technology has fundamentally transformed the way we live, work, and interact with each other. While these advancements have brought incredible convenience, they have also introduced new dilemmas regarding privacy, security, and the impact on human relationships. As we become increasingly connected through digital platforms, the very essence of human interaction is shifting. Social media, online communities, and virtual spaces offer a sense of connection, yet they often come at the cost of deep, meaningful relationships. The digital age, while offering unprecedented access to information, has also given rise to new forms of isolation, as people engage in increasingly superficial interactions. This disconnection is compounded by the constant bombardment of information, making it difficult for individuals to filter what is truly valuable or meaningful.\n\nAs technology advances, the balance between convenience and ethics becomes more difficult to maintain. The rise of Artificial Intelligence (AI) and machine learning has opened new frontiers in various sectors, from healthcare to finance, but it has also raised concerns about privacy, data security, and the loss of control. Algorithms, which are now responsible for decision-making in many aspects of our lives, are often opaque, and the data used to train these systems may be biased or inaccurate. Furthermore, as we become more reliant on these technologies, we risk losing our ability to think critically and solve problems independently, relying instead on automated systems to make decisions for us.\n\nBlockchain technology has emerged as a potential solution to some of these challenges, particularly in terms of privacy and data security. By decentralizing information and allowing individuals to control their own data, blockchain could offer a more transparent and secure way of handling personal information. However, as with any emerging technology, there are still significant hurdles to overcome, including scalability, regulatory concerns, and the environmental impact of blockchain networks. While blockchain holds great promise, its widespread adoption will require careful consideration of the ethical implications and the potential for misuse.\n\nAt the same time, we must also address the growing divide between those who have access to advanced technologies and those who do not. The digital divide has created disparities in education, healthcare, and economic opportunity, with those in less developed regions or from lower socio-economic backgrounds often left behind. As we move further into a technology-driven future, it is crucial that we ensure equal access to the tools and resources necessary to succeed in this new world. Education, digital literacy, and the development of infrastructure in underserved areas must be prioritized to ensure that no one is left behind.\n\nAs we continue to advance technologically, it is essential that we do not lose sight of the values that make us human. The rise of AI, blockchain, and other technologies should not come at the expense of our ability to empathize, connect, and create meaning in our lives. Religion and ethical frameworks, which have long provided guidance on how to live harmoniously with others, will play an increasingly important role in ensuring that technology is used in ways that benefit humanity as a whole. In a world where technology often moves faster than our ability to fully understand its consequences, it is vital that we maintain a moral compass and strive for a future where technology enhances, rather than diminishes, our shared humanity.'
  },  
  {
    slug: 'learning-for-survival',
    title: 'Learning for Survival',
    content: 'In a world that is constantly evolving, the ability to learn is not just an advantage—it is a necessity. Learning for survival extends far beyond the confines of traditional education; it encapsulates the relentless pursuit of growth, adaptation, and innovation that is essential to navigating the complexities of life. This journey of learning involves understanding not only how to survive, but how to thrive in an ever-changing world. \n\nHuman nature has always been driven by a deep-seated curiosity and a thirst for knowledge. Our innate desire to learn, explore, and understand the world around us is the foundation of our survival. From the earliest moments of our existence, humans have sought to improve their circumstances—whether through mastering the environment, creating tools, or evolving social systems. This curiosity and drive are as vital today as they were thousands of years ago. The challenge now is to continue nurturing that curiosity as we face new problems, technologies, and societal shifts. \n\nThe modern world demands constant adaptation. Skills that were once sufficient may quickly become outdated as industries evolve and new technologies emerge. Lifelong learning has become a vital aspect of success, particularly in today’s fast-paced, technology-driven society. It is no longer just about formal education; it is about a mindset that embraces growth at every stage of life. Learning for survival is about seeking knowledge in every area, from personal well-being to professional development, from understanding health and fitness to staying current with technological advancements. \n\nSurvival is no longer only about securing food, shelter, and protection. It also involves staying mentally, emotionally, and physically fit. In fact, health has become one of the most critical aspects of survival today. The quest for a long, healthy life is no longer just about avoiding disease; it’s about maintaining a balanced, fulfilling existence. Prioritizing health, both mental and physical, allows us to take on the world with clarity and resilience. As we move through life, we must ensure that our minds remain agile and that our bodies are capable of withstanding the challenges we face. \n\nBeyond health, there’s a deeper pursuit that transcends money: the desire to create value. Money, while important, is not the end goal; it is the tool that helps us achieve greater objectives. The true reward lies in the ability to produce value—whether it’s through innovative ideas, meaningful work, or the impact we have on others. The satisfaction that comes from contributing something valuable to the world is far more enduring than the temporary satisfaction of wealth alone. \n\nWhat truly drives us in this life is the pursuit of meaning. That meaning often comes from the process of creating, improving, and adapting. The joy of learning, the fulfillment of solving a problem, and the rewards of personal growth are the real treasures of life. They provide a deeper sense of purpose, a lasting form of wealth that cannot be bought or sold. This journey of continuous learning, adapting, and growing is what ensures we are truly alive—not just surviving, but thriving. \n\nUltimately, learning for survival is not about simply getting by—it’s about building a life that is rich in purpose, health, and value. It’s about understanding that survival is more than just existing; it’s about creating a life that nourishes the body, enriches the mind, and contributes to the world around us. In the grand scheme of things, the real measure of success is not how much money we accumulate, but how much positive impact we leave behind. By learning, adapting, and growing throughout our lives, we not only survive—we flourish.'
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
      <Header showHomeLink={true}/>

      {/* Main Content */}
      <main className="flex flex-col items-center gap-8 w-full max-w-6xl mx-auto flex-1 px-6 mt-12">
        <h1 className="text-3xl font-bold text-[#e8c547] text-center">{post.title}</h1>

        <div className="text-sm px-6 text-[#d1d5db] max-w-3xl">
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
