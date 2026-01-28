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
            'GA': 0,
            'GAG': 0,
            'XAU': 0,
        };

        const binancePromise = axios.get('https://api.binance.com/api/v3/ticker/price');
        const forexPromise = axios.get('https://api.frankfurter.app/latest?from=USD&to=TRY,EUR,XAG');

        const [binanceRes, forexRes] = await Promise.allSettled([binancePromise, forexPromise]);

        let usdtTryPrice = 0;

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

            const paxgUsdt = getPrice('PAXGUSDT');
            if (paxgUsdt > 0) {
                rates['XAU'] = paxgUsdt;
                if (usdtTryPrice > 0) {
                    rates['GA'] = (paxgUsdt * usdtTryPrice) / 31.1035;
                }
            }
        }

        if (forexRes.status === 'fulfilled') {
            const fx = forexRes.value.data.rates;
            rates['USD'] = fx.TRY;
            if (fx.EUR) {
                rates['EUR'] = fx.TRY / fx.EUR;
            }
            // Silver Calculation
            // fx.XAG is "How many Ounces of Silver for 1 USD". 
            // So Price of 1 Oz Silver in USD = 1 / fx.XAG
            if (fx.XAG) {
                const xagUsd = 1 / fx.XAG;
                rates['GAG'] = (xagUsd * fx.TRY) / 31.1035;
            }

            if (usdtTryPrice === 0) {
                usdtTryPrice = rates['USD'];
                if (rates['XAU'] > 0) {
                    rates['GA'] = (rates['XAU'] * usdtTryPrice) / 31.1035;
                }
            }
        }

        ratesCache.data = rates;
        ratesCache.timestamp = now;

        return NextResponse.json(rates);
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
    }
}
