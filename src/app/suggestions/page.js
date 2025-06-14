"use client";

import Head from 'next/head';
import Image from 'next/image';
import ImageModal from '../components/ImageModal';
import { useState } from 'react';

const suggestions = {
  games: [
    {
      title: "The Witcher 3: Wild Hunt",
      description: "The best game on my list. Every quest is enjoyable. Even side quests have their own stories. Long gameplay duration and a game that makes you fall in love with it.",
      image: "/images/games/witcher3.jpg",
      genre: "RPG",
      rating: 10,
      platform: "PC, PlayStation, Xbox, Switch"
    },
    {
      title: "Red Dead Redemption 2",
      description: "I was wondering if a quality game would come out that could give me the same taste as Witcher 3. Rockstar succeeded in this. A wonderful game in every way.",
      image: "/images/games/rdr2.jpg",
      genre: "Action-Adventure",
      rating: 10,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Grand Theft Auto: Vice City",
      description: "Rockstar games never get old. Even though I finished it in 2021, I still enjoyed playing it.",
      image: "/images/games/gtavicecity.jpg",
      genre: "Action-Adventure",
      rating: 10,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Grand Theft Auto V",
      description: "No need to say much, Rockstar once again showed the market how to make games.",
      image: "/images/games/gtav.jpg",
      genre: "Action-Adventure",
      rating: 10,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Detroit: Become Human",
      description: "I really loved this genre. Making your own decisions and having different storylines between different characters are engaging points. They gamified the relationship between robots and humans interactively.",
      image: "/images/games/detroit.jpg",
      genre: "Interactive Drama",
      rating: 10,
      platform: "PC, PlayStation"
    },
    {
      title: "God of War",
      description: "A wonderful production that makes you love it with its story and gameplay mechanics, makes you play and gives you pleasure while playing. We become partners in the adventure of Kratos and Atreus.",
      image: "/images/games/godofwar.jpg",
      genre: "Action-Adventure",
      rating: 10,
      platform: "PC, PlayStation"
    },
    {
      title: "Sleeping Dogs",
      description: "As a police officer in Hong Kong, we infiltrate the gang we want to defeat and do various missions. Side missions don't bore you either. A wonderful game with graphics and gameplay for its year.",
      image: "/images/games/sleepingdogs.jpg",
      genre: "Action-Adventure",
      rating: 10,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Wolfenstein: The New Colossus",
      description: "It was a mystery whether the main character survived at the end of the previous series. In this game, he was found seriously injured. Our friend was killed and we wore his armor. The woman whose face we destroyed in the previous game found us and our goal in the game is to kill her.",
      image: "/images/games/wolfenstein2.jpg",
      genre: "FPS",
      rating: 10,
      platform: "PC, PlayStation, Xbox, Switch"
    },
    {
      title: "Assassin's Creed Origins",
      description: "It tells the establishment of the assassin organization. We embark on adventures with Bayek in Hellenistic Egypt. It took the series to a different dimension, I really liked it.",
      image: "/images/games/acorigins.jpg",
      genre: "Action RPG",
      rating: 9,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Assassin's Creed Odyssey",
      description: "Set in Ancient Greece. We play Kassandra. While trying to find and bring our family together, we try to destroy the Cosmos gang. After destroying it, we rule the country together with the leader of Cosmos.",
      image: "/images/games/acodyssey.jpg",
      genre: "Action RPG",
      rating: 9,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Assassin's Creed Valhalla",
      description: "Although I couldn't play at the highest level graphically due to optimization problems, I didn't like it the most atmospherically among the last trilogy, but I found it more successful in terms of mission design.",
      image: "/images/games/acvalhalla.jpg",
      genre: "Action RPG",
      rating: 9,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Beyond: Two Souls",
      description: "I loved these movie-like games, I finished this game with love too.",
      image: "/images/games/beyondtwosouls.jpg",
      genre: "Interactive Drama",
      rating: 9,
      platform: "PC, PlayStation"
    },
    {
      title: "Battlefield V",
      description: "It deals with different stories from World War II. It's short but each chapter has its own dynamics and fun.",
      image: "/images/games/battlefieldv.jpg",
      genre: "FPS",
      rating: 9,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Wolfenstein: The New Order",
      description: "A magnificent FPS experience. A perfect game with very fluid experience and carefully prepared level designs and shooting feel. Especially those music that slows down action times prevented me from leaving the game.",
      image: "/images/games/wolfenstein1.jpg",
      genre: "FPS",
      rating: 9,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Wolfenstein: The Old Blood",
      description: "The story of the main game has been expanded by adding a few new mechanics and weapons. I played with the same pleasure as the main game. This game takes us to a time when the war has not yet ended and the Nazis have not won.",
      image: "/images/games/wolfensteinold.jpg",
      genre: "FPS",
      rating: 9,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Watch Dogs 2",
      description: "A game that left a good place in my mind. It has improved compared to the first game both in terms of story and gameplay. Especially remote-controlled vehicles made stealth fun.",
      image: "/images/games/watchdogs2.jpg",
      genre: "Action-Adventure",
      rating: 9,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Need for Speed Heat",
      description: "A flowing game when it gets interesting. Its main story is about the struggle between police and street racers. Driving dynamics are very good, the map is lively.",
      image: "/images/games/nfsheat.jpg",
      genre: "Racing",
      rating: 9,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Grand Theft Auto IV",
      description: "Niko Bellic comes to Liberty City with the hope of living a good life in the messages his cousin wrote, but realizes that things are not like that at all and gets involved in many dirty jobs to make money. He takes revenge and loses the girl he likes in this cause.",
      image: "/images/games/gtaiv.jpg",
      genre: "Action-Adventure",
      rating: 9,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Forza Horizon 5",
      description: "I can say that knowing English provides an advantage in games and increases the pleasure taken from the game. Graphic quality has increased over Forza Horizon 4 and the map has completely changed, other things seem to be as usual. I can say it's the best series among car games for me.",
      image: "/images/games/forzahorizon5.jpg",
      genre: "Racing",
      rating: 9,
      platform: "PC, Xbox"
    },
    {
      title: "Mafia II",
      description: "A mafia game with a great story. It makes you live the mafia atmosphere. It manages to make you play without boring you. This is the first game I met with this series. That's why it has a special place.",
      image: "/images/games/mafia2.jpg",
      genre: "Action-Adventure",
      rating: 9,
      platform: "PC, PlayStation, Xbox"
    }
  ],
  movies: [
    {
      title: "The Terminator",
      description: "A sci-fi action film about a cyborg assassin sent back in time.",
      image: "/images/movies/terminator.png",
      genre: "Sci-Fi Action",
      year: 1984,
      director: "James Cameron",
      rating: 9.0
    },
    {
      title: "Drive",
      description: "A neo-noir crime drama about a getaway driver in Los Angeles.",
      image: "/images/movies/drive.png",
      genre: "Neo-Noir Crime",
      year: 2011,
      director: "Nicolas Winding Refn",
      rating: 8.7
    },
    {
      title: "Inception",
      description: "A mind-bending thriller about dreams within dreams.",
      image: "/images/inception.jpg",
      genre: "Sci-Fi Thriller",
      year: 2010,
      director: "Christopher Nolan",
      rating: 9.2
    },
    {
      title: "The Matrix",
      description: "A groundbreaking sci-fi film about reality and simulation.",
      image: "/images/matrix.jpg",
      genre: "Sci-Fi Action",
      year: 1999,
      director: "The Wachowskis",
      rating: 9.0
    },
    {
      title: "Interstellar",
      description: "A space epic about humanity's survival and love transcending dimensions.",
      image: "/images/interstellar.jpg",
      genre: "Sci-Fi Drama",
      year: 2014,
      director: "Christopher Nolan",
      rating: 9.1
    },
    {
      title: "Blade Runner 2049",
      description: "A visually stunning sequel exploring what it means to be human.",
      image: "/images/bladerunner.jpg",
      genre: "Sci-Fi Drama",
      year: 2017,
      director: "Denis Villeneuve",
      rating: 8.9
    },
    {
      title: "Pulp Fiction",
      description: "Quentin Tarantino's non-linear crime masterpiece.",
      image: "/images/movies/pulpfiction.png",
      genre: "Crime Drama",
      year: 1994,
      director: "Quentin Tarantino",
      rating: 9.4
    },
    {
      title: "The Dark Knight",
      description: "Christopher Nolan's Batman masterpiece with Heath Ledger's iconic Joker.",
      image: "/images/movies/darkknight.png",
      genre: "Superhero Crime",
      year: 2008,
      director: "Christopher Nolan",
      rating: 9.5
    },
    {
      title: "Fight Club",
      description: "A psychological thriller about consumerism and identity.",
      image: "/images/movies/fightclub.png",
      genre: "Psychological Thriller",
      year: 1999,
      director: "David Fincher",
      rating: 9.1
    }
  ],
  books: [
    {
      title: "1984",
      description: "George Orwell's dystopian novel about totalitarianism and surveillance.",
      image: "/images/books/1984.png",
      author: "George Orwell",
      genre: "Dystopian Fiction",
      year: 1949,
      rating: 9.1
    },
    {
      title: "Sapiens",
      description: "Yuval Noah Harari's exploration of human history and civilization.",
      image: "/images/books/sapiens.png",
      author: "Yuval Noah Harari",
      genre: "History",
      year: 2011,
      rating: 8.9
    },
    {
      title: "Ikigai",
      description: "The Japanese secret to a long and happy life by Héctor García and Francesc Miralles.",
      image: "/images/books/ikigai.png",
      author: "Héctor García, Francesc Miralles",
      genre: "Self-Help",
      year: 2016,
      rating: 8.5
    },
    {
      title: "Dune",
      description: "Frank Herbert's epic science fiction masterpiece about politics, religion, and ecology.",
      image: "/images/dune.jpg",
      author: "Frank Herbert",
      genre: "Science Fiction",
      year: 1965,
      rating: 9.3
    },
    {
      title: "The Hitchhiker's Guide to the Galaxy",
      description: "Douglas Adams' humorous science fiction series about space travel.",
      image: "/images/hitchhiker.jpg",
      author: "Douglas Adams",
      genre: "Comedy Sci-Fi",
      year: 1979,
      rating: 8.8
    },
    {
      title: "Neuromancer",
      description: "William Gibson's cyberpunk classic that defined the genre.",
      image: "/images/neuromancer.jpg",
      author: "William Gibson",
      genre: "Cyberpunk",
      year: 1984,
      rating: 8.7
    },
    {
      title: "Foundation",
      description: "Isaac Asimov's groundbreaking series about psychohistory and galactic empire.",
      image: "/images/foundation.jpg",
      author: "Isaac Asimov",
      genre: "Science Fiction",
      year: 1951,
      rating: 9.0
    },
    {
      title: "The Martian",
      description: "Andy Weir's survival story about an astronaut stranded on Mars.",
      image: "/images/martian.jpg",
      author: "Andy Weir",
      genre: "Science Fiction",
      year: 2011,
      rating: 8.9
    },
    {
      title: "Atomic Habits",
      description: "James Clear's guide to building good habits and breaking bad ones.",
      image: "/images/books/atomichabits.png",
      author: "James Clear",
      genre: "Self-Help",
      year: 2018,
      rating: 8.8
    }
  ],
  links: [
    {
      title: "GitHub",
      description: "The world's leading software development platform and version control system.",
      url: "https://github.com",
      category: "Development",
      icon: "fab fa-github",
      color: "#333"
    },
    {
      title: "Stack Overflow",
      description: "The largest online community for programmers to learn and share knowledge.",
      url: "https://stackoverflow.com",
      category: "Development",
      icon: "fab fa-stack-overflow",
      color: "#f48024"
    },
    {
      title: "MDN Web Docs",
      description: "Comprehensive documentation for web technologies including HTML, CSS, and JavaScript.",
      url: "https://developer.mozilla.org",
      category: "Documentation",
      icon: "fab fa-firefox-browser",
      color: "#ff7139"
    },
    {
      title: "React Documentation",
      description: "Official React documentation with guides, API reference, and tutorials.",
      url: "https://react.dev",
      category: "Documentation",
      icon: "fab fa-react",
      color: "#61dafb"
    },
    {
      title: "Next.js Documentation",
      description: "Complete guide to Next.js framework for production-ready React applications.",
      url: "https://nextjs.org/docs",
      category: "Documentation",
      icon: "fas fa-arrow-right",
      color: "#000"
    },
    {
      title: "Tailwind CSS",
      description: "A utility-first CSS framework for rapidly building custom user interfaces.",
      url: "https://tailwindcss.com",
      category: "CSS Framework",
      icon: "fas fa-wind",
      color: "#06b6d4"
    },
    {
      title: "Vercel",
      description: "The platform for frontend developers, providing speed and reliability.",
      url: "https://vercel.com",
      category: "Deployment",
      icon: "fas fa-triangle",
      color: "#000"
    },
    {
      title: "MongoDB Atlas",
      description: "Cloud-based MongoDB database service with global clusters.",
      url: "https://www.mongodb.com/atlas",
      category: "Database",
      icon: "fas fa-leaf",
      color: "#47a248"
    },
    {
      title: "VS Code",
      description: "Free source-code editor with debugging, task running, and version control.",
      url: "https://code.visualstudio.com",
      category: "Editor",
      icon: "fas fa-code",
      color: "#007acc"
    },
    {
      title: "Figma",
      description: "Collaborative interface design tool for creating beautiful user interfaces.",
      url: "https://www.figma.com",
      category: "Design",
      icon: "fab fa-figma",
      color: "#f24e1e"
    },
    {
      title: "Dribbble",
      description: "Community of designers sharing screenshots of their work, process, and projects.",
      url: "https://dribbble.com",
      category: "Design",
      icon: "fab fa-dribbble",
      color: "#ea4c89"
    },
    {
      title: "Behance",
      description: "Creative platform to showcase and discover creative work from around the world.",
      url: "https://www.behance.net",
      category: "Design",
      icon: "fab fa-behance",
      color: "#1769ff"
    }
  ]
};

export default function Suggestions() {
  const [activeTab, setActiveTab] = useState('games');
  const [showAll, setShowAll] = useState({
    games: false,
    movies: false,
    books: false,
    links: false
  });
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleShowAll = (category) => {
    setShowAll(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const openModal = (imageSrc, imageAlt) => {
    setModalImage({ src: imageSrc, alt: imageAlt });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const getDisplayItems = (items, category) => {
    if (showAll[category]) {
      return items;
    }
    // Show 8 items (2 rows of 4 columns) before showing "Show More" button
    return items.slice(0, 8);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-[#e8c547]"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-[#e8c547]"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-gray-400"></i>);
    }

    return stars;
  };

  return (
    <div className="page-container">
      <Head>
        <title>Suggestions - Bergaman | Curated Recommendations</title>
        <meta name="description" content="Discover Bergaman's curated recommendations for video games, movies, and books. Explore handpicked content across entertainment and literature." />
        <meta name="keywords" content="recommendations, video games, movies, books, entertainment, bergaman suggestions" />
        <meta property="og:title" content="Suggestions - Bergaman | Curated Recommendations" />
        <meta property="og:description" content="Discover Bergaman's curated recommendations for video games, movies, and books." />
        <meta property="og:url" content="https://bergaman.dev/suggestions" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Suggestions - Bergaman | Curated Recommendations" />
        <meta name="twitter:description" content="Discover Bergaman's curated recommendations for video games, movies, and books." />
        <link rel="canonical" href="https://bergaman.dev/suggestions" />
      </Head>

      <main className="page-content py-8">
        
        {/* Page Header */}
        <section className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 leading-tight">
            <i className="fas fa-star mr-3"></i>
            Suggestions
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Curated recommendations from the dragon's collection
          </p>
        </section>

        {/* Tab Navigation */}
        <section className="mb-8 slide-in-left">
          <div className="flex justify-center">
            <div className="flex bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-2 gap-2">
              <button
                onClick={() => setActiveTab('games')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'games'
                    ? 'bg-[#e8c547] text-[#0e1b12]'
                    : 'text-[#d1d5db] hover:text-[#e8c547] hover:bg-[#3e503e]/30'
                }`}
              >
                <i className="fas fa-gamepad mr-2"></i>
                Video Games
              </button>
              <button
                onClick={() => setActiveTab('movies')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'movies'
                    ? 'bg-[#e8c547] text-[#0e1b12]'
                    : 'text-[#d1d5db] hover:text-[#e8c547] hover:bg-[#3e503e]/30'
                }`}
              >
                <i className="fas fa-film mr-2"></i>
                Movies
              </button>
              <button
                onClick={() => setActiveTab('books')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'books'
                    ? 'bg-[#e8c547] text-[#0e1b12]'
                    : 'text-[#d1d5db] hover:text-[#e8c547] hover:bg-[#3e503e]/30'
                }`}
              >
                <i className="fas fa-book mr-2"></i>
                Books
              </button>
              <button
                onClick={() => setActiveTab('links')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'links'
                    ? 'bg-[#e8c547] text-[#0e1b12]'
                    : 'text-[#d1d5db] hover:text-[#e8c547] hover:bg-[#3e503e]/30'
                }`}
              >
                <i className="fas fa-link mr-2"></i>
                Links
              </button>
            </div>
          </div>
        </section>

        {/* Games Section */}
        {activeTab === 'games' && (
          <section className="slide-in-right">
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
              <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center">
                <i className="fas fa-gamepad mr-3"></i>
                Video Games
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getDisplayItems(suggestions.games, 'games').map((game, index) => (
                  <div key={index} className="bg-[#0e1b12] border border-[#3e503e] rounded-lg overflow-hidden hover:border-[#e8c547]/50 transition-all duration-300">
                    <div className="relative h-64 cursor-pointer" onClick={() => openModal(game.image, game.title)}>
                      <Image
                        src={game.image}
                        alt={game.title}
                        fill
                        className="object-cover transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#e8c547] mb-2">{game.title}</h3>
                      <p className="text-sm text-gray-300 mb-3">{game.description}</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Genre:</span>
                          <span className="text-[#e8c547]">{game.genre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Platform:</span>
                          <span className="text-[#e8c547]">{game.platform}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Rating:</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(game.rating / 2)}
                            <span className="text-[#e8c547] ml-2">{game.rating}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {suggestions.games.length > 8 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => toggleShowAll('games')}
                    className="bg-[#e8c547] text-[#0e1b12] px-6 py-3 rounded-lg font-medium hover:bg-[#d4b445] transition-colors duration-300"
                  >
                    {showAll.games ? 'Show Less Games' : 'Show More Games'}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Movies Section */}
        {activeTab === 'movies' && (
          <section className="slide-in-right">
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
              <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center">
                <i className="fas fa-film mr-3"></i>
                Movies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getDisplayItems(suggestions.movies, 'movies').map((movie, index) => (
                  <div key={index} className="bg-[#0e1b12] border border-[#3e503e] rounded-lg overflow-hidden hover:border-[#e8c547]/50 transition-all duration-300">
                    <div className="relative h-64 cursor-pointer" onClick={() => openModal(movie.image, movie.title)}>
                      <Image
                        src={movie.image}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#e8c547] mb-2">{movie.title}</h3>
                      <p className="text-sm text-gray-300 mb-3">{movie.description}</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Genre:</span>
                          <span className="text-[#e8c547]">{movie.genre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Director:</span>
                          <span className="text-[#e8c547]">{movie.director}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Year:</span>
                          <span className="text-[#e8c547]">{movie.year}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Rating:</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(movie.rating / 2)}
                            <span className="text-[#e8c547] ml-2">{movie.rating}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {suggestions.movies.length > 8 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => toggleShowAll('movies')}
                    className="bg-[#e8c547] text-[#0e1b12] px-6 py-3 rounded-lg font-medium hover:bg-[#d4b445] transition-colors duration-300"
                  >
                    {showAll.movies ? 'Show Less Movies' : 'Show More Movies'}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Books Section */}
        {activeTab === 'books' && (
          <section className="slide-in-right">
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
              <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center">
                <i className="fas fa-book mr-3"></i>
                Books
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getDisplayItems(suggestions.books, 'books').map((book, index) => (
                  <div key={index} className="bg-[#0e1b12] border border-[#3e503e] rounded-lg overflow-hidden transition-all duration-300">
                    <div className="relative h-80 cursor-pointer" onClick={() => openModal(book.image, book.title)}>
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#e8c547] mb-2 text-sm leading-tight">{book.title}</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex flex-col">
                          <span className="text-gray-400">Author:</span>
                          <span className="text-[#e8c547] text-xs leading-tight">{book.author}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Genre:</span>
                          <span className="text-[#e8c547]">{book.genre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Year:</span>
                          <span className="text-[#e8c547]">{book.year}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Rating:</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(book.rating / 2)}
                            <span className="text-[#e8c547] ml-1">{book.rating}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {suggestions.books.length > 8 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => toggleShowAll('books')}
                    className="bg-[#e8c547] text-[#0e1b12] px-6 py-3 rounded-lg font-medium hover:bg-[#d4b445] transition-colors duration-300"
                  >
                    {showAll.books ? 'Show Less Books' : 'Show More Books'}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Links Section */}
        {activeTab === 'links' && (
          <section className="slide-in-right">
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
              <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center">
                <i className="fas fa-link mr-3"></i>
                Useful Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getDisplayItems(suggestions.links, 'links').map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0e1b12] border border-[#3e503e] rounded-lg p-6 transition-all duration-300 hover:border-[#e8c547]/50 hover:transform hover:scale-105 group"
                  >
                    <div className="flex items-center mb-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                        style={{ backgroundColor: `${link.color}20`, border: `1px solid ${link.color}40` }}
                      >
                        <i 
                          className={`${link.icon} text-xl`}
                          style={{ color: link.color }}
                        ></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#e8c547] mb-1 group-hover:text-white transition-colors duration-300">
                          {link.title}
                        </h3>
                        <span className="text-xs text-gray-400 bg-[#2e3d29]/50 px-2 py-1 rounded">
                          {link.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {link.description}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-[#e8c547] group-hover:text-white transition-colors duration-300">
                      <span>Visit Site</span>
                      <i className="fas fa-external-link-alt ml-2"></i>
                    </div>
                  </a>
                ))}
              </div>
              {suggestions.links.length > 8 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => toggleShowAll('links')}
                    className="bg-[#e8c547] text-[#0e1b12] px-6 py-3 rounded-lg font-medium hover:bg-[#d4b445] transition-colors duration-300"
                  >
                    {showAll.links ? 'Show Less Links' : 'Show More Links'}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* Image Modal */}
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
