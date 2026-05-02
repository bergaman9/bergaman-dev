'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaCoins, FaBitcoin, FaDollarSign, FaChartLine } from 'react-icons/fa';

// Categories must match AssetCategoryGrid
const CATEGORIES = [
    { id: 'TL', name: 'Turkish Lira', icon: '₺' },
    { id: 'BIST', name: 'Borsa Istanbul', icon: '📈' },
    { id: 'EMTIA', name: 'Commodities', icon: '🏆' },
    { id: 'DOVIZ', name: 'Foreign Exchange', icon: '💵' },
    { id: 'KRIPTO', name: 'Crypto', icon: '₿' },
    { id: 'ABD', name: 'US Stocks', icon: '🇺🇸' },
    { id: 'FON', name: 'Investment Funds', icon: '📊' },
    { id: 'DIGER', name: 'Other', icon: '📦' },
];

export default function AddAssetModal({ isOpen, onClose, onAdd, initialData = null, initialCategory = null }) {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        cost: '',
        category: 'TL',
        symbol: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    name: '',
                    amount: '',
                    cost: '',
                    category: initialCategory || 'TL',
                    symbol: ''
                });
            }
        }
    }, [isOpen, initialData, initialCategory]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            amount: parseFloat(formData.amount),
            cost: formData.cost ? parseFloat(formData.cost) : 0
        });
        onClose();
    };

    // Symbol Options based on Category
    const getSymbolOptions = () => {
        switch (formData.category) {
            case 'EMTIA':
                return [
                    { value: '', label: 'Custom Asset', icon: '📦' },
                    { value: 'GA', label: 'Gram Gold', icon: '🥇' },
                    { value: 'GAG', label: 'Gram Silver', icon: '🥈' },
                    { value: 'GAP', label: 'Gram Platinum', icon: '⚪' },
                ];
            case 'KRIPTO':
                return [
                    { value: '', label: 'Custom Crypto', icon: '🪙' },
                    { value: 'BTC', label: 'Bitcoin', icon: '₿' },
                    { value: 'ETH', label: 'Ethereum', icon: 'Ξ' },
                    { value: 'SOL', label: 'Solana', icon: '◎' },
                    { value: 'AVAX', label: 'Avalanche', icon: '🔺' },
                ];
            case 'DOVIZ':
                return [
                    { value: '', label: 'Custom Currency', icon: '💰' },
                    { value: 'USD', label: 'US Dollar', icon: '🇺🇸' },
                    { value: 'EUR', label: 'Euro', icon: '🇪🇺' },
                ];
            default:
                return [];
        }
    };

    const symbolOptions = getSymbolOptions();

    const handleSymbolChange = (value) => {
        const selectedOption = symbolOptions.find(opt => opt.value === value);
        let newName = formData.name;
        const isDefaultName = symbolOptions.some(opt => opt.label === formData.name);
        if ((!formData.name || isDefaultName) && selectedOption) {
            newName = selectedOption.label;
        }
        setFormData({ ...formData, symbol: value, name: newName });
    };

    const currentCategory = CATEGORIES.find(c => c.id === formData.category);

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
                    aria-labelledby="finance-asset-modal-title"
                    className="relative w-full max-w-lg max-h-[calc(100vh-2rem)] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#e8c547]/10 rounded-full blur-[60px] pointer-events-none" />

                    {/* Header */}
                    <div className="relative p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e8c547]/30 to-[#e8c547]/10 flex items-center justify-center text-xl">
                                    {currentCategory?.icon || '📦'}
                                </div>
                                <div>
                                    <h2 id="finance-asset-modal-title" className="text-xl font-bold text-white">
                                        {initialData ? 'Edit Asset' : 'Add Asset'}
                                    </h2>
                                    <p className="text-xs text-gray-500">{currentCategory?.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close asset modal"
                                className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="relative p-6 space-y-5 overflow-y-auto">
                        {/* Category Selection - Chips */}
                        <div>
                            <label className="text-xs uppercase font-bold text-gray-500 mb-2 block">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat.id, symbol: '' })}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70 ${formData.category === cat.id
                                                ? 'bg-[#e8c547] text-black shadow-lg shadow-[#e8c547]/20'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <span>{cat.icon}</span>
                                        <span className="hidden sm:inline">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Symbol Selection - Chips (Conditional) */}
                        {symbolOptions.length > 0 && (
                            <div>
                                <label className="text-xs uppercase font-bold text-gray-500 mb-2 block">
                                    Asset Type <span className="text-[#e8c547]">(Live Price)</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {symbolOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleSymbolChange(opt.value)}
                                            className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70 ${formData.symbol === opt.value
                                                    ? 'bg-white/20 text-white border border-white/30'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent'
                                                }`}
                                        >
                                            <span>{opt.icon}</span>
                                            <span>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Name Input */}
                        <div>
                            <label className="text-xs uppercase font-bold text-gray-500 mb-2 block">Asset Name</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g., Apple Stock, My Bitcoin"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-[#e8c547] focus:ring-2 focus:ring-[#e8c547]/40 focus:bg-white/10 transition-all"
                            />
                        </div>

                        {/* Amount & Cost Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs uppercase font-bold text-gray-500 mb-2 block">Amount</label>
                                <input
                                    required
                                    type="number"
                                    step="any"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-[#e8c547] focus:ring-2 focus:ring-[#e8c547]/40 focus:bg-white/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase font-bold text-gray-500 mb-2 block">
                                    Total Cost <span className="text-gray-600 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="0.00"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-[#e8c547] focus:ring-2 focus:ring-[#e8c547]/40 focus:bg-white/10 transition-all"
                                />
                            </div>
                        </div>
                        <p className="text-[11px] text-gray-600 -mt-2">Enter total cost to track profit/loss.</p>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-[#e8c547] to-[#d4a84b] hover:from-[#f0d060] hover:to-[#e8c547] text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#e8c547]/20 hover:shadow-[#e8c547]/30 mt-6 focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70 motion-reduce:transition-none"
                        >
                            <FaSave /> {initialData ? 'Update Asset' : 'Save Asset'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
