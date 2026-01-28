import { useState } from 'react';
import AssetListModal from './AssetListModal';
import AddAssetModal from './AddAssetModal';
import { useFinance } from '@/context/FinanceContext';

const CATEGORIES = [
    { id: 'TL', name: 'Turkish Lira', icon: '₺' },
    { id: 'BIST', name: 'Borsa Istanbul', icon: '📈' },
    { id: 'EMTIA', name: 'Commodities', icon: '🏆' },
    { id: 'DOVIZ', name: 'Foreign Exchange', icon: '💵' },
    { id: 'FON', name: 'Investment Funds', icon: '📊' },
    { id: 'KRIPTO', name: 'Crypto Assets', icon: '₿' },
    { id: 'ABD', name: 'US Stocks', icon: '🌎' },
    { id: 'DIGER', name: 'Other', icon: '📦' },
];


export default function AssetCategoryGrid() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const { getAssetsByCategory, addAsset, updateAsset, getAssetCurrentValue, currency, marketRates } = useFinance();

    const getConvertedValue = (valInTry) => {
        if (!valInTry) return 0;
        if (currency === 'TRY') return valInTry;
        const rate = marketRates[currency]; // USD or EUR
        if (!rate) return valInTry;
        return valInTry / rate;
    };

    const formatCurrency = (val) => new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val);

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
        <div className="grid grid-cols-2 gap-3 pb-8">
            {CATEGORIES.map((cat) => {
                const assets = getAssetsByCategory(cat.id);
                const totalValueTry = assets.reduce((sum, item) => sum + (getAssetCurrentValue ? getAssetCurrentValue(item) : 0), 0);
                const totalValueConverted = getConvertedValue(totalValueTry);

                return (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="group relative overflow-hidden rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-[#e8c547]/50 transition-all duration-300 p-4 text-left flex flex-col justify-between aspect-[1.2]"
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-[#e8c547]/0 group-hover:bg-[#e8c547]/5 transition-colors duration-300" />

                        <div className="relative z-10">
                            <span className="text-2xl mb-2 block opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">{cat.icon}</span>
                            <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-wider">{cat.name}</span>
                        </div>

                        <div className="relative z-10 mt-auto">
                            <div className="text-sm font-bold text-white group-hover:text-[#e8c547] transition-colors">
                                {formatCurrency(totalValueConverted)}
                            </div>
                            <div className="text-[10px] text-gray-600 group-hover:text-gray-400">
                                {assets.length} Assets
                            </div>
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
                initialCategory={selectedCategory} // Pass the currently selected category
            />
        </div>
    );
}
