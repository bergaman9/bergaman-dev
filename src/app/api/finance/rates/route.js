import { NextResponse } from 'next/server';
import axios from 'axios';

// Cache (Server-side memory)
let ratesCache = {
    data: null,
    timestamp: 0
};

const CACHE_DURATION = 60000; // 60 seconds

export async function GET() {
    const now = Date.now();
    if (ratesCache.data && (now - ratesCache.timestamp < CACHE_DURATION)) {
        return NextResponse.json(ratesCache.data);
    }

    try {
        const rates = {
            'USDT': 0,
            'BTC': 0,
            'ETH': 0,
            'SOL': 0,
            'AVAX': 0,
            'USD': 0,
            'EUR': 0,
            'GA': 0,   // Gram Gold
            'GAG': 0,  // Gram Silver
            'GAP': 0,  // Gram Platinum
            'XAU': 0,  // Ounce Gold (USD)
        };

        // Fetch from multiple sources in parallel
        const binancePromise = axios.get('https://api.binance.com/api/v3/ticker/price');
        const forexPromise = axios.get('https://api.frankfurter.app/latest?from=USD&to=TRY,EUR');
        const silverPromise = axios.get('https://api.gold-api.com/price/XAG');
        const platinumPromise = axios.get('https://api.gold-api.com/price/XPT');

        const [binanceRes, forexRes, silverRes, platinumRes] = await Promise.allSettled([
            binancePromise, forexPromise, silverPromise, platinumPromise
        ]);

        let usdtTryPrice = 0;

        // Binance Data (Crypto + Gold via PAXG)
        if (binanceRes.status === 'fulfilled') {
            const data = binanceRes.value.data;
            const getPrice = (symbol) => {
                const item = data.find(d => d.symbol === symbol);
                return item ? parseFloat(item.price) : 0;
            };

            usdtTryPrice = getPrice('USDTTRY');
            rates['USDT'] = usdtTryPrice;
            rates['BTC'] = getPrice('BTCUSDT') * usdtTryPrice;
            rates['ETH'] = getPrice('ETHUSDT') * usdtTryPrice;
            rates['SOL'] = getPrice('SOLUSDT') * usdtTryPrice;
            rates['AVAX'] = getPrice('AVAXUSDT') * usdtTryPrice;

            // Gold from PAXG (Gold-backed token - 1 PAXG = 1 oz Gold)
            const paxgUsdt = getPrice('PAXGUSDT');
            if (paxgUsdt > 0) {
                rates['XAU'] = paxgUsdt; // Ounce price in USD
                if (usdtTryPrice > 0) {
                    rates['GA'] = (paxgUsdt * usdtTryPrice) / 31.1035; // Gram price in TRY
                }
            }
        }

        // Forex Data (USD/EUR to TRY)
        if (forexRes.status === 'fulfilled') {
            const fx = forexRes.value.data.rates;
            rates['USD'] = fx.TRY;
            if (fx.EUR) {
                rates['EUR'] = fx.TRY / fx.EUR;
            }

            // Fallback for USD price
            if (usdtTryPrice === 0) {
                usdtTryPrice = rates['USD'];
            }
        }

        const tryRate = rates['USD'] || usdtTryPrice || 35; // Fallback TRY rate

        // Silver from gold-api.com (price is USD per ounce)
        if (silverRes.status === 'fulfilled' && silverRes.value.data?.price) {
            const silverOzUsd = silverRes.value.data.price;
            rates['GAG'] = (silverOzUsd * tryRate) / 31.1035; // Convert to gram TRY
        }

        // Platinum from gold-api.com (price is USD per ounce)
        if (platinumRes.status === 'fulfilled' && platinumRes.value.data?.price) {
            const platinumOzUsd = platinumRes.value.data.price;
            rates['GAP'] = (platinumOzUsd * tryRate) / 31.1035; // Convert to gram TRY
        }

        ratesCache.data = rates;
        ratesCache.timestamp = now;

        return NextResponse.json(rates);
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
    }
}
