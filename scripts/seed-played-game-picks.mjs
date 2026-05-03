import dotenv from 'dotenv';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'games', 'picks');
const PUBLIC_DIR = '/images/games/picks';
const GAME_PICK_COPY = 'Game pick.';

const recommendationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: { type: String, trim: true },
  rating: { type: Number, min: 0, max: 10, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true, trim: true },
  developer: { type: String, required: true, trim: true },
  recommendation: { type: String, required: true, trim: true },
  featured: { type: Boolean, default: false },
  status: { type: String, default: 'active' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

recommendationSchema.index({ category: 1, status: 1, order: 1 });

const Recommendation =
  mongoose.models.Recommendation ||
  mongoose.model('Recommendation', recommendationSchema);

const playedGames = [
  { title: 'Mad Max', rating: 7, year: 2015, genre: 'Action, Open World', developer: 'Avalanche Studios', steamAppId: 234140 },
  { title: 'Mafia: Definitive Edition', rating: 10, year: 2020, genre: 'Action, Adventure', developer: 'Hangar 13', steamAppId: 1030840 },
  { title: 'Mafia II', rating: 9, year: 2010, genre: 'Action, Adventure', developer: '2K Czech', steamAppId: 1030830 },
  { title: 'Mafia III: Definitive Edition', rating: 3, year: 2016, genre: 'Action, Open World', developer: 'Hangar 13', steamAppId: 360430 },
  { title: "Assassin's Creed IV Black Flag", rating: 7, year: 2013, genre: 'Action, Adventure', developer: 'Ubisoft Montreal', steamAppId: 242050 },
  { title: "Assassin's Creed Rogue", rating: 6, year: 2015, genre: 'Action, Adventure', developer: 'Ubisoft Sofia', steamAppId: 311560 },
  { title: "Assassin's Creed Unity", rating: 7, year: 2014, genre: 'Action, Adventure', developer: 'Ubisoft Montreal', steamAppId: 289650 },
  { title: "Assassin's Creed Syndicate", rating: 8, year: 2015, genre: 'Action, Adventure', developer: 'Ubisoft Quebec', steamAppId: 368500 },
  { title: "Assassin's Creed Origins", rating: 9, year: 2017, genre: 'Action RPG, Open World', developer: 'Ubisoft Montreal', steamAppId: 582160 },
  { title: "Assassin's Creed Odyssey", rating: 9, year: 2018, genre: 'Action RPG, Open World', developer: 'Ubisoft Quebec', steamAppId: 812140 },
  { title: "Assassin's Creed Valhalla", rating: 9, year: 2020, genre: 'Action RPG, Open World', developer: 'Ubisoft Montreal', steamAppId: 2208920 },
  { title: "Assassin's Creed Mirage", rating: 8, year: 2023, genre: 'Action, Adventure', developer: 'Ubisoft Bordeaux', steamAppId: 3035570 },
  { title: 'Middle-earth: Shadow of Mordor', rating: 6, year: 2014, genre: 'Action, Adventure', developer: 'Monolith Productions', steamAppId: 241930 },
  { title: 'Middle-earth: Shadow of War', rating: 7, year: 2017, genre: 'Action RPG, Adventure', developer: 'Monolith Productions', steamAppId: 356190 },
  { title: 'Far Cry 5', rating: 7, year: 2018, genre: 'FPS, Open World', developer: 'Ubisoft Montreal', steamAppId: 552520 },
  { title: 'Far Cry New Dawn', rating: 7, year: 2019, genre: 'FPS, Open World', developer: 'Ubisoft Montreal', steamAppId: 939960 },
  { title: 'Far Cry 6', rating: 8, year: 2021, genre: 'FPS, Open World', developer: 'Ubisoft Toronto', steamAppId: 2369390 },
  { title: 'RAGE 2', rating: 7, year: 2019, genre: 'FPS, Open World', developer: 'Avalanche Studios, id Software', steamAppId: 548570 },
  { title: 'Metro Exodus', rating: 7, year: 2019, genre: 'FPS, Survival', developer: '4A Games', steamAppId: 412020 },
  { title: 'Just Cause 3', rating: 5, year: 2015, genre: 'Action, Open World', developer: 'Avalanche Studios', steamAppId: 225540 },
  { title: 'Just Cause 4', rating: 2, year: 2018, genre: 'Action, Open World', developer: 'Avalanche Studios', steamAppId: 517630 },
  { title: 'Call of Duty: WWII', rating: 8, year: 2017, genre: 'FPS, War', developer: 'Sledgehammer Games', steamAppId: 476600 },
  { title: 'Call of Duty: Ghosts', rating: 8, year: 2013, genre: 'FPS, Action', developer: 'Infinity Ward', steamAppId: 209160 },
  { title: 'Call of Duty: Modern Warfare II', rating: 8, year: 2022, genre: 'FPS, Action', developer: 'Infinity Ward', steamAppId: 3595230 },
  { title: 'Call of Duty: Modern Warfare III', rating: 7, year: 2023, genre: 'FPS, Action', developer: 'Sledgehammer Games', steamAppId: 3595270 },
  { title: 'Call of Duty: Black Ops 6', rating: 8, year: 2024, genre: 'FPS, Action', developer: 'Treyarch, Raven Software', steamAppId: 2933620 },
  { title: 'Battlefield V', rating: 9, year: 2018, genre: 'FPS, War', developer: 'DICE', steamAppId: 1238810 },
  { title: 'Battlefield 1', rating: 8, year: 2016, genre: 'FPS, War', developer: 'DICE', steamAppId: 1238840 },
  {
    title: 'Medal of Honor: Warfighter',
    rating: 7,
    year: 2012,
    genre: 'FPS, Action',
    developer: 'Danger Close Games',
    coverUrl: 'https://cdn.mobygames.com/covers/3292017-medal-of-honor-warfighter-playstation-3-front-cover.jpg',
  },
  { title: 'Wolfenstein: The New Order', rating: 9, year: 2014, genre: 'FPS, Action', developer: 'MachineGames', steamAppId: 201810 },
  { title: 'Wolfenstein: The Old Blood', rating: 9, year: 2015, genre: 'FPS, Action', developer: 'MachineGames', steamAppId: 350080 },
  { title: 'Wolfenstein: The New Colossus', rating: 10, year: 2017, genre: 'FPS, Action', developer: 'MachineGames', steamAppId: 612880 },
  { title: 'Watch Dogs', rating: 6, year: 2014, genre: 'Action, Open World', developer: 'Ubisoft Montreal', steamAppId: 243470 },
  { title: 'Watch Dogs 2', rating: 9, year: 2016, genre: 'Action, Open World', developer: 'Ubisoft Montreal', steamAppId: 447040 },
  { title: 'HITMAN 2', rating: 5, year: 2018, genre: 'Stealth, Action', developer: 'IO Interactive', steamAppId: 863550 },
  { title: 'Shadow of the Tomb Raider', rating: 7, year: 2018, genre: 'Action, Adventure', developer: 'Eidos-Montreal', steamAppId: 750920 },
  { title: 'Need for Speed Heat', rating: 9, year: 2019, genre: 'Racing, Open World', developer: 'Ghost Games', steamAppId: 1222680 },
  { title: 'Need for Speed Payback', rating: 8, year: 2017, genre: 'Racing, Action', developer: 'Ghost Games', steamAppId: 1262580 },
  { title: 'Call of Juarez: Gunslinger', rating: 8, year: 2013, genre: 'FPS, Western', developer: 'Techland', steamAppId: 204450 },
  { title: 'DOOM', rating: 7, year: 2016, genre: 'FPS, Action', developer: 'id Software', steamAppId: 379720 },
  { title: 'The Witcher 3: Wild Hunt', rating: 10, year: 2015, genre: 'RPG, Open World', developer: 'CD Projekt Red', steamAppId: 292030 },
  { title: 'Cyberpunk 2077', rating: 8, year: 2020, genre: 'RPG, Open World', developer: 'CD Projekt Red', steamAppId: 1091500 },
  { title: 'Red Dead Redemption 2', rating: 10, year: 2018, genre: 'Action, Adventure, Western', developer: 'Rockstar Games', steamAppId: 1174180 },
  { title: 'Red Dead Redemption', rating: 8, year: 2024, genre: 'Action, Adventure, Western', developer: 'Rockstar Games', steamAppId: 2668510 },
  { title: 'Grand Theft Auto: Vice City', rating: 10, year: 2002, genre: 'Action, Open World', developer: 'Rockstar North', steamAppId: 12110 },
  { title: 'Grand Theft Auto IV', rating: 9, year: 2008, genre: 'Action, Open World', developer: 'Rockstar North', steamAppId: 12210 },
  { title: 'Grand Theft Auto V', rating: 10, year: 2015, genre: 'Action, Open World', developer: 'Rockstar North', steamAppId: 271590 },
  { title: 'GTA Online', rating: 10, year: 2015, genre: 'Online, Open World', developer: 'Rockstar North', steamAppId: 271590 },
  { title: 'Red Dead Online', rating: 8, year: 2019, genre: 'Online, Western', developer: 'Rockstar Games', steamAppId: 1404210 },
  { title: 'Detroit: Become Human', rating: 10, year: 2020, genre: 'Interactive Drama', developer: 'Quantic Dream', steamAppId: 1222140 },
  { title: 'Beyond: Two Souls', rating: 9, year: 2019, genre: 'Interactive Drama', developer: 'Quantic Dream', steamAppId: 960990 },
  { title: 'Death Stranding', rating: 7, year: 2020, genre: 'Action, Adventure', developer: 'KOJIMA PRODUCTIONS', steamAppId: 1190460 },
  { title: 'Metal Gear Solid V: The Phantom Pain', rating: 5, year: 2015, genre: 'Stealth, Action', developer: 'Konami Digital Entertainment', steamAppId: 287700 },
  { title: 'ASTRONEER', rating: 5, year: 2019, genre: 'Adventure, Sandbox', developer: 'System Era Softworks', steamAppId: 361420 },
  { title: 'UNDERTALE', rating: 8, year: 2015, genre: 'RPG, Indie', developer: 'Toby Fox', steamAppId: 391540 },
  { title: 'Microsoft Flight Simulator', rating: 6, year: 2020, genre: 'Simulation', developer: 'Asobo Studio', steamAppId: 1250410 },
  { title: 'Minecraft Dungeons', rating: 8, year: 2021, genre: 'Action RPG', developer: 'Mojang Studios', steamAppId: 1672970 },
  { title: "Tom Clancy's Ghost Recon Wildlands", rating: 5, year: 2017, genre: 'Tactical Shooter, Open World', developer: 'Ubisoft Paris', steamAppId: 460930 },
  { title: "Tom Clancy's The Division 2", rating: 7, year: 2019, genre: 'Action RPG, Shooter', developer: 'Massive Entertainment', steamAppId: 2221490 },
  { title: 'God of War', rating: 10, year: 2022, genre: 'Action, Adventure', developer: 'Santa Monica Studio', steamAppId: 1593500 },
  { title: 'Sniper Elite 4', rating: 8, year: 2017, genre: 'Tactical Shooter', developer: 'Rebellion', steamAppId: 312660 },
  { title: 'Sniper Elite 5', rating: 8, year: 2022, genre: 'Tactical Shooter', developer: 'Rebellion', steamAppId: 1029690 },
  { title: 'Sleeping Dogs', rating: 10, year: 2012, genre: 'Action, Open World', developer: 'United Front Games', steamAppId: 202170 },
  { title: 'DIRT 5', rating: 4, year: 2020, genre: 'Racing', developer: 'Codemasters', steamAppId: 1038250 },
  { title: 'SnowRunner', rating: 5, year: 2021, genre: 'Simulation, Driving', developer: 'Saber Interactive', steamAppId: 1465360 },
  { title: 'Mortal Kombat 11', rating: 4, year: 2019, genre: 'Fighting', developer: 'NetherRealm Studios', steamAppId: 976310 },
  { title: 'Forza Horizon 4', rating: 8, year: 2021, genre: 'Racing, Open World', developer: 'Playground Games', steamAppId: 1293830 },
  { title: 'Forza Horizon 5', rating: 9, year: 2021, genre: 'Racing, Open World', developer: 'Playground Games', steamAppId: 1551360 },
  { title: 'The Crew 2', rating: 6, year: 2018, genre: 'Racing, Open World', developer: 'Ivory Tower', steamAppId: 646910 },
  { title: 'PUBG: LITE', rating: 9, year: 2019, genre: 'Battle Royale, Shooter', developer: 'PUBG Corporation', steamAppId: 578080, aliases: ['PUBG: BATTLEGROUNDS'] },
  { title: 'Counter-Strike: Global Offensive', rating: 10, year: 2012, genre: 'FPS, Competitive', developer: 'Valve', steamAppId: 730, aliases: ['Counter-Strike 2'] },
  { title: 'PAYDAY 2', rating: 5, year: 2013, genre: 'Co-op, FPS', developer: 'OVERKILL Software', steamAppId: 218620 },
  {
    title: 'VALORANT',
    rating: 7,
    year: 2020,
    genre: 'FPS, Competitive',
    developer: 'Riot Games',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Valorant_cover.jpg',
  },
  { title: 'Prison Architect', rating: 6, year: 2015, genre: 'Simulation, Management', developer: 'Introversion Software', steamAppId: 233450 },
  { title: 'City Car Driving', rating: 9, year: 2016, genre: 'Driving, Simulation', developer: 'Forward Development', steamAppId: 493490 },
  { title: 'Portal Knights', rating: 6, year: 2017, genre: 'Action RPG, Sandbox', developer: 'Keen Games', steamAppId: 374040 },
  { title: 'The Sims 4', rating: 6, year: 2014, genre: 'Life Simulation', developer: 'Maxis', steamAppId: 1222670 },
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function extensionForResponse(response, url) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';

  const extension = path.extname(new URL(url).pathname).replace('.', '').toLowerCase();
  return extension || 'jpg';
}

async function getStoreSearchImage(game) {
  const query = encodeURIComponent(game.title);
  const response = await fetch(`https://store.steampowered.com/api/storesearch/?term=${query}&cc=us&l=en`);
  if (!response.ok) return null;

  const data = await response.json();
  const item = data.items?.find((candidate) => candidate.id === game.steamAppId) || data.items?.[0];
  return item?.tiny_image || null;
}

async function candidateCoverUrls(game) {
  const urls = [];

  if (game.coverUrl) {
    urls.push(game.coverUrl);
  }

  if (game.steamAppId) {
    urls.push(
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/library_600x900.jpg`,
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/portrait.png`,
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/capsule_616x353.jpg`,
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/header.jpg`,
    );

    const searchImage = await getStoreSearchImage(game);
    if (searchImage) urls.push(searchImage);
  }

  return [...new Set(urls)];
}

async function downloadCover(game) {
  const slug = slugify(game.title);
  const existingExtensions = ['jpg', 'png', 'webp'];

  for (const extension of existingExtensions) {
    const existingPath = path.join(OUTPUT_DIR, `${slug}.${extension}`);
    if (await fileExists(existingPath)) {
      return `${PUBLIC_DIR}/${slug}.${extension}`;
    }
  }

  const urls = await candidateCoverUrls(game);

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 BergamanDev/1.0',
        },
      });

      if (!response.ok || !response.body) {
        continue;
      }

      const extension = extensionForResponse(response, url);
      const filename = `${slug}.${extension}`;
      const filePath = path.join(OUTPUT_DIR, filename);
      await pipeline(response.body, createWriteStream(filePath));
      return `${PUBLIC_DIR}/${filename}`;
    } catch (error) {
      console.warn(`Cover failed for ${game.title}: ${error.message}`);
    }
  }

  return '/images/portfolio/game-placeholder.svg';
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing.');
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  let upserted = 0;
  let updated = 0;

  for (const [index, game] of playedGames.entries()) {
    const image = await downloadCover(game);
    const now = new Date();

    const update = {
      $set: {
        ...game,
        category: 'game',
        description: GAME_PICK_COPY,
        recommendation: GAME_PICK_COPY,
        image,
        featured: game.rating >= 10,
        status: 'active',
        order: 2000 + index,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    };

    delete update.$set.steamAppId;
    delete update.$set.coverUrl;
    delete update.$set.aliases;

    const result = await Recommendation.findOneAndUpdate(
      { title: { $in: [game.title, ...(game.aliases || [])] }, category: 'game' },
      update,
      { upsert: true, new: true, rawResult: true },
    );

    if (result.lastErrorObject?.upserted) {
      upserted += 1;
    } else {
      updated += 1;
    }

    console.log(`${index + 1}/${playedGames.length} ${game.title} -> ${image}`);
  }

  const totalGames = await Recommendation.countDocuments({ category: 'game', status: 'active' });
  console.log(JSON.stringify({ updated, upserted, totalActiveGames: totalGames }, null, 2));

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
