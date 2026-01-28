'use client';

import { useFinance } from '@/context/FinanceContext';
import { FaTrash, FaPlus, FaPen } from 'react-icons/fa'; // FaTimes removed as it handles by Modal
import Modal from '../UI/Modal';

export default function AssetListModal({ isOpen, onClose, category, onAddClick, onEditClick }) {
    const { getAssetsByCategory, removeAsset, getAssetCurrentValue, getAssetProfitLoss, marketRates, currency } = useFinance();
    const assets = getAssetsByCategory(category);

    const formatCurrency = (val) => new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val);

    const getConvertedValue = (valInTry) => {
        if (!valInTry) return 0;
        if (currency === 'TRY') return valInTry;
        const rate = marketRates[currency]; // USD or EUR
        if (!rate) return valInTry;
        return valInTry / rate;
    };

    // Construct title with count
    const modalTitle = (
        <>
            {category} <span className="text-[#e8c547] text-sm font-normal ml-2">({currency})</span>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            className="max-w-3xl h-[85vh] sm:h-auto"
        >
            {assets.length === 0 ? (
                <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl text-gray-600">
                        📉
                    </div>
                    <p>No assets in this category yet.</p>
                </div>
            ) : (
                <div className="w-full min-w-[500px]"> {/* Min width to ensure grid doesn't crunch too much on mobile */}
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 text-xs uppercase font-bold text-gray-500 p-4 bg-[#0a0a0a] sticky top-0 border-b border-white/5 z-10">
                        <div className="col-span-4 pl-2">Asset</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-right">Cost</div>
                        <div className="col-span-3 text-right">Value / P/L</div>
                        <div className="col-span-1"></div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-white/5">
                        {assets.map((asset) => {
                            const pl = getAssetProfitLoss(asset);
                            const currentValue = getAssetCurrentValue(asset);
                            const isProfit = pl.amount >= 0;
                            const livePrice = asset.symbol ? marketRates[asset.symbol] : 0;

                            // Converted Values
                            const displayPrice = getConvertedValue(livePrice);
                            const displayCost = getConvertedValue(asset.cost || 0);
                            const displayValue = getConvertedValue(currentValue);
                            const displayPL = getConvertedValue(pl.amount);

                            return (
                                <div key={asset.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group">
                                    {/* Asset Info */}
                                    <div className="col-span-4 overflow-hidden">
                                        <div className="font-bold text-white text-sm group-hover:text-[#e8c547] transition-colors truncate" title={asset.name}>
                                            {asset.name}
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                                            {parseFloat(asset.amount).toLocaleString('en-US')} {asset.symbol && <span className="text-[#e8c547]/80">({asset.symbol})</span>}
                                        </div>
                                    </div>

                                    {/* Unit Price (Live) */}
                                    <div className="col-span-2 text-right whitespace-nowrap">
                                        <div className="text-xs text-white">
                                            {livePrice ? formatCurrency(displayPrice) : '-'}
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                            live
                                        </div>
                                    </div>

                                    {/* Cost Info (Avg) */}
                                    <div className="col-span-2 text-right whitespace-nowrap">
                                        <div className="text-xs text-gray-300">
                                            {formatCurrency(displayCost)}
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                            avg
                                        </div>
                                    </div>

                                    {/* Value & P/L */}
                                    <div className="col-span-3 text-right whitespace-nowrap">
                                        <div className="font-bold text-white text-sm">
                                            {formatCurrency(displayValue)}
                                        </div>
                                        <div className={`text-[10px] flex items-center justify-end gap-1 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                            <span>{isProfit ? '+' : ''}{formatCurrency(displayPL)}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEditClick(asset)}
                                            className="text-gray-400 hover:text-[#e8c547] transition-colors"
                                            title="Edit"
                                        >
                                            <FaPen size={14} />
                                        </button>
                                        <button
                                            onClick={() => removeAsset(asset.id)}
                                            className="text-gray-400 hover:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Sticky Footer Action */}
            <div className="p-4 border-t border-white/5 bg-[#0a0a0a] rounded-b-2xl">
                <button
                    onClick={onAddClick}
                    className="w-full py-3 bg-[#e8c547] hover:bg-[#d6b53f] text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                    <FaPlus /> Add New Asset
                </button>
            </div>
        </Modal>
    );
}

