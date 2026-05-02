'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();
const FINANCE_SCHEMA_VERSION = 2;
const FINANCE_STORAGE_KEY = 'finance_data_v2';
const DEFAULT_PORTFOLIO = { id: 'default', name: 'Main Portfolio', assets: [] };
const ALLOWED_CURRENCIES = new Set(['TRY', 'USD', 'EUR']);
const ALLOWED_CATEGORIES = new Set(['TL', 'BIST', 'EMTIA', 'DOVIZ', 'KRIPTO', 'ABD', 'FON', 'DIGER']);

const createClientId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const sanitizeText = (value, maxLength, fallback = '') => {
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    return trimmed.slice(0, maxLength) || fallback;
};

const sanitizeNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : 0;
};

const sanitizeAsset = (asset) => ({
    id: sanitizeText(asset?.id, 80, createClientId()),
    name: sanitizeText(asset?.name, 120, 'Unnamed Asset'),
    amount: sanitizeNumber(asset?.amount),
    cost: sanitizeNumber(asset?.cost),
    category: ALLOWED_CATEGORIES.has(asset?.category) ? asset.category : 'DIGER',
    symbol: sanitizeText(asset?.symbol, 16, '').toUpperCase().replace(/[^A-Z0-9_-]/g, '')
});

const sanitizePortfolio = (portfolio) => ({
    id: sanitizeText(portfolio?.id, 80, createClientId()),
    name: sanitizeText(portfolio?.name, 80, 'Portfolio'),
    assets: Array.isArray(portfolio?.assets) ? portfolio.assets.slice(0, 500).map(sanitizeAsset) : []
});

const sanitizeFinancePayload = (payload) => {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid backup format');
    }

    if (![1, FINANCE_SCHEMA_VERSION].includes(payload.version)) {
        throw new Error('Unsupported or missing finance backup version');
    }

    if (!Array.isArray(payload.portfolios)) {
        throw new Error('Invalid backup format: Missing portfolios');
    }

    const portfolios = payload.portfolios.slice(0, 25).map(sanitizePortfolio);
    if (portfolios.length === 0) {
        throw new Error('Invalid backup format: No portfolios found');
    }

    const currentPortfolioId = sanitizeText(payload.currentPortfolioId, 80, portfolios[0].id);
    const currency = ALLOWED_CURRENCIES.has(payload.currency) ? payload.currency : 'TRY';

    return {
        version: FINANCE_SCHEMA_VERSION,
        currency,
        currentPortfolioId: portfolios.some((portfolio) => portfolio.id === currentPortfolioId)
            ? currentPortfolioId
            : portfolios[0].id,
        portfolios
    };
};

export function FinanceProvider({ children }) {
    const [portfolios, setPortfolios] = useState([DEFAULT_PORTFOLIO]);
    const [currentPortfolioId, setCurrentPortfolioId] = useState('default');
    const [loading, setLoading] = useState(true);
    const [marketRates, setMarketRates] = useState({});
    const [currency, setCurrency] = useState('TRY');

    // Load from LocalStorage on mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem(FINANCE_STORAGE_KEY);
            const savedPortfolios = localStorage.getItem('finance_portfolios');
            const savedAssets = localStorage.getItem('finance_portfolio_assets'); // Legacy support
            const savedCurrency = localStorage.getItem('finance_currency'); // Legacy support

            if (savedData) {
                const restored = sanitizeFinancePayload(JSON.parse(savedData));
                setPortfolios(restored.portfolios);
                setCurrentPortfolioId(restored.currentPortfolioId);
                setCurrency(restored.currency);
            } else if (savedPortfolios) {
                const restored = sanitizeFinancePayload({
                    version: 1,
                    portfolios: JSON.parse(savedPortfolios),
                    currentPortfolioId: localStorage.getItem('finance_current_portfolio_id'),
                    currency: savedCurrency
                });
                setPortfolios(restored.portfolios);
                setCurrentPortfolioId(restored.currentPortfolioId);
                setCurrency(restored.currency);
            } else if (savedAssets) {
                const restored = sanitizeFinancePayload({
                    version: 1,
                    currency: savedCurrency,
                    portfolios: [{ ...DEFAULT_PORTFOLIO, assets: JSON.parse(savedAssets) }]
                });
                setPortfolios(restored.portfolios);
                setCurrentPortfolioId(restored.currentPortfolioId);
                setCurrency(restored.currency);
                localStorage.removeItem('finance_portfolio_assets'); // Clean up legacy
            } else if (ALLOWED_CURRENCIES.has(savedCurrency)) {
                setCurrency(savedCurrency);
            }
        } catch {
            setPortfolios([DEFAULT_PORTFOLIO]);
            setCurrentPortfolioId('default');
            setCurrency('TRY');
        }
        setLoading(false);
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify({
                version: FINANCE_SCHEMA_VERSION,
                portfolios,
                currentPortfolioId,
                currency
            }));
            localStorage.setItem('finance_portfolios', JSON.stringify(portfolios));
            localStorage.setItem('finance_current_portfolio_id', currentPortfolioId);
            localStorage.setItem('finance_currency', currency);
        }
    }, [portfolios, currentPortfolioId, currency, loading]);

    // Fetch Market Rates (Optimized: fetch every 60s)
    useEffect(() => {
        const loadRates = async () => {
            const { fetchMarketRates } = await import('@/lib/marketData');
            const rates = await fetchMarketRates();
            setMarketRates(rates);
        };
        loadRates();
        const interval = setInterval(loadRates, 60000);
        return () => clearInterval(interval);
    }, []);

    // --- Actions ---

    const createPortfolio = (name) => {
        const newId = Date.now().toString();
        const newPortfolio = { id: newId, name, assets: [] };
        setPortfolios(prev => [...prev, newPortfolio]);
        setCurrentPortfolioId(newId);
    };

    const deletePortfolio = (id) => {
        if (portfolios.length <= 1) return; // Prevent deleting last one
        const updated = portfolios.filter(p => p.id !== id);
        setPortfolios(updated);
        if (currentPortfolioId === id) {
            setCurrentPortfolioId(updated[0].id);
        }
    };

    const renamePortfolio = (id, newName) => {
        setPortfolios(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
    };

    const resetData = () => {
        localStorage.removeItem(FINANCE_STORAGE_KEY);
        localStorage.removeItem('finance_portfolios');
        localStorage.removeItem('finance_portfolio_assets'); // Original legacy key
        localStorage.removeItem('finance_assets'); // New key mentioned in instruction for reset
        localStorage.removeItem('finance_current_portfolio_id');
        localStorage.removeItem('finance_currency');
        setPortfolios([DEFAULT_PORTFOLIO]);
        setCurrentPortfolioId('default');
        setCurrency('TRY');
    };

    const exportData = () => {
        const data = {
            version: FINANCE_SCHEMA_VERSION,
            timestamp: new Date().toISOString(),
            currentPortfolioId,
            currency,
            portfolios
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const importData = (jsonData) => {
        try {
            const data = JSON.parse(jsonData);

            const restored = sanitizeFinancePayload(data);

            setPortfolios(restored.portfolios);
            setCurrency(restored.currency);
            setCurrentPortfolioId(restored.currentPortfolioId);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Helper to get active assets
    const activeAssets = portfolios.find(p => p.id === currentPortfolioId)?.assets || [];

    const getAssetsByCategory = (category) => {
        return activeAssets.filter((asset) => asset.category === category);
    };

    const addAsset = (asset) => {
        const newAsset = sanitizeAsset({ ...asset, id: createClientId() });
        setPortfolios(prev => prev.map(p => {
            if (p.id === currentPortfolioId) {
                return { ...p, assets: [...p.assets, newAsset] };
            }
            return p;
        }));
    };

    const removeAsset = (assetId) => {
        setPortfolios(prev => prev.map(p => {
            if (p.id === currentPortfolioId) {
                return { ...p, assets: p.assets.filter(a => a.id !== assetId) };
            }
            return p;
        }));
    };

    const updateAsset = (assetId, updatedFields) => {
        setPortfolios(prev => prev.map(p => {
            if (p.id === currentPortfolioId) {
                return { ...p, assets: p.assets.map(a => a.id === assetId ? sanitizeAsset({ ...a, ...updatedFields, id: a.id }) : a) };
            }
            return p;
        }));
    };

    // --- Calculations ---

    const getAssetCurrentValue = (asset) => {
        if (!asset.symbol || !marketRates[asset.symbol]) return 0;
        return parseFloat(asset.amount) * marketRates[asset.symbol];
    };

    const getAssetCostValue = (asset) => {
        return parseFloat(asset.amount) * parseFloat(asset.cost || 0);
    };

    const getAssetProfitLoss = (asset) => {
        const currentVal = getAssetCurrentValue(asset);
        const costVal = getAssetCostValue(asset);
        if (!costVal || costVal === 0) return { amount: 0, percentage: 0 };
        return {
            amount: currentVal - costVal,
            percentage: ((currentVal - costVal) / costVal) * 100
        };
    };

    const getPortfolioStats = () => {
        let totalValue = 0;
        let totalCost = 0;
        activeAssets.forEach(asset => {
            totalValue += getAssetCurrentValue(asset);
            totalCost += getAssetCostValue(asset);
        });

        return {
            totalValue,
            totalCost,
            totalProfitLoss: totalValue - totalCost,
            totalProfitLossPercentage: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0
        };
    };

    return (
        <FinanceContext.Provider
            value={{
                assets: activeAssets, // Expose only active assets to consumers mostly
                portfolios,
                currentPortfolioId,
                loading,
                marketRates,
                createPortfolio,
                deletePortfolio,
                renamePortfolio,
                setCurrentPortfolioId,
                addAsset,
                removeAsset,
                updateAsset,
                getAssetsByCategory,
                getAssetCurrentValue,
                getAssetCostValue,
                getAssetProfitLoss,
                getPortfolioStats,
                currency,
                setCurrency,
                resetData,
                exportData,
                importData
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
}

export function useFinance() {
    return useContext(FinanceContext);
}
