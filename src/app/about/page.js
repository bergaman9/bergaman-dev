"use client";

import Head from 'next/head';
import ImageModal from "../components/ImageModal";
import Image from 'next/image';
import { useState } from 'react';

// Skill Categories Data
const skillCategories = [
  {
    title: "Programming Languages",
    icon: "fas fa-code",
    skills: [
      { name: "Python", level: 80 },
      { name: "JavaScript", level: 70 },
      { name: "C#", level: 60 },
      { name: "HTML & CSS", level: 90 }
    ]
  },
  {
    title: "Frameworks & Libraries",
    icon: "fas fa-layer-group",
    skills: [
      { name: "React", level: 75 },
      { name: "Node.js", level: 65 },
      { name: "Next.js", level: 70 },
      { name: "Tailwind CSS", level: 85 }
    ]
  },
  {
    title: "Database & Tools",
    icon: "fas fa-database",
    skills: [
      { name: "SQL", level: 70 },
      { name: "Git", level: 85 },
      { name: "MongoDB", level: 65 },
      { name: "VS Code", level: 90 }
    ]
  },
  {
    title: "Technical Skills",
    icon: "fas fa-cogs",
    skills: [
      { name: "Problem Solving", level: 90 },
      { name: "System Design", level: 75 },
      { name: "Technical Analysis", level: 80 },
      { name: "Project Management", level: 70 }
    ]
  },
  {
    title: "Hardware & IoT",
    icon: "fas fa-microchip",
    skills: [
      { name: "Arduino/ESP32", level: 80 },
      { name: "Circuit Design", level: 75 },
      { name: "Soldering", level: 85 },
      { name: "IoT Systems", level: 75 }
    ]
  },
  {
    title: "Languages",
    icon: "fas fa-language",
    skills: [
      { name: "Turkish (Native)", level: 100 },
      { name: "English", level: 85 },
      { name: "German", level: 70 },
      { name: "Technical Communication", level: 85 }
    ]
  }
];

// Experience Data - Updated with correct information
const experiences = [
  {
    title: "Electrical Electronics Engineer",
    company: "Bergasoft (Personal Project)",
    period: "2024 - Present",
    description: "Developing innovative software solutions and technical applications as a personal project. Focus on AI-powered tools, web development, and system optimization.",
    technologies: ["C#", "Python", "AI Tools", "Web Development", "System Design"]
  },
  {
    title: "Freelancer",
    company: "Bionluk",
    period: "Aug 2022 - Nov 2024",
    description: "Provided graphic design and software development services as a freelancer. Worked on various projects including web development, Discord bots, and design solutions.",
    technologies: ["Graphic Design", "Web Development", "Python", "Discord.py", "React"]
  },
  {
    title: "Intern",
    company: "Çevre Şehircilik ve İklim Değişikliği Bakanlığı",
    period: "Jun 2023 - Jul 2023",
    description: "Completed internship at the Ministry of Environment, Urbanization and Climate Change in Yalova, Turkey. Gained experience in environmental engineering and government sector operations.",
    technologies: ["Environmental Engineering", "Government Systems", "Technical Documentation"]
  },
  {
    title: "Intern",
    company: "Birfen Elektrik&Elektronik",
    period: "Aug 2022 - Sep 2022",
    description: "Electrical and electronics engineering internship in Yalova, Turkey. Hands-on experience with electrical systems and electronic components.",
    technologies: ["Electrical Systems", "Electronics", "Circuit Analysis", "Technical Troubleshooting"]
  }
];

// Education Data
const education = [
  {
    title: "Bachelor's Degree",
    institution: "Istinye University",
    field: "Electrical and Electronics Engineering",
    period: "Sep 2019 - Jun 2024",
    description: "Completed Bachelor's degree in Electrical and Electronics Engineering. Strong foundation in mathematics, circuit design, and engineering principles. Transitioned focus to software development during studies.",
    achievements: ["Strong Mathematical Foundation", "Circuit Design", "Problem Solving", "Engineering Principles"]
  },
  {
    title: "High School Diploma",
    institution: "İstanbul Anadolu Lisesi",
    field: "High School Education",
    period: "Sep 2018 - Jun 2019",
    description: "Graduated with high honors (96.32 GPA). Strong academic performance in mathematics and sciences.",
    achievements: ["Grade: 96.32", "Mathematics Excellence", "Science Focus"]
  }
];

// Interests Data - Updated with personal hobbies
const interests = [
  {
    title: "AI & Machine Learning",
    description: "Exploring artificial intelligence applications and machine learning algorithms for innovative solutions.",
    icon: "fas fa-brain"
  },
  {
    title: "Embedded Systems",
    description: "Working with Arduino, ESP32, and IoT devices to create smart automation solutions.",
    icon: "fas fa-microchip"
  },
  {
    title: "Full Stack Development",
    description: "Building modern web applications with React, Next.js, and backend technologies.",
    icon: "fas fa-laptop-code"
  },
  {
    title: "Cybersecurity",
    description: "Understanding security principles and implementing secure coding practices.",
    icon: "fas fa-shield-alt"
  },
  {
    title: "Robotics",
    description: "Combining hardware and software to create intelligent robotic systems.",
    icon: "fas fa-robot"
  },
  {
    title: "Blockchain",
    description: "Exploring decentralized technologies and cryptocurrency development.",
    icon: "fas fa-link"
  }
];

export default function About() {
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (imageSrc, imageAlt) => {
    setModalImage({ src: imageSrc, alt: imageAlt });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  return (
    <div className="min-h-screen text-[#d1d5db] page-container">
      <Head>
        <title>About Me - Ömer | Electrical Electronics Engineer & Full Stack Developer</title>
        <meta name="description" content="Learn more about Ömer - Electrical Electronics Engineer specializing in AI-powered solutions, full-stack development, and technical projects based in İstanbul, Turkey." />
        <meta name="keywords" content="ömer, bergaman, electrical electronics engineer, full stack developer, istanbul, turkey, AI developer, tech enthusiast" />
        <meta property="og:title" content="About Me - Ömer | Electrical Electronics Engineer" />
        <meta property="og:description" content="Electrical Electronics Engineer specializing in AI-powered solutions and full-stack development." />
        <meta property="og:url" content="https://bergaman.dev/about" />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Me - Ömer | Electrical Electronics Engineer" />
        <meta name="twitter:description" content="Electrical Electronics Engineer specializing in AI-powered solutions and full-stack development." />
        <link rel="canonical" href="https://bergaman.dev/about" />
      </Head>

      <main className="page-content py-8">
        
        {/* Hero Section */}
        <section className="text-center mb-16 fade-in">
          <div className="relative mb-8">
            <Image
              className="rounded-full border-4 border-[#e8c547] shadow-lg shadow-[#e8c547]/25 mx-auto"
              src="/images/profile/profile.png"
              alt="Bergaman Profile Picture"
              width={200}
              height={200}
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 leading-tight flex items-center justify-center gap-3">
            <i className="fas fa-user-circle text-[#e8c547]"></i>
            About Me
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Electrical Electronics Engineer & Full Stack Developer
          </p>
        </section>

        {/* Introduction */}
        <section className="mb-16 slide-in-left">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg">
            <h2 className="text-3xl font-bold gradient-text mb-6">
              Who Am I?
            </h2>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                Hi, I'm <span className="text-[#e8c547] font-semibold">Ömer</span>! I'm an <span className="text-[#e8c547] font-semibold">Electrical Electronics Engineer</span> based in <span className="text-[#e8c547] font-semibold">İstanbul, Turkey</span>. My journey in the tech world began with a passion for video games, which sparked my curiosity about computers. This early interest led me to pursue a degree in <span className="text-[#e8c547] font-semibold">Electrical and Electronics Engineering at Istinye University</span> (2019-2024).
              </p>
              
              <p>
                However, during my studies, I realized that the future and opportunities were shifting toward software. So, I took the initiative to teach myself programming and started developing my skills in the field of software engineering. Today, I specialize in <span className="text-[#e8c547] font-semibold">full-stack development, artificial intelligence, and blockchain technologies</span>.
              </p>
              
              <p>
                I'm a constant learner, always exploring new domains and seeking innovative ways to apply my knowledge. My journey is one of continual improvement, always challenging myself with new, impactful projects to work on. In addition to my technical skills, I have a <span className="text-[#e8c547] font-semibold">strong foundation in mathematics</span> that helps me solve complex problems effectively.
              </p>
              
              <p>
                I also enjoy working with my hands, honing skills like soldering and mechanical repairs, and have a growing interest in the <span className="text-[#e8c547] font-semibold">Internet of Things (IoT) and electric vehicles</span>. I am always eager to learn and improve, not just in my technical skills but in my personal growth as well.
              </p>
              
              <p>
                I'm excited to contribute to the ever-evolving world of technology, building the future while adapting to the continuous advancements in the digital world.
              </p>
              
              <div className="mt-8 p-6 bg-[#e8c547]/10 border-l-4 border-[#e8c547] rounded-r-lg">
                <p className="text-[#e8c547] font-semibold italic text-center">
                  "Crafting technology inspired by the strength and wisdom of a dragon."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-16 slide-in-right">
          <h2 className="text-3xl font-bold gradient-text mb-8 text-center">
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <div key={index} className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <i className={`${category.icon} text-[#e8c547] text-2xl mr-3`}></i>
                  <h3 className="text-xl font-semibold text-[#e8c547]">{category.title}</h3>
                </div>
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-[#e8c547] font-semibold">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-[#0e1b12] rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#e8c547] to-[#f4d76b] h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section - Timeline Design */}
        <section className="mb-16 slide-in-left">
          <h2 className="text-3xl font-bold gradient-text mb-8 text-center flex items-center justify-center gap-3">
            <i className="fas fa-briefcase text-[#e8c547]"></i>
            Professional Experience
          </h2>
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#e8c547] to-[#d4b445]"></div>
            
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-[#e8c547] rounded-full border-4 border-[#0e1b12] z-10 shadow-lg shadow-[#e8c547]/25"></div>
                  
                  {/* Content */}
                  <div className="ml-20 bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg w-full">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#e8c547] mb-2">{exp.title}</h3>
                        <p className="text-gray-300 font-medium text-lg mb-1">{exp.company}</p>
                        <span className="text-gray-400 text-sm bg-[#e8c547]/10 px-3 py-1 rounded-full inline-block">
                          <i className="fas fa-calendar-alt mr-2"></i>
                          {exp.period}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="px-3 py-1 bg-[#e8c547]/20 text-[#e8c547] text-sm rounded-full border border-[#e8c547]/30">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section - Timeline Design */}
        <section className="mb-16 slide-in-right">
          <h2 className="text-3xl font-bold gradient-text mb-8 text-center flex items-center justify-center gap-3">
            <i className="fas fa-graduation-cap text-cyan-400"></i>
            Education
          </h2>
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-500"></div>
            
            <div className="space-y-12">
              {education.map((edu, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-cyan-400 rounded-full border-4 border-[#0e1b12] z-10 shadow-lg shadow-cyan-400/25"></div>
                  
                  {/* Content */}
                  <div className="ml-20 bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg w-full">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-cyan-400 mb-2">{edu.title}</h3>
                        <p className="text-gray-300 font-medium text-lg mb-1">{edu.institution}</p>
                        <p className="text-gray-400 mb-2">{edu.field}</p>
                        <span className="text-gray-400 text-sm bg-cyan-400/10 px-3 py-1 rounded-full inline-block">
                          <i className="fas fa-calendar-alt mr-2"></i>
                          {edu.period}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4 leading-relaxed">{edu.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {edu.achievements.map((achievement, achIndex) => (
                        <span key={achIndex} className="px-3 py-1 bg-cyan-400/20 text-cyan-300 text-sm rounded-full border border-cyan-400/30">
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interests Section */}
        <section className="mb-16 slide-in-left">
          <h2 className="text-3xl font-bold gradient-text mb-8 text-center">
            Technical Interests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interests.map((interest, index) => (
              <div key={index} className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg text-center">
                <i className={`${interest.icon} text-[#e8c547] text-4xl mb-4 block`}></i>
                <h3 className="text-xl font-semibold text-[#e8c547] mb-3">{interest.title}</h3>
                <p className="text-gray-300 leading-relaxed">{interest.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center fade-in">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg">
            <h2 className="text-3xl font-bold gradient-text mb-4">
              Let's Connect!
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              I'm always excited to discuss new opportunities, collaborate on interesting projects, 
              or simply chat about technology and innovation. Feel free to reach out!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-[#e8c547] text-[#0e1b12] px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-[#d4b445] hover:scale-105"
              >
                <i className="fas fa-envelope mr-2"></i>
                Get In Touch
              </a>
              <a 
                href="/portfolio" 
                className="border border-[#e8c547] text-[#e8c547] px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-[#e8c547]/10 hover:scale-105 flex items-center justify-center gap-2"
              >
                <i className="fas fa-briefcase"></i>
                My Portfolio
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Image Modal */}
      <ImageModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        imageSrc={modalImage?.src}
        imageAlt={modalImage?.alt}
      />
    </div>
  );
}
