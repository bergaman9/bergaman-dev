'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
    const [portfolios, setPortfolios] = useState([{ id: 'default', name: 'Main Portfolio', assets: [] }]);
    const [currentPortfolioId, setCurrentPortfolioId] = useState('default');
    const [loading, setLoading] = useState(true);
    const [marketRates, setMarketRates] = useState({});
    const [currency, setCurrency] = useState('TRY');

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedPortfolios = localStorage.getItem('finance_portfolios');
        const savedAssets = localStorage.getItem('finance_portfolio_assets'); // Legacy support
        const savedCurrency = localStorage.getItem('finance_currency'); // Load currency

        if (savedPortfolios) {
            setPortfolios(JSON.parse(savedPortfolios));
            const lastActive = localStorage.getItem('finance_current_portfolio_id');
            if (lastActive) setCurrentPortfolioId(lastActive);
        } else if (savedAssets) {
            // Migrate legacy single list to portfolios
            setPortfolios([{ id: 'default', name: 'Main Portfolio', assets: JSON.parse(savedAssets) }]);
            localStorage.removeItem('finance_portfolio_assets'); // Clean up legacy
        }

        if (savedCurrency) setCurrency(savedCurrency);
        setLoading(false);
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        if (!loading) {
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
        localStorage.removeItem('finance_portfolios');
        localStorage.removeItem('finance_portfolio_assets'); // Original legacy key
        localStorage.removeItem('finance_assets'); // New key mentioned in instruction for reset
        localStorage.removeItem('finance_current_portfolio_id');
        localStorage.removeItem('finance_currency');
        setPortfolios([{ id: 'default', name: 'Main Portfolio', assets: [] }]);
        setCurrentPortfolioId('default');
        setCurrency('TRY');
    };

    const exportData = () => {
        const data = {
            version: 1,
            timestamp: new Date().toISOString(),
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

            // Basic validation
            if (!data.portfolios || !Array.isArray(data.portfolios)) {
                throw new Error('Invalid backup format: Missing portfolios');
            }

            // Apply data
            setPortfolios(data.portfolios);
            if (data.currency) setCurrency(data.currency);

            // Reset active portfolio to first available or default
            const newActiveId = data.portfolios[0]?.id || 'default';
            setCurrentPortfolioId(newActiveId);

            return { success: true };
        } catch (error) {
            console.error('Import failed:', error);
            return { success: false, error: error.message };
        }
    };

    // Helper to get active assets
    const activeAssets = portfolios.find(p => p.id === currentPortfolioId)?.assets || [];

    const getAssetsByCategory = (category) => {
        return activeAssets.filter((asset) => asset.category === category);
    };

    const addAsset = (asset) => {
        const newAsset = { ...asset, id: Date.now().toString() };
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
                return { ...p, assets: p.assets.map(a => a.id === assetId ? { ...a, ...updatedFields } : a) };
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
