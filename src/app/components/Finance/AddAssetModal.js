'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaCoins } from 'react-icons/fa';
import Modal from '../UI/Modal';

// Categories must match AssetCategoryGrid
const CATEGORIES = [
    { id: 'TL', name: 'Turkish Lira' },
    { id: 'BIST', name: 'Borsa Istanbul' },
    { id: 'EMTIA', name: 'Commodities' },
    { id: 'DOVIZ', name: 'Foreign Currency' },
    { id: 'CRYPTO', name: 'Crypto Assets' },
    { id: 'ABD', name: 'US Stocks' },
    { id: 'FON', name: 'Investment Funds' },
    { id: 'DIGER', name: 'Other' },
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
                    category: initialCategory || 'TL', // Use initialCategory if provided
                    symbol: ''
                });
            }
        }
    }, [isOpen, initialData, initialCategory]);

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
            case 'EMTIA': // Commodities
                return [
                    { value: '', label: 'Custom Asset' },
                    { value: 'GA', label: 'Gram Gold (Has Altın)' },
                    { value: 'GAG', label: 'Gram Silver (Gümüş)' },
                    { value: 'XAU', label: 'Ons Gold' },
                ];
            case 'CRYPTO':
                return [
                    { value: '', label: 'Custom Crypto' },
                    { value: 'BTC', label: 'Bitcoin' },
                    { value: 'ETH', label: 'Ethereum' },
                    { value: 'SOL', label: 'Solana' },
                    { value: 'AVAX', label: 'Avalanche' },
                ];
            case 'DOVIZ': // Foreign Currency
                return [
                    { value: '', label: 'Custom Currency' },
                    { value: 'USD', label: 'US Dollar ($)' },
                    { value: 'EUR', label: 'Euro (€)' },
                ];
            default:
                return [];
        }
    };

    const symbolOptions = getSymbolOptions();

    const handleSymbolChange = (e) => {
        const newSymbol = e.target.value;
        const selectedOption = symbolOptions.find(opt => opt.value === newSymbol);

        let newName = formData.name;
        // Auto-fill name if it's empty or matches another default label
        const isDefaultName = symbolOptions.some(opt => opt.label === formData.name);
        if ((!formData.name || isDefaultName) && selectedOption) {
            newName = selectedOption.label;
        }

        setFormData({ ...formData, symbol: newSymbol, name: newName });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Update Asset' : 'Add New Asset'}
            className="max-w-md"
        >
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                {/* Category Selection */}
                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value, symbol: '' })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#e8c547] transition-colors appearance-none"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Symbol / Type Selection (Conditional) */}
                {symbolOptions.length > 0 && (
                    <div>
                        <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Asset Type (Live Price)</label>
                        <select
                            value={formData.symbol}
                            onChange={handleSymbolChange}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#e8c547] transition-colors appearance-none"
                        >
                            {symbolOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Name */}
                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Asset Name</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. Apple Stock, Bitcoin"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#e8c547] transition-colors"
                    />
                </div>

                {/* Amount */}
                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Amount / Quantity</label>
                    <input
                        required
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#e8c547] transition-colors"
                    />
                </div>

                {/* Cost (Optional) */}
                <div>
                    <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Avg Cost (Optional)</label>
                    <input
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#e8c547] transition-colors"
                    />
                    <p className="text-[10px] text-gray-600 mt-1">Leave empty if you don't want to track profit/loss.</p>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="mt-2 w-full py-3 bg-[#e8c547] hover:bg-[#d6b53f] text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#e8c547]/20"
                >
                    <FaSave /> {initialData ? 'Update Asset' : 'Save Asset'}
                </button>
            </form>
        </Modal>
    );
}
