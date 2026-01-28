
'use client';

import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from '@/hooks/useDebounce'; // Assuming you might have one, if not I'll implement debounce locally

export default function SearchFilters({ onSearch, initialFilters }) {
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
    const [selectedLevel, setSelectedLevel] = useState(initialFilters?.level || 'All');

    // Simple debounce implementation inside component since I'm not sure if a hook exists
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        onSearch({ search: debouncedSearch, level: selectedLevel });
    }, [debouncedSearch, selectedLevel]); // eslint-disable-line react-hooks/exhaustive-deps

    const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    return (
        <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for a word..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                    />
                </div>

                {/* Level Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {levels.map((level) => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`px-4 py-3 rounded-xl border transition-all whitespace-nowrap ${selectedLevel === level
                                    ? 'bg-accent/20 border-accent/50 text-accent'
                                    : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
