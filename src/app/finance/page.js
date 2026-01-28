'use client';

import { FinanceProvider } from '@/context/FinanceContext';
import FinanceDashboard from '@/components/Finance/FinanceDashboard';
import AssetCategoryGrid from '@/components/Finance/AssetCategoryGrid';
import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function FinancePage() {
    return (
        <FinanceProvider>
            <main className="min-h-screen bg-[#0a0a0a] pb-24 relative overflow-hidden">
                {/* Background Effects matching Vocabulary Vault */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#e8c547]/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1a2e1a]/20 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10">
                    <div className="pt-12 pb-8 flex items-center justify-center">
                        <div className="text-xl font-bold text-white tracking-wide opacity-80">Portfolio Tracker</div>
                    </div>

                    <div className="container mx-auto max-w-md px-4 space-y-6">
                        <FinanceDashboard />
                        <AssetCategoryGrid />
                    </div>
                </div>
            </main>
        </FinanceProvider>
    );
}
