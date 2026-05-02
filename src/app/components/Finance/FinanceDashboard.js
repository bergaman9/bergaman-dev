'use client';

import { useFinance } from '@/context/FinanceContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useMemo, useState, useRef } from 'react';
import { FaEye, FaEyeSlash, FaArrowUp, FaArrowDown, FaPlus, FaTrash, FaFileExport, FaFileImport, FaWallet, FaCog } from 'react-icons/fa';
import { SkeletonBox, SkeletonCard } from '../Skeleton';

ChartJS.register(ArcElement, Tooltip, Legend);

// Precious Metals - shown prominently
const METALS = [
    { key: 'GA', label: 'Gold', unit: '/g', color: 'from-yellow-400 to-amber-600', bg: 'bg-gradient-to-br from-yellow-500/20 to-amber-600/10' },
    { key: 'GAG', label: 'Silver', unit: '/g', color: 'from-gray-300 to-gray-500', bg: 'bg-gradient-to-br from-gray-400/20 to-gray-600/10' },
    { key: 'GAP', label: 'Platinum', unit: '/g', color: 'from-cyan-200 to-cyan-400', bg: 'bg-gradient-to-br from-cyan-300/20 to-cyan-500/10' },
];

// Other rates - compact display
const OTHER_RATES = [
    { key: 'USD', label: 'USD/TRY', icon: '🇺🇸' },
    { key: 'EUR', label: 'EUR/TRY', icon: '🇪🇺' },
    { key: 'BTC', label: 'Bitcoin', icon: '₿' },
    { key: 'ETH', label: 'Ethereum', icon: 'Ξ' },
];

export default function FinanceDashboard() {
    const {
        assets,
        getPortfolioStats,
        loading,
        getAssetCurrentValue,
        marketRates,
        portfolios,
        currentPortfolioId,
        setCurrentPortfolioId,
        createPortfolio,
        deletePortfolio,
        currency,
        setCurrency,
        resetData,
        exportData,
        importData
    } = useFinance();

    const [showBalance, setShowBalance] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newPortfolioName, setNewPortfolioName] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [importStatus, setImportStatus] = useState(null);

    const fileInputRef = useRef(null);

    const handleImportClick = () => fileInputRef.current?.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type && file.type !== 'application/json') {
            setImportStatus({ type: 'error', message: 'Import only accepts JSON backup files.' });
            e.target.value = '';
            return;
        }
        if (file.size > 1024 * 1024) {
            setImportStatus({ type: 'error', message: 'Backup file is too large. Maximum size is 1 MB.' });
            e.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = importData(event.target.result);
            if (result.success) {
                setImportStatus({ type: 'success', message: 'Backup restored successfully.' });
            } else {
                setImportStatus({ type: 'error', message: `Backup import failed: ${result.error}` });
            }
            e.target.value = '';
        };
        reader.onerror = () => {
            setImportStatus({ type: 'error', message: 'Backup file could not be read.' });
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    const stats = getPortfolioStats();

    const getConvertedValue = (valInTry) => {
        if (!valInTry) return 0;
        if (currency === 'TRY') return valInTry;
        const rate = marketRates[currency];
        if (!rate) return valInTry;
        return valInTry / rate;
    };

    const formatCurrency = (val) => new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
        style: 'currency', currency: currency, maximumFractionDigits: 0
    }).format(val);

    const formatCompact = (val) => {
        if (!val) return '...';
        // Show full price, no K/M rounding
        return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(val);
    };


    const chartData = useMemo(() => {
        const categories = {};
        assets.forEach(asset => {
            const valueTry = getAssetCurrentValue(asset);
            const valueConverted = getConvertedValue(valueTry);
            categories[asset.category] = (categories[asset.category] || 0) + valueConverted;
        });

        return {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#e8c547', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'],
                borderColor: '#000',
                borderWidth: 2,
            }],
        };
    }, [assets, getAssetCurrentValue, currency, marketRates]);

    const options = {
        cutout: '70%',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}` } } },
    };

    if (loading) {
        return (
            <div className="space-y-6" aria-busy="true">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <SkeletonCard key={index} showImage={false} rows={2} footer={false} />
                    ))}
                </div>
                <SkeletonBox className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    const handleCreatePortfolio = (e) => {
        e.preventDefault();
        if (newPortfolioName.trim()) {
            createPortfolio(newPortfolioName);
            setNewPortfolioName('');
            setIsCreating(false);
        }
    };

    const handleReset = () => {
        if (window.confirm('Delete all local finance data from this browser? This cannot be undone.')) resetData();
    };

    const currentPortfolio = portfolios.find(p => p.id === currentPortfolioId);

    return (
        <div className="space-y-6">
            {/* Hero Balance Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 p-6">
                {/* Decorative gold glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8c547]/10 rounded-full blur-[80px] pointer-events-none" />

                {/* Portfolio Selector */}
                <div className="flex items-center gap-3 mb-6">
                    <FaWallet className="text-[#e8c547]" />
                    <select
                        value={currentPortfolioId}
                        onChange={(e) => setCurrentPortfolioId(e.target.value)}
                    aria-label="Current portfolio"
                    className="bg-transparent text-white font-semibold text-lg outline-none cursor-pointer hover:text-[#e8c547] transition-colors focus:ring-2 focus:ring-[#e8c547]/70 rounded-lg"
                    >
                        {portfolios.map(p => (
                            <option key={p.id} value={p.id} className="bg-black">{p.name}</option>
                        ))}
                    </select>
                    <div className="flex-1" />
                    {isCreating ? (
                        <form onSubmit={handleCreatePortfolio} className="flex gap-2">
                            <input
                                autoFocus
                                value={newPortfolioName}
                                onChange={(e) => setNewPortfolioName(e.target.value)}
                                placeholder="Name..."
                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white w-28 outline-none focus:border-[#e8c547] focus:ring-2 focus:ring-[#e8c547]/40"
                            />
                            <button type="submit" className="bg-[#e8c547] text-black px-3 py-1.5 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70">Add</button>
                            <button type="button" onClick={() => setIsCreating(false)} aria-label="Cancel portfolio creation" className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70 rounded">✕</button>
                        </form>
                    ) : (
                        <button onClick={() => setIsCreating(true)} aria-label="Create portfolio" className="p-2 text-gray-500 hover:text-[#e8c547] hover:bg-white/5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70">
                            <FaPlus size={14} />
                        </button>
                    )}
                    <button onClick={() => setShowSettings(!showSettings)} aria-label="Toggle finance settings" aria-expanded={showSettings} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70">
                        <FaCog size={14} />
                    </button>
                </div>

                {/* Main Balance Display */}
                <div className="flex items-center gap-8">
                    {/* Chart */}
                    <div className="relative w-28 h-28 shrink-0">
                        {assets.length > 0 ? (
                            <Doughnut data={chartData} options={options} />
                        ) : (
                            <div className="w-full h-full rounded-full border-4 border-dashed border-white/10 flex items-center justify-center">
                                <span className="text-white/20 text-xs">No Data</span>
                            </div>
                        )}
                        {/* Center text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] text-white/40 font-bold">{assets.length} ASSETS</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Total Balance</div>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    {showBalance ? formatCurrency(getConvertedValue(stats.totalValue)) : '••••••'}
                                </span>
                                <button onClick={() => setShowBalance(!showBalance)} aria-label={showBalance ? 'Hide balance' : 'Show balance'} className="text-white/30 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70 rounded">
                                    {showBalance ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div>
                                <div className="text-[10px] text-white/30 uppercase">Cost Basis</div>
                                <div className="text-sm text-white/60 font-mono">
                                    {showBalance ? formatCurrency(getConvertedValue(stats.totalCost)) : '••••'}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-white/30 uppercase">Profit/Loss</div>
                                <div className={`text-sm font-mono flex items-center gap-1 ${stats.totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {showBalance ? (
                                        <>
                                            {stats.totalProfitLoss >= 0 ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                                            {formatCurrency(getConvertedValue(Math.abs(stats.totalProfitLoss)))}
                                            <span className="text-[10px] opacity-60">({stats.totalProfitLossPercentage.toFixed(1)}%)</span>
                                        </>
                                    ) : '••••'}
                                </div>
                            </div>
                        </div>

                        {/* Currency Toggle */}
                        <div className="flex gap-1 pt-2">
                            {['TRY', 'USD', 'EUR'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setCurrency(c)}
                                    aria-pressed={currency === c}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70 ${currency === c
                                        ? 'bg-[#e8c547] text-black shadow-lg shadow-[#e8c547]/20'
                                        : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Settings Panel (Collapsible) */}
                {showSettings && (
                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-3">
                        <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                        <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70">
                            <FaFileImport /> Import
                        </button>
                        <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70">
                            <FaFileExport /> Export
                        </button>
                        {portfolios.length > 1 && (
                            <button onClick={() => window.confirm(`Delete portfolio "${currentPortfolio?.name}" from this browser?`) && deletePortfolio(currentPortfolioId)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm text-red-400 hover:text-red-300 transition-all focus:outline-none focus:ring-2 focus:ring-red-400/70">
                                <FaTrash /> Delete Portfolio
                            </button>
                        )}
                        <button onClick={handleReset} className="ml-auto flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/30 border border-red-500/20 rounded-lg text-sm text-red-500 hover:text-red-400 transition-all focus:outline-none focus:ring-2 focus:ring-red-400/70">
                            Reset All Data
                        </button>
                        {importStatus && (
                            <p
                                role="status"
                                className={`basis-full text-xs ${importStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
                            >
                                {importStatus.message}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Precious Metals Cards */}
            <div className="grid grid-cols-3 gap-3">
                {METALS.map(metal => {
                    const price = marketRates[metal.key];
                    return (
                        <div key={metal.key} className={`${metal.bg} rounded-2xl border border-white/10 p-4 relative overflow-hidden group hover:border-white/20 transition-all`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${metal.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                            <div className="relative">
                                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{metal.label}</div>
                                <div className={`text-xl font-bold bg-gradient-to-r ${metal.color} bg-clip-text text-transparent`}>
                                    {price ? `₺${formatCompact(price)}` : '...'}
                                </div>
                                <div className="text-[10px] text-white/30">{metal.unit}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Other Rates - Compact Row */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-3">
                <div className="flex items-center justify-between gap-4 overflow-x-auto">
                    {OTHER_RATES.map(rate => {
                        const price = marketRates[rate.key];
                        return (
                            <div key={rate.key} className="flex items-center gap-2 min-w-0">
                                <span className="text-base">{rate.icon}</span>
                                <div className="min-w-0">
                                    <div className="text-[10px] text-white/40 truncate">{rate.label}</div>
                                    <div className="text-sm font-mono text-white/80">
                                        {price ? `₺${formatCompact(price)}` : '...'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
