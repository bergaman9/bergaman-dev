'use client';

import { FaTimes, FaChartPie, FaChartBar, FaTrophy } from 'react-icons/fa';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function StatsModal({ onClose, userProgress, words }) {
    // Calculate Stats
    const totalKnown = userProgress.filter(w => w.status === 'known').length;
    const totalLearning = userProgress.filter(w => w.status === 'learning').length;
    const totalWant = userProgress.filter(w => w.status === 'want_to_learn').length;

    // Level Distribution (Only for marked words)
    // We need to fetch details for these words if they aren't in the passed 'words' array
    // For now, we'll try to use what we have, but ideally this component should receive the full enriched list
    const levelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };

    // NOTE: This logic assumes 'words' contains all necessary word data. 
    // In a real app with pagination, we'd need to fetch these or pass a specific 'markedWordsDetails' prop.
    // For this implementation, we will perform a quick match if possible, or show a subset.

    userProgress.forEach(progress => {
        const word = words.find(w => w._id === progress.wordId);
        if (word && word.level && levelCounts[word.level] !== undefined) {
            levelCounts[word.level]++;
        }
    });

    const statusData = {
        labels: ['Known', 'Learning', 'Want to Learn'],
        datasets: [
            {
                data: [totalKnown, totalLearning, totalWant],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.6)', // Green
                    'rgba(234, 179, 8, 0.6)', // Yellow
                    'rgba(168, 85, 247, 0.6)', // Purple
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(234, 179, 8, 1)',
                    'rgba(168, 85, 247, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const levelData = {
        labels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        datasets: [
            {
                label: 'Words by Level',
                data: [levelCounts.A1, levelCounts.A2, levelCounts.B1, levelCounts.B2, levelCounts.C1, levelCounts.C2],
                backgroundColor: 'rgba(56, 189, 248, 0.5)', // Cyan
                borderColor: 'rgba(56, 189, 248, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#ccc' }
            },
            title: { display: false }
        },
        scales: {
            y: {
                ticks: { color: '#ccc' },
                grid: { color: 'rgba(255,255,255,0.1)' }
            },
            x: {
                ticks: { color: '#ccc' },
                grid: { color: 'rgba(255,255,255,0.1)' }
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <FaTimes size={24} />
                </button>

                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-8 flex items-center gap-3">
                    <FaTrophy className="text-[#e8c547]" /> Your Progress
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Summary Cards */}
                    <div className="md:col-span-2 grid grid-cols-3 gap-4">
                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-center">
                            <h3 className="text-2xl font-bold text-green-400">{totalKnown}</h3>
                            <p className="text-xs text-green-300/80 uppercase tracking-wider">Known</p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-center">
                            <h3 className="text-2xl font-bold text-yellow-400">{totalLearning}</h3>
                            <p className="text-xs text-yellow-300/80 uppercase tracking-wider">Learning</p>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl text-center">
                            <h3 className="text-2xl font-bold text-purple-400">{totalWant}</h3>
                            <p className="text-xs text-purple-300/80 uppercase tracking-wider">Targets</p>
                        </div>
                    </div>

                    {/* Status Chart */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col items-center">
                        <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                            <FaChartPie className="text-accent" /> Status Distribution
                        </h3>
                        <div className="w-full max-w-[300px]">
                            <Doughnut data={statusData} options={{ ...options, scales: {} }} />
                        </div>
                    </div>

                    {/* Level Chart */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col items-center">
                        <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                            <FaChartBar className="text-accent" /> Level Breakdown
                        </h3>
                        <div className="w-full">
                            <Bar data={levelData} options={options} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
