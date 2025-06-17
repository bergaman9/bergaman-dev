import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Recommendation from '@/models/Recommendation';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');
    const featured = searchParams.get('featured') === 'true';
    
    let filter = { status: 'active' };
    if (category && category !== 'all') {
      // Kategorinin tam eşleşmesini sağlayalım
      filter.category = { $eq: category };
    }
    if (featured) filter.featured = true;
    
    const recommendations = await Recommendation.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit);
    
    // Add fallback data if no recommendations found
    if (recommendations.length === 0) {
      const fallbackRecommendations = generateFallbackRecommendations(category);
      
      return NextResponse.json({
        success: true,
        recommendations: fallbackRecommendations,
        message: 'Using fallback recommendations'
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Content-Type': 'application/json'
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      recommendations
    }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    
    // Return fallback data in case of error
    const fallbackRecommendations = generateFallbackRecommendations();
    
    return NextResponse.json({
      success: false,
      recommendations: fallbackRecommendations,
      error: 'Failed to fetch recommendations',
      message: 'Using fallback recommendations'
    }, {
      status: 200, // Return 200 with fallback data instead of error
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });
  }
}

// Generate fallback recommendations data
function generateFallbackRecommendations(category = 'link') {
  // Kategori belirtilmişse sadece o kategoriye ait öneriler döndür
  const allFallbacks = [
    {
      _id: 'fallback-1',
      title: 'Visual Studio Code',
      description: 'The best code editor for web development',
      category: 'link',
      image: '/images/links/default.png',
      rating: '9.5',
      recommendation: 'Visual Studio Code is my go-to editor for all web development projects. The extensions ecosystem is unmatched.',
      url: 'https://code.visualstudio.com/',
      linkType: 'Development Tool',
      status: 'active',
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'fallback-2',
      title: 'React Documentation',
      description: 'Official React documentation',
      category: 'link',
      image: '/images/links/default.png',
      rating: '9.0',
      recommendation: 'The React documentation is extremely well-written and helpful for both beginners and experienced developers.',
      url: 'https://reactjs.org/docs/getting-started.html',
      linkType: 'Documentation',
      status: 'active',
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'fallback-3',
      title: 'MongoDB Atlas',
      description: 'Cloud database service for modern applications',
      category: 'link',
      image: '/images/links/default.png',
      rating: '8.5',
      recommendation: 'MongoDB Atlas makes it easy to deploy, manage, and scale MongoDB in the cloud.',
      url: 'https://www.mongodb.com/cloud/atlas',
      linkType: 'Database Service',
      status: 'active',
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'fallback-4',
      title: 'Next.js',
      description: 'The React Framework for Production',
      category: 'link',
      image: '/images/links/default.png',
      rating: '9.2',
      recommendation: 'Next.js is the perfect framework for building modern web applications with React.',
      url: 'https://nextjs.org/',
      linkType: 'Framework',
      status: 'active',
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'fallback-5',
      title: 'TailwindCSS',
      description: 'A utility-first CSS framework',
      category: 'link',
      image: '/images/links/default.png',
      rating: '9.0',
      recommendation: 'Tailwind CSS has completely changed how I approach styling web applications.',
      url: 'https://tailwindcss.com/',
      linkType: 'CSS Framework',
      status: 'active',
      order: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Movie kategorisi için fallback
    {
      _id: 'fallback-movie-1',
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
      category: 'movie',
      image: '/images/movies/inception.jpg',
      rating: '9.3',
      year: '2010',
      director: 'Christopher Nolan',
      genre: 'Sci-Fi',
      recommendation: 'One of the most mind-bending movies ever made. The visual effects and story are incredible.',
      status: 'active',
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Game kategorisi için fallback
    {
      _id: 'fallback-game-1',
      title: 'The Witcher 3',
      description: 'An action role-playing game set in an open world.',
      category: 'game',
      image: '/images/games/witcher3.png',
      rating: '9.8',
      year: '2015',
      developer: 'CD Projekt Red',
      genre: 'RPG',
      recommendation: 'The best RPG I have ever played. The story, characters, and world are all amazing.',
      status: 'active',
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Book kategorisi için fallback
    {
      _id: 'fallback-book-1',
      title: '1984',
      description: 'A dystopian social science fiction novel.',
      category: 'book',
      image: '/images/books/1984.png',
      rating: '9.5',
      year: '1949',
      author: 'George Orwell',
      genre: 'Dystopian',
      recommendation: 'A classic that remains relevant today. The themes of government surveillance and control are more pertinent than ever.',
      status: 'active',
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Series kategorisi için fallback
    {
      _id: 'fallback-series-1',
      title: 'Foundation',
      description: 'A complex saga of humans scattered on planets throughout the galaxy.',
      category: 'series',
      image: '/images/movies/foundation.jpg',
      rating: '8.7',
      year: '2021',
      director: 'David S. Goyer',
      genre: 'Sci-Fi',
      recommendation: 'A visually stunning adaptation of Asimov\'s classic series with great world-building.',
      status: 'active',
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  if (category && category !== 'all') {
    return allFallbacks.filter(item => item.category === category);
  }
  
  return allFallbacks;
} 