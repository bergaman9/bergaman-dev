import Header from "../components/Header";
import Footer from "../components/Footer";

const suggestions = {
  games: [
    { title: "The Witcher 3: Wild Hunt", description: "An epic RPG adventure.", image: "/images/witcher3.jpg" },
    { title: "Cyberpunk 2077", description: "A futuristic open-world RPG.", image: "/images/cyberpunk2077.jpg" },
  ],
  movies: [
    { title: "Inception", description: "A mind-bending thriller.", image: "/images/inception.jpg" },
    { title: "The Matrix", description: "A revolutionary sci-fi film.", image: "/images/matrix.jpg" },
  ],
  books: [
    { title: "1984", description: "A dystopian classic.", image: "/images/1984.jpg" },
    { title: "Sapiens", description: "A brief history of humankind.", image: "/images/sapiens.jpg" },
  ],
};

export default function SuggestionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0e1b12] to-[#2a3b22] text-[#d1d5db]">
      {/* Header */}
      <Header showHomeLink={true}/>

      {/* Main Content */}
      <main className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto px-6 mt-12">
        <h1 className="text-3xl font-bold text-[#e8c547]">Suggestions</h1>

        <section className="w-full">
          <h2 className="text-xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3">Video Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {suggestions.games.map((game, index) => (
              <div
                key={index}
                className="border border-[#3e503e] p-4 rounded-lg bg-[#2e3d29] text-center"
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-bold">{game.title}</h3>
                <p>{game.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full">
          <h2 className="text-xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3">Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {suggestions.movies.map((movie, index) => (
              <div
                key={index}
                className="border border-[#3e503e] p-4 rounded-lg bg-[#2e3d29] text-center"
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-bold">{movie.title}</h3>
                <p>{movie.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full">
          <h2 className="text-xl font-semibold text-[#e8c547] border-b border-[#3e503e] pb-3">Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {suggestions.books.map((book, index) => (
              <div
                key={index}
                className="border border-[#3e503e] p-4 rounded-lg bg-[#2e3d29] text-center"
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-bold">{book.title}</h3>
                <p>{book.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
