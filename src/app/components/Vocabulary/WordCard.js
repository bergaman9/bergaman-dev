
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaVolumeUp, FaEye, FaCheckCircle, FaBook, FaStar, FaMicrophone, FaTimesCircle } from 'react-icons/fa';
import { useVocabulary } from '@/context/VocabularyContext';

export default function WordCard({ word }) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [listening, setListening] = useState(false);
    const [pronunciationStatus, setPronunciationStatus] = useState(null); // 'correct', 'incorrect', null
    const [heardText, setHeardText] = useState('');

    const { updateWordStatus, getWordStatus, userId } = useVocabulary();
    const currentStatus = getWordStatus(word._id);

    const playAudio = (e) => {
        e.stopPropagation();
        if ('speechSynthesis' in window) {
            // Cancel any current speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(word.term);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    };

    const handlePronunciationCheck = (e) => {
        e.stopPropagation();
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setListening(true);
        setPronunciationStatus(null);
        setHeardText('');

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            const target = word.term.toLowerCase().trim();

            setHeardText(transcript);

            if (transcript === target || transcript.includes(target)) {
                setPronunciationStatus('correct');
            } else {
                setPronunciationStatus('incorrect');
            }
            setListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech error", event.error);
            setListening(false);
            setPronunciationStatus('error');
        };

        recognition.onend = () => {
            setListening(false);
        };
    };

    const handleStatusUpdate = (e, status) => {
        e.stopPropagation();
        updateWordStatus(word._id, status);
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'A1': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'A2': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'B1': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'B2': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
            case 'C1': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'C2': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusIcon = () => {
        switch (currentStatus) {
            case 'known': return <FaCheckCircle className="text-green-500" />;
            case 'learning': return <FaBook className="text-yellow-500" />;
            case 'want_to_learn': return <FaStar className="text-purple-500" />;
            default: return null;
        }
    };

    return (
        <div
            className={`
                relative group flex flex-col h-full overflow-hidden rounded-2xl border transition-all duration-500
                ${currentStatus
                    ? 'bg-[#0e1b12]/90 border-accent/20 shadow-[0_0_20px_rgba(232,197,71,0.05)] hover:border-accent/40 hover:shadow-[0_0_30px_rgba(232,197,71,0.15)]'
                    : 'bg-[#0a0a0a]/90 border-white/5 hover:border-white/10 hover:bg-[#111]'
                }
            `}
            onClick={() => setIsRevealed(!isRevealed)}
        >
            {/* Background Gradient Effect */}
            <div className={`absolute top-0 right-0 w-64 h-64 opacity-5 blur-[80px] rounded-full pointing-events-none transition-opacity duration-700 group-hover:opacity-10 ${currentStatus === 'known' ? 'bg-green-500' :
                currentStatus === 'learning' ? 'bg-yellow-500' :
                    currentStatus === 'want_to_learn' ? 'bg-purple-500' :
                        'bg-white'
                }`}></div>

            {/* Status Badge (Top Right) */}
            {currentStatus && (
                <div className="absolute top-3 right-3 z-30">
                    <div className="bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/5 shadow-sm">
                        {getStatusIcon()}
                    </div>
                </div>
            )}

            {/* Image (if available) */}
            {word.image && (
                <div className="relative w-full h-40 shrink-0 overflow-hidden border-b border-white/5">
                    <Image
                        src={word.image}
                        alt={word.term}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                </div>
            )}

            <div className={`p-6 flex flex-col flex-1 relative z-20 ${word.image ? '-mt-12' : ''}`}>

                {/* Header: Level & Audio Controls */}
                <div className="flex justify-between items-center mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${getLevelColor(word.level)}`}>
                        {word.level}
                    </span>

                    <div className="flex gap-1 bg-black/40 backdrop-blur rounded-full p-1 border border-white/5">
                        <button
                            onClick={handlePronunciationCheck}
                            className={`p-2 rounded-full transition-all hover:bg-white/10 ${listening ? 'text-red-400 animate-pulse' : 'text-gray-400 hover:text-white'}`}
                            title="Check Pronunciation"
                        >
                            <FaMicrophone className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={playAudio}
                            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Listen"
                        >
                            <FaVolumeUp className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Main Word Content */}
                <div className="mb-2">
                    <h3 className="text-3xl font-serif font-bold text-white mb-1 group-hover:text-[#e8c547] transition-colors tracking-tight">
                        {word.term}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                        {word.pronunciation && (
                            <span className="text-gray-500 font-mono tracking-tighter opacity-70">
                                /{word.pronunciation}/
                            </span>
                        )}
                        <span className="text-gray-600 italic font-serif">
                            {word.type}
                        </span>
                    </div>
                </div>

                {/* Pronunciation Feedback (Expandable) */}
                <div className={`overflow-hidden transition-all duration-300 ${pronunciationStatus || listening ? 'max-h-12 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-white/5 rounded-lg px-3 py-2 text-xs">
                        {listening && <div className="text-yellow-400 animate-pulse flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" /> Listening...</div>}
                        {pronunciationStatus === 'correct' && (
                            <p className="text-green-400 flex items-center gap-2 font-bold"><FaCheckCircle /> Perfect pronunciation!</p>
                        )}
                        {pronunciationStatus === 'incorrect' && (
                            <p className="text-red-400 flex items-center gap-2"><FaTimesCircle /> Heard: <span className="font-mono text-white">"{heardText}"</span></p>
                        )}
                    </div>
                </div>

                {/* Revealed Content / "Reveal" Trigger */}
                <div className="mt-auto pt-4">
                    <div
                        className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${isRevealed ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <div>
                                <p className="text-gray-300 leading-relaxed font-serif text-[15px]">{word.meaning}</p>
                                {word.exampleSentence && (
                                    <p className="text-gray-500 text-sm italic mt-2 pl-3 border-l-2 border-white/10">"{word.exampleSentence}"</p>
                                )}
                            </div>

                            {/* Status Actions */}
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={(e) => handleStatusUpdate(e, 'known')}
                                    className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all border ${currentStatus === 'known' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-500 hover:text-green-400'}`}
                                >
                                    <FaCheckCircle className="text-lg" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Known</span>
                                </button>
                                <button
                                    onClick={(e) => handleStatusUpdate(e, 'learning')}
                                    className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all border ${currentStatus === 'learning' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400' : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-500 hover:text-yellow-400'}`}
                                >
                                    <FaBook className="text-lg" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Learning</span>
                                </button>
                                <button
                                    onClick={(e) => handleStatusUpdate(e, 'want_to_learn')}
                                    className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all border ${currentStatus === 'want_to_learn' ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-500 hover:text-purple-400'}`}
                                >
                                    <FaStar className="text-lg" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Target</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {!isRevealed && (
                        <div className="flex items-center justify-center pt-2">
                            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 group-hover:border-[#e8c547]/30 group-hover:bg-[#e8c547]/10 transition-all flex items-center gap-2 group/reveal">
                                <FaEye className="text-gray-500 group-hover/reveal:text-[#e8c547] text-xs transition-colors" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover/reveal:text-[#e8c547] transition-colors">Reveal Definition</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
