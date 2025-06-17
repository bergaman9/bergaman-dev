const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const path = require('path');

// Recommendation schema
const recommendationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['movie', 'game', 'book', 'series', 'music', 'link'], required: true },
  image: { type: String, default: null },
  rating: { type: Number, min: 1, max: 10, default: null },
  year: { type: Number, default: null },
  genre: { type: String, default: null },
  director: { type: String, default: null },
  author: { type: String, default: null },
  developer: { type: String, default: null },
  url: { type: String, default: null },
  linkType: { type: String, enum: ['Development', 'Documentation', 'CSS Framework', 'Deployment', 'Database', 'Other'], default: null },
  recommendation: { type: String, required: true },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  order: { type: Number, default: 0 },
  createdAt: Date,
  updatedAt: Date
}, { timestamps: true });

const Recommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);

// Sample recommendations data
const sampleRecommendations = [
  // Movies
  {
    title: "Dune (2021)",
    category: "movie",
    description: "Denis Villeneuve's masterpiece adaptation of Frank Herbert's sci-fi classic.",
    image: "/images/movies/dune.jpg",
    rating: 9.5,
    year: 2021,
    genre: "Sci-Fi, Drama",
    director: "Denis Villeneuve",
    recommendation: "A must-watch for sci-fi fans. The world-building is incredible and Hans Zimmer's score is phenomenal.",
    featured: true,
    status: "active",
    order: 1
  },
  {
    title: "The Matrix",
    category: "movie",
    description: "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
    image: "/images/movies/matrix.jpg",
    rating: 9.0,
    year: 1999,
    genre: "Sci-Fi, Action",
    director: "Lana & Lilly Wachowski",
    recommendation: "A revolutionary film that changed action movies forever. Deep philosophical themes and stunning visual effects.",
    featured: true,
    status: "active",
    order: 2
  },
  // Games
  {
    title: "The Witcher 3: Wild Hunt",
    category: "game",
    description: "An open-world RPG that sets the bar for storytelling in games.",
    image: "/images/games/witcher3.png",
    rating: 9.8,
    year: 2015,
    genre: "RPG, Open World",
    developer: "CD Projekt Red",
    recommendation: "The best RPG I've ever played. Every side quest feels meaningful and the main story is captivating.",
    featured: true,
    status: "active",
    order: 3
  },
  {
    title: "Red Dead Redemption 2",
    category: "game",
    description: "Rockstar's masterpiece of storytelling and world-building in the American frontier.",
    image: "/images/games/rdr2.png",
    rating: 9.7,
    year: 2018,
    genre: "Action, Adventure, Western",
    developer: "Rockstar Games",
    recommendation: "The most immersive game world ever created. Arthur Morgan's story is unforgettable.",
    featured: true,
    status: "active",
    order: 4
  },
  // Books
  {
    title: "1984",
    category: "book",
    description: "George Orwell's dystopian masterpiece about surveillance, thought control, and language.",
    image: "/images/books/1984.png",
    rating: 9.2,
    year: 1949,
    genre: "Dystopian, Political Fiction",
    author: "George Orwell",
    recommendation: "More relevant today than ever. A chilling look at authoritarianism and the manipulation of truth.",
    featured: false,
    status: "active",
    order: 5
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    category: "book",
    description: "A sweeping, big-history account of how human evolution has shaped the world.",
    image: "/images/books/sapiens.png",
    rating: 9.0,
    year: 2011,
    genre: "History, Anthropology",
    author: "Yuval Noah Harari",
    recommendation: "Changed my perspective on human history and society. Full of fascinating insights about our past and future.",
    featured: false,
    status: "active",
    order: 6
  },
  // Links - Dev Tools
  {
    title: "GitHub",
    category: "link",
    description: "The world's leading software development platform and version control system.",
    image: "/images/portfolio/web-project.svg",
    rating: 9.5,
    url: "https://github.com",
    linkType: "Development Tool",
    recommendation: "Essential for any developer. Great for version control, collaboration, and showcasing your projects.",
    featured: true,
    status: "active",
    order: 7
  },
  {
    title: "Visual Studio Code",
    category: "link",
    description: "Free, built on open source, and extensible code editor for developers.",
    image: "/images/portfolio/web-project.svg",
    rating: 9.7,
    url: "https://code.visualstudio.com",
    linkType: "Development Tool",
    recommendation: "The best code editor I've ever used. Excellent extensions, great performance, and constantly improving.",
    featured: false,
    status: "active",
    order: 8
  },
  // Links - Learning Resources
  {
    title: "Next.js Documentation",
    category: "link",
    description: "Complete guide to Next.js framework for production-ready React applications.",
    image: "/images/portfolio/web-project.svg",
    rating: 9.6,
    url: "https://nextjs.org/docs",
    linkType: "Documentation",
    recommendation: "Outstanding documentation that makes learning Next.js smooth and enjoyable. Great examples and explanations.",
    featured: false,
    status: "active",
    order: 9
  },
  {
    title: "Tailwind CSS",
    category: "link",
    description: "A utility-first CSS framework for rapidly building custom user interfaces.",
    image: "/images/portfolio/web-project.svg",
    rating: 9.4,
    url: "https://tailwindcss.com",
    linkType: "CSS Framework",
    recommendation: "Revolutionary approach to CSS. Makes styling fast and maintainable. Great documentation and tooling.",
    featured: false,
    status: "active",
    order: 10
  }
];

async function populateRecommendations() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('Connected to MongoDB');

    // Create model
    const Recommendation = mongoose.model('Recommendation', recommendationSchema);

    // Check if we already have recommendations
    const count = await Recommendation.countDocuments();
    console.log(`Found ${count} existing recommendations`);

    if (count > 0) {
      console.log('Recommendations already exist. Skipping population.');
      await mongoose.disconnect();
      return;
    }

    // Set timestamps for all recommendations
    const now = new Date();
    const recommendationsWithTimestamps = sampleRecommendations.map(rec => ({
      ...rec,
      createdAt: now,
      updatedAt: now
    }));

    // Insert recommendations
    console.log(`Inserting ${recommendationsWithTimestamps.length} sample recommendations...`);
    await Recommendation.insertMany(recommendationsWithTimestamps);
    console.log('Sample recommendations inserted successfully');

    console.log('Done');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

populateRecommendations().catch(console.error); 