'use client';

import { useFinance } from '@/context/FinanceContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useMemo, useState, useRef } from 'react';
import { FaEye, FaEyeSlash, FaArrowUp, FaArrowDown, FaPlus, FaTrash, FaFileExport, FaFileImport } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

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

    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = importData(event.target.result);
            if (result.success) {
                alert('Backup restored successfully!');
            } else {
                alert('Failed to restore backup: ' + result.error);
            }
            e.target.value = ''; // Reset input
        };
        reader.readAsText(file);
    };

    const stats = getPortfolioStats();

    // Live Gold Price (Gram Gold)
    const goldPrice = marketRates['GA'];
    const usdPrice = marketRates['USD'];

    // Currency Conversion Helper
    const getConvertedValue = (valInTry) => {
        if (!valInTry) return 0;
        if (currency === 'TRY') return valInTry;
        const rate = marketRates[currency]; // USD or EUR
        if (!rate) return valInTry;
        return valInTry / rate;
    };

    const formatCurrency = (val) => new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val);

    const chartData = useMemo(() => {
        const categories = {};
        assets.forEach(asset => {
            const valueTry = getAssetCurrentValue(asset);
            const valueConverted = getConvertedValue(valueTry);
            categories[asset.category] = (categories[asset.category] || 0) + valueConverted;
        });

        const labels = Object.keys(categories);
        const data = Object.values(categories);

        // System Theme Colors
        const backgroundColors = [
            '#e8c547', // Gold (Primary)
            '#3e503e', // Dark Green (Secondary)
            '#ffffff', // White
            '#a1a1aa', // Gray
            '#d97706', // Amber
            '#b45309',
            '#78350f',
            '#451a03',
        ];

        return {
            labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: '#0a0a0a',
                    borderWidth: 2,
                },
            ],
        };
    }, [assets, getAssetCurrentValue, currency, marketRates]); // Re-calc on currency change

    const options = {
        cutout: '80%', // Thinner ring
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) label += ': ';
                        if (context.parsed !== null) {
                            label += formatCurrency(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
    };

    if (loading) return <div className="h-64 flex items-center justify-center text-white/50">Loading...</div>;

    const handleCreatePortfolio = (e) => {
        e.preventDefault();
        if (newPortfolioName.trim()) {
            createPortfolio(newPortfolioName);
            setNewPortfolioName('');
            setIsCreating(false);
        }
    };

    const handleReset = () => {
        if (confirm('ARE YOU SURE? This will delete ALL your portfolios and assets permanently.')) {
            resetData();
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Portfolio Switcher & Live Rates */}
            <div className="flex flex-col gap-4">
                {/* Live Rates Ticker */}
                <div className="flex gap-4 overflow-x-auto pb-0 no-scrollbar justify-start sm:justify-between items-center mask-image-fade">
                    <style jsx>{`
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        .no-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>
                    <div className="flex gap-4 min-w-max">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shrink-0">
                            <span className="text-[10px] text-[#e8c547] font-bold uppercase">Gold</span>
                            <span className="text-sm font-mono text-white">
                                {goldPrice ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(goldPrice) : '...'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shrink-0">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Silver</span>
                            <span className="text-sm font-mono text-white">
                                {marketRates['GAG'] ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 }).format(marketRates['GAG']) : '...'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shrink-0">
                            <span className="text-[10px] text-green-400 font-bold uppercase">USD</span>
                            <span className="text-sm font-mono text-white">
                                {usdPrice ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 }).format(usdPrice) : '...'}
                            </span>
                        </div>
                    </div>

                    {/* Currency Toggle */}
                    <div className="flex bg-[#0f0f0f] border border-white/10 rounded-lg p-0.5">
                        {['TRY', 'USD', 'EUR'].map(c => (
                            <button
                                key={c}
                                onClick={() => setCurrency(c)}
                                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${currency === c ? 'bg-[#e8c547] text-black' : 'text-gray-500 hover:text-white'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Import/Export */}
                <div className="flex justify-end gap-2">
                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={handleImportClick}
                        className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                        title="Import Backup"
                    >
                        <FaFileImport /> Import
                    </button>
                    <button
                        onClick={exportData}
                        className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                        title="Export Backup"
                    >
                        <FaFileExport /> Export
                    </button>
                </div>

                {/* Switcher & Reset */}
                <div className="flex items-center justify-between bg-[#0f0f0f] p-1 rounded-xl border border-white/10">
                    <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
                        {portfolios.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setCurrentPortfolioId(p.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${currentPortfolioId === p.id
                                    ? 'bg-[#e8c547] text-black shadow-lg shadow-[#e8c547]/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center border-l border-white/5 pl-1 ml-1">
                        {isCreating ? (
                            <form onSubmit={handleCreatePortfolio} className="flex items-center gap-2 ml-2">
                                <input
                                    autoFocus
                                    value={newPortfolioName}
                                    onChange={(e) => setNewPortfolioName(e.target.value)}
                                    placeholder="Name..."
                                    className="bg-black/50 border border-white/10 rounded-md px-2 py-1 text-xs text-white w-24 outline-none focus:border-[#e8c547]"
                                    onBlur={() => !newPortfolioName && setIsCreating(false)}
                                />
                                <button type="submit" className="text-[#e8c547] hover:bg-white/10 p-1.5 rounded-md"><FaPlus size={10} /></button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="p-2 text-gray-400 hover:text-[#e8c547] transition-colors"
                                title="Create Portfolio"
                            >
                                <FaPlus size={12} />
                            </button>
                        )}
                        {portfolios.length > 1 && (
                            <button
                                onClick={() => {
                                    if (confirm('Delete current portfolio?')) deletePortfolio(currentPortfolioId);
                                }}
                                className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                                title="Delete Current Portfolio"
                            >
                                <FaTrash size={12} />
                            </button>
                        )}
                        <button
                            onClick={handleReset}
                            className="p-2 text-gray-600 hover:text-red-500 transition-colors ml-1"
                            title="RESET ALL DATA"
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Circle & Balance */}
            <div className="flex flex-col items-center justify-center py-2 relative">
                <div className="relative w-64 h-64">
                    {assets.length > 0 ? (
                        <Doughnut data={chartData} options={options} />
                    ) : (
                        <div className="w-full h-full rounded-full border-8 border-white/5 flex items-center justify-center">
                            <span className="text-white/30 text-sm">No Assets</span>
                        </div>
                    )}

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="text-white/50 text-xs mb-1">Total Balance</div>
                        <div className="text-3xl font-bold text-white tracking-tight">
                            {showBalance ? formatCurrency(getConvertedValue(stats.totalValue)) : '***'}
                        </div>
                    </div>
                </div>

                {/* Privacy Toggle */}
                <button onClick={() => setShowBalance(!showBalance)} className="mt-4 text-white/30 hover:text-white transition-colors">
                    {showBalance ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Cost */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center">
                    <span className="text-xs text-white/50 uppercase font-bold mb-1">Total Cost</span>
                    <span className="text-lg font-mono text-white/80">
                        {showBalance ? formatCurrency(getConvertedValue(stats.totalCost)) : '***'}
                    </span>
                </div>

                {/* Profit/Loss */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center relative overflow-hidden group">
                    <span className="text-xs text-white/50 uppercase font-bold mb-1">Profit / Loss</span>
                    <div className={`flex items-center gap-2 font-bold text-lg ${stats.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {showBalance ? (
                            <>
                                {stats.totalProfitLoss >= 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                                {formatCurrency(getConvertedValue(Math.abs(stats.totalProfitLoss)))}
                            </>
                        ) : '***'}
                    </div>
                    {/* Percentage Badge */}
                    <div className={`text-xs px-2 py-0.5 rounded-full mt-1 ${stats.totalProfitLoss >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {showBalance ? `${stats.totalProfitLossPercentage.toFixed(2)}%` : '%**'}
                    </div>
                </div>
            </div>
        </div>
    );
}
