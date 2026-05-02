import { useState } from 'react';
import AssetListModal from './AssetListModal';
import AddAssetModal from './AddAssetModal';
import { useFinance } from '@/context/FinanceContext';
import { FaPlus } from 'react-icons/fa';

const CATEGORIES = [
    { id: 'TL', name: 'Turkish Lira', icon: '₺', gradient: 'from-red-500/20 to-red-900/10' },
    { id: 'BIST', name: 'Borsa Istanbul', icon: '📈', gradient: 'from-blue-500/20 to-blue-900/10' },
    { id: 'EMTIA', name: 'Commodities', icon: '🏆', gradient: 'from-yellow-500/20 to-amber-900/10' },
    { id: 'DOVIZ', name: 'Foreign Exchange', icon: '💵', gradient: 'from-green-500/20 to-green-900/10' },
    { id: 'FON', name: 'Investment Funds', icon: '📊', gradient: 'from-purple-500/20 to-purple-900/10' },
    { id: 'KRIPTO', name: 'Crypto', icon: '₿', gradient: 'from-orange-500/20 to-orange-900/10' },
    { id: 'ABD', name: 'US Stocks', icon: '🇺🇸', gradient: 'from-sky-500/20 to-sky-900/10' },
    { id: 'DIGER', name: 'Other', icon: '📦', gradient: 'from-gray-500/20 to-gray-900/10' },
];

export default function AssetCategoryGrid() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const { getAssetsByCategory, addAsset, updateAsset, getAssetCurrentValue, currency, marketRates } = useFinance();

    const getConvertedValue = (valInTry) => {
        if (!valInTry) return 0;
        if (currency === 'TRY') return valInTry;
        const rate = marketRates[currency];
        if (!rate) return valInTry;
        return valInTry / rate;
    };

    const formatCurrency = (val) => {
        // Show full price, no K/M rounding
        return new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
            style: 'currency', currency: currency, maximumFractionDigits: 0
        }).format(val);
    };


    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleAddAsset = (assetData) => {
        if (editingAsset) {
            updateAsset(editingAsset.id, assetData);
        } else {
            addAsset(assetData);
        }
        setIsAddModalOpen(false);
        setEditingAsset(null);
    };

    const handleEditAsset = (asset) => {
        setEditingAsset(asset);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setEditingAsset(null);
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
                const assets = getAssetsByCategory(cat.id);
                const totalValueTry = assets.reduce((sum, item) => sum + (getAssetCurrentValue ? getAssetCurrentValue(item) : 0), 0);
                const totalValueConverted = getConvertedValue(totalValueTry);
                const hasAssets = assets.length > 0;

                return (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        aria-label={`Open ${cat.name} assets`}
                        className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient} border border-white/10 hover:border-white/20 transition-all duration-300 p-5 text-left focus:outline-none focus:ring-2 focus:ring-[#e8c547]/70 motion-reduce:transition-none`}
                    >
                        {/* Hover highlight */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

                        {/* Icon */}
                        <div className="relative z-10 mb-4">
                            <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300 inline-block">
                                {cat.icon}
                            </span>
                        </div>

                        {/* Category Name */}
                        <div className="relative z-10 mb-2">
                            <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                                {cat.name}
                            </span>
                        </div>

                        {/* Value & Count */}
                        <div className="relative z-10">
                            <div className={`text-lg font-bold ${hasAssets ? 'text-white' : 'text-white/30'} group-hover:text-[#e8c547] transition-colors`}>
                                {hasAssets ? formatCurrency(totalValueConverted) : '₺0'}
                            </div>
                            <div className="text-xs text-white/40 mt-0.5">
                                {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
                            </div>
                        </div>

                        {/* Add indicator on hover */}
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" aria-hidden="true">
                            <FaPlus size={10} className="text-white/60" />
                        </div>
                    </button>
                );
            })}

            {/* Modals */}
            <AssetListModal
                isOpen={!!selectedCategory && !isAddModalOpen}
                category={selectedCategory}
                onClose={() => setSelectedCategory(null)}
                onAddClick={() => {
                    setEditingAsset(null);
                    setIsAddModalOpen(true);
                }}
                onEditClick={handleEditAsset}
            />

            {/* Add/Edit Asset Modal */}
            <AddAssetModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onAdd={handleAddAsset}
                initialData={editingAsset}
                initialCategory={selectedCategory}
            />
        </div>
    );
}
