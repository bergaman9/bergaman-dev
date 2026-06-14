import { NextResponse } from 'next/server';
import axios from 'axios';

// Server-side memory cache
let ratesCache = { data: null, timestamp: 0 };
const CACHE_DURATION = 60000; // 60 seconds
const OZ_TO_GRAM = 31.1035;

// Binance's public data mirror (data-api.binance.vision) is not geo-blocked the
// way api.binance.com is from cloud regions (Vercel runs in the US, where
// api.binance.com often returns HTTP 451). CoinGecko is a key-less fallback so
// crypto/gold still populate even if Binance is unreachable.
const BINANCE_TICKER = 'https://data-api.binance.vision/api/v3/ticker/price';
const COINGECKO = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,avalanche-2,pax-gold&vs_currencies=usd';
const FRANKFURTER = 'https://api.frankfurter.app/latest?from=USD&to=TRY,EUR';
const GOLD_API = (sym) => `https://api.gold-api.com/price/${sym}`;

export async function GET() {
  const now = Date.now();
  if (ratesCache.data && now - ratesCache.timestamp < CACHE_DURATION) {
    return NextResponse.json(ratesCache.data);
  }

  const rates = {
    USDT: 0, BTC: 0, ETH: 0, SOL: 0, AVAX: 0,
    USD: 0, EUR: 0, GA: 0, GAG: 0, GAP: 0, XAU: 0,
  };

  const get = (p) => axios.get(p, { timeout: 8000 });
  const [binanceRes, coingeckoRes, forexRes, goldRes, silverRes, platinumRes] =
    await Promise.allSettled([
      get(BINANCE_TICKER),
      get(COINGECKO),
      get(FRANKFURTER),
      get(GOLD_API('XAU')),
      get(GOLD_API('XAG')),
      get(GOLD_API('XPT')),
    ]);

  // --- Forex first: establishes the USD/TRY rate everything else converts with
  let usdTry = 0;
  if (forexRes.status === 'fulfilled') {
    const fx = forexRes.value.data?.rates || {};
    if (fx.TRY) {
      rates.USD = fx.TRY;
      usdTry = fx.TRY;
      if (fx.EUR) rates.EUR = fx.TRY / fx.EUR;
    }
  }

  // --- Binance (preferred for crypto + USDT/TRY + PAXG gold)
  let paxgUsd = 0;
  if (binanceRes.status === 'fulfilled' && Array.isArray(binanceRes.value.data)) {
    const data = binanceRes.value.data;
    const price = (symbol) => {
      const item = data.find((d) => d.symbol === symbol);
      return item ? parseFloat(item.price) : 0;
    };
    const usdtTry = price('USDTTRY');
    if (usdtTry > 0) {
      rates.USDT = usdtTry;
      if (!usdTry) usdTry = usdtTry; // forex fallback
    }
    const conv = rates.USDT || usdTry;
    if (conv > 0) {
      const btc = price('BTCUSDT');
      const eth = price('ETHUSDT');
      const sol = price('SOLUSDT');
      const avax = price('AVAXUSDT');
      if (btc) rates.BTC = btc * conv;
      if (eth) rates.ETH = eth * conv;
      if (sol) rates.SOL = sol * conv;
      if (avax) rates.AVAX = avax * conv;
    }
    paxgUsd = price('PAXGUSDT');
  }

  // --- CoinGecko fallback for any crypto Binance didn't provide
  if (coingeckoRes.status === 'fulfilled' && coingeckoRes.value.data) {
    const cg = coingeckoRes.value.data;
    const conv = rates.USDT || usdTry;
    const usd = (id) => cg[id]?.usd || 0;
    if (conv > 0) {
      if (!rates.BTC && usd('bitcoin')) rates.BTC = usd('bitcoin') * conv;
      if (!rates.ETH && usd('ethereum')) rates.ETH = usd('ethereum') * conv;
      if (!rates.SOL && usd('solana')) rates.SOL = usd('solana') * conv;
      if (!rates.AVAX && usd('avalanche-2')) rates.AVAX = usd('avalanche-2') * conv;
    }
    if (!paxgUsd && usd('pax-gold')) paxgUsd = usd('pax-gold');
  }

  const tryRate = rates.USD || rates.USDT || 35; // last-resort TRY rate

  // --- Gold: prefer PAXG (oz), else gold-api XAU (oz USD)
  if (paxgUsd > 0) {
    rates.XAU = paxgUsd;
  } else if (goldRes.status === 'fulfilled' && goldRes.value.data?.price) {
    rates.XAU = goldRes.value.data.price;
  }
  if (rates.XAU > 0 && tryRate > 0) {
    rates.GA = (rates.XAU * tryRate) / OZ_TO_GRAM; // gram gold in TRY
  }

  // --- Silver / Platinum (oz USD -> gram TRY)
  if (silverRes.status === 'fulfilled' && silverRes.value.data?.price) {
    rates.GAG = (silverRes.value.data.price * tryRate) / OZ_TO_GRAM;
  }
  if (platinumRes.status === 'fulfilled' && platinumRes.value.data?.price) {
    rates.GAP = (platinumRes.value.data.price * tryRate) / OZ_TO_GRAM;
  }

  // Only cache if we got something meaningful; otherwise serve stale cache.
  const gotData = rates.USD || rates.BTC || rates.GA;
  if (gotData) {
    ratesCache.data = rates;
    ratesCache.timestamp = now;
    return NextResponse.json(rates);
  }
  if (ratesCache.data) {
    return NextResponse.json(ratesCache.data);
  }
  return NextResponse.json(rates);
}
