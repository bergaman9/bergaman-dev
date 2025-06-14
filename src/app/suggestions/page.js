"use client";

import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageModal from '../components/ImageModal';
import { useState } from 'react';

const suggestions = {
  games: [
    {
      title: "The Witcher 3: Wild Hunt",
      description: "An epic open-world RPG with incredible storytelling and immersive gameplay.",
      image: "/images/witcher3.png",
      genre: "RPG",
      rating: 9.5,
      platform: "PC, PS4, Xbox, Switch"
    },
    {
      title: "Cyberpunk 2077",
      description: "A futuristic open-world action RPG set in Night City.",
      image: "/images/cyberpunk2077.png",
      genre: "Action RPG",
      rating: 8.5,
      platform: "PC, PS5, Xbox"
    },
    {
      title: "Red Dead Redemption 2",
      description: "An immersive western-themed action-adventure game.",
      image: "/images/rdr2.jpg",
      genre: "Action-Adventure",
      rating: 9.8,
      platform: "PC, PS4, Xbox"
    },
    {
      title: "Elden Ring",
      description: "A challenging action RPG from FromSoftware with an open world.",
      image: "/images/eldenring.jpg",
      genre: "Action RPG",
      rating: 9.7,
      platform: "PC, PS5, Xbox"
    }
  ],
  movies: [
    {
      title: "The Terminator",
      description: "A sci-fi action film about a cyborg assassin sent back in time.",
      image: "/images/terminator.png",
      genre: "Sci-Fi Action",
      year: 1984,
      director: "James Cameron",
      rating: 9.0
    },
    {
      title: "Drive",
      description: "A neo-noir crime drama about a getaway driver in Los Angeles.",
      image: "/images/drive.png",
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
    }
  ],
  books: [
    {
      title: "1984",
      description: "George Orwell's dystopian novel about totalitarianism and surveillance.",
      image: "/images/1984.png",
      author: "George Orwell",
      genre: "Dystopian Fiction",
      year: 1949,
      rating: 9.1
    },
    {
      title: "Sapiens",
      description: "Yuval Noah Harari's exploration of human history and civilization.",
      image: "/images/sapiens.png",
      author: "Yuval Noah Harari",
      genre: "History",
      year: 2011,
      rating: 8.9
    },
    {
      title: "Ikigai",
      description: "The Japanese secret to a long and happy life by Héctor García and Francesc Miralles.",
      image: "/images/ikigai.png",
      author: "Héctor García, Francesc Miralles",
      genre: "Self-Help",
      year: 2016,
      rating: 8.5
    },
    {
      title: "Timekeepers",
      description: "Simon Garfield's fascinating exploration of humanity's relationship with time.",
      image: "/images/timekeepers.png",
      author: "Simon Garfield",
      genre: "History",
      year: 2016,
      rating: 8.3
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
    }
  ]
};

export default function Suggestions() {
  const [activeTab, setActiveTab] = useState('games');
  const [showAll, setShowAll] = useState({
    games: false,
    movies: false,
    books: false
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
    return showAll[category] ? items : items.slice(0, 4);
  };

  return (
    <div className="flex flex-col items-center min-h-screen text-[#d1d5db] page-container">
      <Head>
        <title>Suggestions - Video Games, Movies & Books | Bergaman</title>
        <meta name="description" content="Discover Bergaman's curated recommendations for video games, movies, and books. Explore entertainment suggestions across different genres." />
        <meta name="keywords" content="video games, movies, books, recommendations, entertainment, suggestions" />
        <meta property="og:title" content="Suggestions - Video Games, Movies & Books | Bergaman" />
        <meta property="og:description" content="Discover Bergaman's curated recommendations for video games, movies, and books." />
        <meta property="og:url" content="https://bergaman.dev/suggestions" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Suggestions - Video Games, Movies & Books | Bergaman" />
        <meta name="twitter:description" content="Discover Bergaman's curated recommendations for video games, movies, and books." />
        <link rel="canonical" href="https://bergaman.dev/suggestions" />
      </Head>

      <Header />

      <main className="page-content py-8">
        
        {/* Page Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            My Suggestions
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Discover my curated recommendations across video games, movies, and books. 
            These are personally tested and highly recommended entertainment options.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 slide-in-left">
          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover-scale ${
              activeTab === 'games'
                ? 'bg-[#e8c547] text-[#0e1b12] shadow-lg shadow-[#e8c547]/25'
                : 'bg-[#0e1b12] text-[#e8c547] border border-[#3e503e] hover:border-[#e8c547]/50'
            }`}
          >
            <i className="fas fa-gamepad"></i>
            Video Games
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover-scale ${
              activeTab === 'movies'
                ? 'bg-[#e8c547] text-[#0e1b12] shadow-lg shadow-[#e8c547]/25'
                : 'bg-[#0e1b12] text-[#e8c547] border border-[#3e503e] hover:border-[#e8c547]/50'
            }`}
          >
            <i className="fas fa-film"></i>
            Movies
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover-scale ${
              activeTab === 'books'
                ? 'bg-[#e8c547] text-[#0e1b12] shadow-lg shadow-[#e8c547]/25'
                : 'bg-[#0e1b12] text-[#e8c547] border border-[#3e503e] hover:border-[#e8c547]/50'
            }`}
          >
            <i className="fas fa-book"></i>
            Books
          </button>
        </div>

        {/* Video Games Tab */}
        {activeTab === 'games' && (
          <div className="w-full fade-in">
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01]">
              <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center">
                <i className="fas fa-gamepad mr-3"></i>
                Video Games
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getDisplayItems(suggestions.games, 'games').map((game, index) => (
                  <div
                    key={index}
                    className="border border-[#3e503e] rounded-lg bg-[#0e1b12] overflow-hidden hover:border-[#e8c547]/50 transition-all duration-300 group card-hover"
                  >
                    <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => openModal(game.image, game.title)}>
                      <Image
                        src={game.image}
                        alt={game.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold gradient-text mb-2">{game.title}</h3>
                      <p className="text-sm text-gray-300 mb-3">{game.description}</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Genre:</span>
                          <span className="text-[#e8c547]">{game.genre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rating:</span>
                          <span className="text-[#e8c547] flex items-center">
                            <i className="fas fa-star mr-1"></i>
                            {game.rating}/10
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Platform:</span>
                          <span className="text-[#e8c547]">{game.platform}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {suggestions.games.length > 4 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => toggleShowAll('games')}
                    className="btn-cyber px-6 py-2 rounded-lg hover-scale"
                  >
                    <span>{showAll.games ? 'Show Less' : 'Show More Games'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Movies Tab */}
        {activeTab === 'movies' && (
          <div className="w-full fade-in">
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01]">
              <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center">
                <i className="fas fa-film mr-3"></i>
                Movies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getDisplayItems(suggestions.movies, 'movies').map((movie, index) => (
                  <div
                    key={index}
                    className="border border-[#3e503e] rounded-lg bg-[#0e1b12] overflow-hidden hover:border-[#e8c547]/50 transition-all duration-300 group card-hover"
                  >
                    <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => openModal(movie.image, movie.title)}>
                      <Image
                        src={movie.image}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold gradient-text mb-2">{movie.title}</h3>
                      <p className="text-sm text-gray-300 mb-3">{movie.description}</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Genre:</span>
                          <span className="text-[#e8c547]">{movie.genre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Year:</span>
                          <span className="text-[#e8c547]">{movie.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Director:</span>
                          <span className="text-[#e8c547]">{movie.director}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rating:</span>
                          <span className="text-[#e8c547] flex items-center">
                            <i className="fas fa-star mr-1"></i>
                            {movie.rating}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {suggestions.movies.length > 4 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => toggleShowAll('movies')}
                    className="btn-cyber px-6 py-2 rounded-lg hover-scale"
                  >
                    <span>{showAll.movies ? 'Show Less' : 'Show More Movies'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Books Tab */}
        {activeTab === 'books' && (
          <div className="w-full fade-in">
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg transition-all duration-300 hover:border-[#e8c547]/30 hover:shadow-lg hover:shadow-[#e8c547]/10 hover:bg-[#2e3d29]/40 hover:scale-[1.01]">
              <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center">
                <i className="fas fa-book mr-3"></i>
                Books
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {getDisplayItems(suggestions.books, 'books').map((book, index) => (
                  <div
                    key={index}
                    className="border border-[#3e503e] rounded-lg bg-[#0e1b12] overflow-hidden hover:border-[#e8c547]/50 transition-all duration-300 group card-hover"
                  >
                    <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => openModal(book.image, book.title)}>
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 16vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold gradient-text mb-2 text-sm">{book.title}</h3>
                      <p className="text-xs text-gray-300 mb-3">{book.description}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Author:</span>
                          <span className="text-[#e8c547] text-right">{book.author}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Genre:</span>
                          <span className="text-[#e8c547]">{book.genre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Year:</span>
                          <span className="text-[#e8c547]">{book.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rating:</span>
                          <span className="text-[#e8c547] flex items-center">
                            <i className="fas fa-star mr-1"></i>
                            {book.rating}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {suggestions.books.length > 6 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => toggleShowAll('books')}
                    className="btn-cyber px-6 py-2 rounded-lg hover-scale"
                  >
                    <span>{showAll.books ? 'Show Less' : 'Show More Books'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      <Footer />

      {/* Image Modal */}
      <ImageModal
        src={modalImage?.src}
        alt={modalImage?.alt}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
