const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');

// Create the directory if it doesn't exist
const gameImagesDir = path.join(process.cwd(), 'public', 'images', 'games');
if (!fs.existsSync(gameImagesDir)) {
  fs.mkdirSync(gameImagesDir, { recursive: true });
}

// List of games with image URLs to download
const gamesToDownload = [
  { name: 'forza-horizon-5', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg' },
  { name: 'gta-iv', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/12210/header.jpg' },
  { name: 'nfs-heat', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222680/header.jpg' },
  { name: 'watch-dogs-2', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/447040/header.jpg' },
  { name: 'wolfenstein-new-order', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/201810/header.jpg' },
  { name: 'wolfenstein-new-colossus', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/612880/header.jpg' },
  { name: 'wolfenstein-old-blood', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/350080/header.jpg' },
  { name: 'beyond-two-souls', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/960990/header.jpg' },
  { name: 'battlefield-v', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1238810/header.jpg' },
  { name: 'ac-odyssey', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/812140/header.jpg' },
  { name: 'ac-origins', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/582160/header.jpg' },
  { name: 'ac-valhalla', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2208920/header.jpg' },
  { name: 'god-of-war', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg' },
  { name: 'sleeping-dogs', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/202170/header.jpg' },
  { name: 'detroit-become-human', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222140/header.jpg' },
  { name: 'gta-vice-city', url: 'https://cdn.cloudflare.steamstatic.com/steam/apps/12110/header.jpg' },
];

// Also define a list of movies to download
const moviesToDownload = [
  { name: 'fight-club', url: 'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg' },
  { name: 'pulp-fiction', url: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg' },
  { name: 'the-dark-knight', url: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg' },
  { name: 'interstellar', url: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg' },
  { name: 'blade-runner-2049', url: 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg' }
];

// Function to download an image from a URL and save it to a file
async function downloadImage(url, filename) {
  try {
    // Create a write stream to save the image
    const writer = fs.createWriteStream(filename);
    
    // Download the image with axios
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }) // In case of SSL issues
    });

    // Pipe the image data to the file
    response.data.pipe(writer);

    // Return a promise that resolves when the download is complete
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Downloaded: ${path.basename(filename)}`);
        resolve();
      });
      writer.on('error', (err) => {
        console.error(`❌ Error downloading ${path.basename(filename)}:`, err);
        reject(err);
      });
    });
  } catch (error) {
    console.error(`❌ Failed to download ${path.basename(filename)}:`, error.message);
  }
}

// Function to download all images
async function downloadAllImages() {
  console.log('Starting download of game images...');
  
  const movieImagesDir = path.join(process.cwd(), 'public', 'images', 'movies');
  if (!fs.existsSync(movieImagesDir)) {
    fs.mkdirSync(movieImagesDir, { recursive: true });
  }

  // Download game images
  for (const game of gamesToDownload) {
    const filePath = path.join(gameImagesDir, `${game.name}.jpg`);
    
    // Skip if the file already exists
    if (fs.existsSync(filePath)) {
      console.log(`ℹ️ Skipping ${game.name}.jpg (already exists)`);
      continue;
    }
    
    await downloadImage(game.url, filePath);
  }
  
  // Download movie images
  for (const movie of moviesToDownload) {
    const filePath = path.join(movieImagesDir, `${movie.name}.jpg`);
    
    // Skip if the file already exists
    if (fs.existsSync(filePath)) {
      console.log(`ℹ️ Skipping ${movie.name}.jpg (already exists)`);
      continue;
    }
    
    await downloadImage(movie.url, filePath);
  }

  console.log('✅ All images downloaded successfully!');
}

downloadAllImages().catch(console.error); 