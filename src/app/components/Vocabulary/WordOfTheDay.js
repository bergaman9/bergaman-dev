'use client';

import { useState, useEffect } from 'react';
import { FaCalendarDay, FaVolumeUp } from 'react-icons/fa';
import axios from 'axios';

export default function WordOfTheDay() {
    const [word, setWord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWordOfTheDay = async () => {
            const today = new Date().toISOString().split('T')[0];
            const stored = localStorage.getItem('vocab_wotd');

            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.date === today) {
                    setWord(parsed.word);
                    setLoading(false);
                    return;
                }
            }

            // Fetch a random high-level word
            try {
                // We'll ask for C1 or C2 words mainly
                const response = await axios.get('/api/words?level=C1&limit=50'); // Get a batch
                if (response.data.success && response.data.data.length > 0) {
                    const randomWord = response.data.data[Math.floor(Math.random() * response.data.data.length)];
                    setWord(randomWord);
                    localStorage.setItem('vocab_wotd', JSON.stringify({ date: today, word: randomWord }));
                }
            } catch (err) {
                console.error("Failed to WOTD", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWordOfTheDay();
    }, []);

    const playAudio = () => {
        if ('speechSynthesis' in window && word) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(word.term);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    };

    if (loading || !word) return null;

    return (
        <div className="mb-8 w-full">
            <div className="bg-gradient-to-r from-purple-900/40 to-black border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <FaCalendarDay className="text-6xl text-purple-500/20 transform rotate-12" />
                </div>

                <h2 className="text-purple-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FaCalendarDay /> Word of the Day
                </h2>

                <div className="flex flex-col md:flex-row md:items-end gap-4 relative z-10">
                    <div>
                        <div className="flex items-end gap-3 mb-1">
                            <h3 className="text-3xl md:text-4xl font-bold text-white">{word.term}</h3>
                            <button
                                onClick={playAudio}
                                className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-white transition-colors mb-1"
                            >
                                <FaVolumeUp />
                            </button>
                        </div>
                        <p className="text-gray-500 font-mono italic">{word.type} • {word.pronunciation}</p>
                    </div>

                    <div className="flex-1 md:pl-6 md:border-l border-white/10">
                        <p className="text-gray-200 text-lg leading-relaxed">{word.meaning}</p>
                        {word.exampleSentence && (
                            <p className="text-gray-400 text-sm italic mt-2">"{word.exampleSentence}"</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
