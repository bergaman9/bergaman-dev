"use client";

import Head from 'next/head';
import Image from 'next/image';
import ImageModal from '../components/ImageModal';
import { useState } from 'react';

const suggestions = {
  games: [
    {
      title: "The Witcher 3: Wild Hunt",
      description: "An epic open-world RPG with incredible storytelling and immersive gameplay.",
      image: "/images/games/witcher3.png",
      genre: "RPG",
      rating: 9.5,
      platform: "PC, PlayStation, Xbox, Switch"
    },
    {
      title: "Cyberpunk 2077",
      description: "A futuristic open-world action RPG set in Night City.",
      image: "/images/games/cyberpunk2077.png",
      genre: "Action RPG",
      rating: 8.5,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Elden Ring",
      description: "A challenging action RPG from FromSoftware with an open world.",
      image: "/images/games/eldenring.jpg",
      genre: "Action RPG",
      rating: 9.7,
      platform: "PC, PlayStation, Xbox"
    },
    {
      title: "Red Dead Redemption 2",
      description: "An immersive western-themed action-adventure game.",
      image: "/images/rdr2.jpg",
      genre: "Action-Adventure",
      rating: 9.8,
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
    if (showAll[category]) {
      return items;
    }
    return items.slice(0, 4);
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
            <div className="flex bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-2">
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
                    <div className="relative h-48 cursor-pointer" onClick={() => openModal(game.image, game.title)}>
                      <Image
                        src={game.image}
                        alt={game.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
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
              {suggestions.games.length > 4 && (
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
                    <div className="relative h-48 cursor-pointer" onClick={() => openModal(movie.image, movie.title)}>
                      <Image
                        src={movie.image}
                        alt={movie.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
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
              {suggestions.movies.length > 4 && (
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
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {getDisplayItems(suggestions.books, 'books').map((book, index) => (
                    <div key={index} className="bg-[#0e1b12] border border-[#3e503e] rounded-lg overflow-hidden hover:border-[#e8c547]/50 transition-all duration-300">
                      <div className="relative h-64 cursor-pointer" onClick={() => openModal(book.image, book.title)}>
                        <Image
                          src={book.image}
                          alt={book.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-[#e8c547] mb-2 text-sm leading-tight">{book.title}</h3>
                        <div className="space-y-1 text-xs">
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
              {suggestions.books.length > 4 && (
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
