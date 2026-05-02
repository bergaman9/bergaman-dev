'use client';

import { useFinance } from '@/context/FinanceContext';
import { useEffect } from 'react';
import { FaTrash, FaPlus, FaPen, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function AssetListModal({ isOpen, onClose, category, onAddClick, onEditClick }) {
    const { getAssetsByCategory, removeAsset, getAssetCurrentValue, getAssetProfitLoss, marketRates, currency } = useFinance();
    const assets = getAssetsByCategory(category);

    const formatCurrency = (val) => new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
        style: 'currency', currency: currency, maximumFractionDigits: 0
    }).format(val);

    const getConvertedValue = (valInTry) => {
        if (!valInTry) return 0;
        if (currency === 'TRY') return valInTry;
        const rate = marketRates[currency];
        if (!rate) return valInTry;
        return valInTry / rate;
    };

    // Total value calculation
    const totalValue = assets.reduce((sum, asset) => sum + getAssetCurrentValue(asset), 0);
    const totalPL = assets.reduce((sum, asset) => sum + getAssetProfitLoss(asset).amount, 0);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="finance-category-modal-title"
                    className="relative w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl pointer-events-auto max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#e8c547]/10 rounded-full blur-[60px] pointer-events-none" />

                    {/* Header */}
                    <div className="relative p-6 border-b border-white/10">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 id="finance-category-modal-title" className="text-2xl font-bold text-white">{category}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {assets.length} assets • {currency}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close asset list"
                                className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Summary Stats */}
                        {assets.length > 0 && (
                            <div className="flex gap-6 mt-4">
                                <div>
                                    <div className="text-[10px] text-white/40 uppercase">Total Value</div>
                                    <div className="text-lg font-bold text-white">{formatCurrency(getConvertedValue(totalValue))}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40 uppercase">Total P/L</div>
                                    <div className={`text-lg font-bold flex items-center gap-1 ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {totalPL >= 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                                        {formatCurrency(getConvertedValue(Math.abs(totalPL)))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {assets.length === 0 ? (
                            <div className="text-center py-16 px-6">
                                <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center text-4xl mb-4">
                                    📭
                                </div>
                                <h3 className="text-lg font-semibold text-white/80 mb-2">No Assets Yet</h3>
                                <p className="text-gray-500 text-sm">Add your first asset to start tracking.</p>
                            </div>
                        ) : (
                            <div className="p-4 space-y-3">
                                {assets.map((asset) => {
                                    const pl = getAssetProfitLoss(asset);
                                    const currentValue = getAssetCurrentValue(asset);
                                    const isProfit = pl.amount >= 0;
                                    const livePrice = asset.symbol ? marketRates[asset.symbol] : 0;

                                    return (
                                        <div
                                            key={asset.id}
                                            className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all motion-reduce:transition-none"
                                        >
                                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                                                {/* Asset Icon */}
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8c547]/20 to-[#e8c547]/5 flex items-center justify-center text-xl shrink-0">
                                                    {asset.symbol === 'GA' && '🥇'}
                                                    {asset.symbol === 'GAG' && '🥈'}
                                                    {asset.symbol === 'GAP' && '⚪'}
                                                    {asset.symbol === 'BTC' && '₿'}
                                                    {asset.symbol === 'ETH' && 'Ξ'}
                                                    {asset.symbol === 'USD' && '💵'}
                                                    {asset.symbol === 'EUR' && '💶'}
                                                    {!asset.symbol && '📦'}
                                                    {asset.symbol && !['GA', 'GAG', 'GAP', 'BTC', 'ETH', 'USD', 'EUR'].includes(asset.symbol) && '📊'}
                                                </div>

                                                {/* Asset Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-white truncate">{asset.name}</span>
                                                        {asset.symbol && (
                                                            <span className="text-[10px] px-2 py-0.5 bg-[#e8c547]/20 text-[#e8c547] rounded-full font-bold">
                                                                {asset.symbol}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-0.5">
                                                        {parseFloat(asset.amount).toLocaleString('tr-TR')} units
                                                        {livePrice > 0 && (
                                                            <span className="text-gray-600"> • {formatCurrency(getConvertedValue(livePrice))}/unit</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Value & P/L */}
                                                <div className="text-right shrink-0 ml-auto">
                                                    <div className="font-bold text-white">
                                                        {formatCurrency(getConvertedValue(currentValue))}
                                                    </div>
                                                    <div className={`text-xs flex items-center justify-end gap-1 ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {isProfit ? '+' : ''}{formatCurrency(getConvertedValue(pl.amount))}
                                                        <span className="opacity-60">({pl.percentage.toFixed(1)}%)</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-1 opacity-100 sm:opacity-70 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity shrink-0">
                                                    <button
                                                        onClick={() => onEditClick(asset)}
                                                        aria-label={`Edit ${asset.name}`}
                                                        className="p-2 text-gray-400 hover:text-[#e8c547] hover:bg-white/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70"
                                                        title="Edit"
                                                    >
                                                        <FaPen size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Delete ${asset.name}?`)) removeAsset(asset.id);
                                                        }}
                                                        aria-label={`Delete ${asset.name}`}
                                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-400/70"
                                                        title="Delete"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10 bg-black/30">
                        <button
                            onClick={onAddClick}
                            className="w-full py-3.5 bg-gradient-to-r from-[#e8c547] to-[#d4a84b] hover:from-[#f0d060] hover:to-[#e8c547] text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#e8c547]/20 hover:shadow-[#e8c547]/30 focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70"
                        >
                            <FaPlus /> Add New Asset
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
