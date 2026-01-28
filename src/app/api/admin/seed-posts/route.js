import { NextResponse } from 'next/server';
import BlogPost from '../../../../models/BlogPost';
import { connectDB } from '../../../../lib/mongodb';

export async function GET() {
    try {
        await connectDB();

        const posts = [
            {
                title: "Engineering in Uniform: My Journey as a Combat Engineer Lieutenant",
                slug: "engineering-in-uniform-combat-engineer",
                description: "Reflections on serving as an Electrical Engineer Second Lieutenant in the Combat Engineering branch.",
                content: `
# Engineering in Uniform

Serving as a **Meslekçi Topçu Asteğmen** (Professional Engineering Officer) in the **İstihkam** (Combat Engineering) branch was a unique convergence of my technical background and military discipline.

## The Dual Role

As an electrical engineer wearing the uniform, the expectations were twofold: command with the authority of an officer and solve problems with the precision of an engineer.

### Technical Challenges
In the field, 'engineering' takes on a different meaning. It's not just about circuit boards and code; it's about logistics, power distribution in remote areas, and ensuring operational readiness under tight constraints.

## Leadership and Discipline

The military taught me that technical skills are only half the equation. The ability to lead a team, make decisions under pressure, and maintain discipline is what truly drives success.

![Combat Engineer Officer](/images/combat-engineer.png)

This experience has profoundly shaped my approach to potential engineering challenges in the civilian world.
        `,
                category: "technology",
                tags: ["military", "engineering", "career", "leadership"],
                image: "/images/combat-engineer.png",
                author: "Bergaman",
                readTime: "5 min read",
                published: true,
                visibility: "public"
            },
            {
                title: "Beyond the Uniform: My Roadmap for the Future",
                slug: "beyond-the-uniform-future-roadmap",
                description: "My post-military plans: Pursuing a Master's degree abroad, financial growth, and career mastery.",
                content: `
# The Next Chapter

As I transition back to civilian life, my roadmap is clear and ambitious.

## 1. Master's Degree Abroad
I am setting my sights on pursuing a Master's degree overseas. The goal is to immerse myself in advanced technical environments and gain a global perspective on engineering and technology.

## 2. Financial Independence
Understanding finance is as crucial as understanding physics. I plan to deepen my knowledge of financial markets, investing, and wealth creation to build a solid foundation for the future.

## 3. Career Ascension
The ultimate goal is to work in a dynamic environment where I can leverage my skills in software, hardware, and AI to create tangible value.
        `,
                category: "technology",
                tags: ["future", "career", "education", "finance", "goals"],
                image: "/images/portfolio/default.jpg", // Placeholder
                author: "Bergaman",
                readTime: "4 min read",
                published: true,
                visibility: "public"
            },
            {
                title: "The Never-Ending Student: Electricity, AI, and Finance",
                slug: "never-ending-student-electricity-ai-finance",
                description: "Continuing my education in electrical systems, keeping up with AI, and exploring the blockchain frontier.",
                content: `
# Lifelong Learning

The degree was just the beginning. Currently, I am actively expanding my skill set in three key areas:

## Electrical Engineering
Even without the high-voltage certification (yet), I am taking advanced courses to sharpen my core engineering skills. Understanding the grid and power systems is fundamental.

## Artificial Intelligence
AI is not a buzzword; it's a tool I use daily. From coding assistants to data analysis, I am constantly exploring how AI can optimize workflows and solve complex problems.

## Blockchain and Finance
The intersection of technology and finance (DeFi, Blockchain) is fascinating. I am following these developments closely to understand the future of money.
        `,
                category: "ai",
                tags: ["learning", "ai", "finance", "blockchain", "electricity"],
                image: "/images/portfolio/default.jpg", // Placeholder
                author: "Bergaman",
                readTime: "6 min read",
                published: true,
                visibility: "public"
            },
            {
                title: "Demystifying the Machine: How Computers Actually Work",
                slug: "how-computers-work",
                description: "A deep dive into the fundamental operations of computers, from transistors to logic gates.",
                content: `
# Inside the Black Box

We use them every day, but how many of us understand what happens when we press a key?

## It's All Switches
At the core, a computer is billions of microscopic switches (transistors). 
- **1 (On)**
- **0 (Off)**

## Logic Gates
These switches form logic gates (AND, OR, NOT), which allow the computer to make decisions.

## CPU, RAM, and Storage
- **CPU**: The brain, executing instructions.
- **RAM**: The short-term memory / workspace.
- **Storage**: The long-term archive.

Understanding this architecture makes you a better programmer and engineer.
        `,
                category: "technology",
                tags: ["computer-science", "hardware", "basics", "education"],
                image: "/images/portfolio/default.jpg", // Placeholder
                author: "Bergaman",
                readTime: "8 min read",
                published: true,
                visibility: "public"
            },
            {
                title: "A Journey Through Time: The History of Programming Languages",
                slug: "history-of-programming-languages",
                description: "From Assembly to Python: How we learned to talk to machines.",
                content: `
# Speaking Machine

The history of programming is the history of abstraction.

## The Early Days: Assembly
In the beginning, we spoke the machine's language. It was fast but incredibly difficult to write and maintain.

## The High-Level Revolution: C
C changed everything. It provided a portable, structured way to write operating systems.

## The Object-Oriented Era: Java & C++
As programs got larger, we needed ways to organize code into reusable objects.

## The Modern Era: Python, JavaScript, Rust
Today, we value developer productivity and safety. Languages like Python and JavaScript power the web and AI, while Rust brings safety to systems programming.
        `,
                category: "programming",
                tags: ["history", "programming", "languages", "computer-science"],
                image: "/images/portfolio/default.jpg", // Placeholder
                author: "Bergaman",
                readTime: "10 min read",
                published: true,
                visibility: "public"
            },
            {
                title: "Analog vs. Digital: The Great Signal Debate",
                slug: "analog-vs-digital-comparison",
                description: "Comparing the continuous world of analog signals with the discrete precision of digital systems.",
                content: `
# The World is Analog

Nature doesn't happen in steps; it flows. Sound, light, temperature—these are continuous signals.

## The Digital Abstraction
Computers, however, are precise. They sample the analog world and turn it into numbers.

### Key Differences
1.  **Precision**: Digital is exact; Analog has infinite resolution but suffers from noise.
2.  **Storage**: Digital is easy to store and copy without degradation.
3.  **Processing**: DSP (Digital Signal Processing) allows for complex manipulation that would be impossible with analog circuits.

But for high-fidelity audio or radio transmission, the analog domain still holds its ground.
        `,
                category: "technology",
                tags: ["electronics", "analog", "digital", "signals"],
                image: "/images/portfolio/default.jpg", // Placeholder
                author: "Bergaman",
                readTime: "7 min read",
                published: true,
                visibility: "public"
            }
        ];

        await BlogPost.insertMany(posts);

        return NextResponse.json({ success: true, message: `Inserted ${posts.length} posts` });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
