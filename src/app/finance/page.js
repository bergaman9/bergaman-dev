'use client';

import { FinanceProvider } from '@/context/FinanceContext';
import FinanceDashboard from '@/components/Finance/FinanceDashboard';
import AssetCategoryGrid from '@/components/Finance/AssetCategoryGrid';
import PageContainer from '@/components/PageContainer';

export default function FinancePage() {
    return (
        <FinanceProvider>
            <PageContainer className="bg-black min-h-screen relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#e8c547]/8 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
                    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/3 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10">
                    {/* Compact Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                            Portfolio Tracker
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Real-time <span className="text-[#e8c547]">market data</span> • Multi-portfolio • Multi-currency
                        </p>
                    </div>

                    {/* Stacked Layout - Dashboard on top, Categories below */}
                    <div className="space-y-8">
                        {/* Dashboard Section - Full Width */}
                        <FinanceDashboard />

                        {/* Categories Section */}
                        <div>
                            <h2 className="text-lg font-bold text-white/80 mb-4">Asset Categories</h2>
                            <AssetCategoryGrid />
                        </div>
                    </div>
                </div>
            </PageContainer>
        </FinanceProvider>
    );
}
