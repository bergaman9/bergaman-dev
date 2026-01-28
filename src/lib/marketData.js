// Client-side fetcher that calls our own API route
export const fetchMarketRates = async () => {
    try {
        const response = await fetch('/api/finance/rates');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch market rates:", error);
        return {}; // Return empty or cached if managed elsewhere (but React Query/Context handles state)
    }
};

export const SYMBOL_MAP = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'SOL': 'Solana',
    'AVAX': 'Avalanche',
    'USDT': 'Tether / Dolar',
    'USD': 'Amerikan Doları',
    'EUR': 'Euro',
    'GA': 'Gram Altın (24K)',
    'GAG': 'Gram Gümüş',
};
