'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { FaTimes, FaSync, FaTrophy, FaLayerGroup } from 'react-icons/fa';
import { useVocabulary } from '@/context/VocabularyContext';

// Spaced-repetition flashcard session. Pulls a due-first queue from the SRS
// scheduler, flips term -> meaning, and grades each card (Again/Hard/Good/Easy)
// which reschedules it. 'Again' re-queues the card within the same session.
const GRADES = [
    { key: 'again', label: 'Again', hint: '<1m', cls: 'bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25' },
    { key: 'hard', label: 'Hard', hint: '', cls: 'bg-orange-500/15 border-orange-500/40 text-orange-300 hover:bg-orange-500/25' },
    { key: 'good', label: 'Good', hint: '', cls: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25' },
    { key: 'easy', label: 'Easy', hint: '', cls: 'bg-[#e8c547]/15 border-[#e8c547]/50 text-[#e8c547] hover:bg-[#e8c547]/25' },
];

export default function FlashcardReview({ onClose, allWords = [] }) {
    const { buildReviewQueue, reviewWord } = useVocabulary();

    const [queue, setQueue] = useState(() => buildReviewQueue(allWords, 20));
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [reviewed, setReviewed] = useState(0);
    const total = useMemo(() => queue.length, [queue]);

    const current = queue[index];
    const finished = !current;

    const grade = useCallback((g) => {
        if (!current) return;
        reviewWord(current._id, g);
        setReviewed((n) => n + 1);
        setFlipped(false);
        if (g === 'again') {
            // Re-queue this card a few positions later in the session.
            setQueue((q) => {
                const next = [...q];
                const [card] = next.splice(index, 1);
                const insertAt = Math.min(next.length, index + 3);
                next.splice(insertAt, 0, card);
                return next;
            });
            // index stays; the spliced-in next card takes this slot
        } else {
            setIndex((i) => i + 1);
        }
    }, [current, index, reviewWord]);

    // Keyboard: space/enter flips, 1-4 grade, Esc closes.
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') return onClose();
            if (finished) return;
            if (!flipped && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault();
                setFlipped(true);
                return;
            }
            if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
                grade(GRADES[Number(e.key) - 1].key);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [flipped, finished, grade, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#e8c547]">
                        <FaLayerGroup /> Spaced Review
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{Math.min(reviewed, total)}/{total || 0}</span>
                        <button onClick={onClose} aria-label="Close review" className="text-gray-500 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 rounded">
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {finished ? (
                    <div className="text-center py-10">
                        <FaTrophy className="text-6xl text-[#e8c547] mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {total === 0 ? 'Nothing to review right now' : 'Review complete!'}
                        </h2>
                        <p className="text-gray-400 mb-8">
                            {total === 0
                                ? 'Mark some words as "learning" or come back when cards are due.'
                                : `You reviewed ${reviewed} card${reviewed === 1 ? '' : 's'}. New due dates are saved on this device.`}
                        </p>
                        <button onClick={onClose} className="px-6 py-3 rounded-xl bg-[#e8c547] hover:bg-[#e8c547]/80 text-black font-bold transition-colors">
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Progress */}
                        <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
                            <div className="h-full bg-[#e8c547] transition-all duration-300 ease-out" style={{ width: `${total ? (reviewed / total) * 100 : 0}%` }} />
                        </div>

                        {/* Card */}
                        <button
                            type="button"
                            onClick={() => !flipped && setFlipped(true)}
                            className={`w-full min-h-[220px] rounded-2xl border p-8 flex flex-col items-center justify-center text-center transition-all ${flipped ? 'bg-white/5 border-[#e8c547]/30 cursor-default' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-white/10 hover:border-[#e8c547]/40 cursor-pointer'}`}
                        >
                            {current.level && (
                                <span className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#e8c547]/70 border border-[#e8c547]/30 rounded-full px-2 py-0.5">{current.level}</span>
                            )}
                            <h3 className="text-3xl md:text-4xl font-bold text-white">{current.term}</h3>
                            {!flipped ? (
                                <p className="mt-6 text-xs text-gray-500 flex items-center gap-2"><FaSync /> Tap or press Space to reveal</p>
                            ) : (
                                <div className="mt-5 pt-5 border-t border-white/10 w-full">
                                    <p className="text-lg text-gray-200">{current.meaning}</p>
                                    {(current.example || current.exampleSentence) && (
                                        <p className="mt-3 text-sm text-gray-500 italic">“{current.example || current.exampleSentence}”</p>
                                    )}
                                </div>
                            )}
                        </button>

                        {/* Grades */}
                        {flipped ? (
                            <div className="grid grid-cols-4 gap-2 mt-6">
                                {GRADES.map((g, i) => (
                                    <button
                                        key={g.key}
                                        onClick={() => grade(g.key)}
                                        className={`py-3 rounded-xl border font-bold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 ${g.cls}`}
                                    >
                                        <span className="block">{g.label}</span>
                                        <span className="block text-[10px] opacity-50 mt-0.5">{g.hint || `${i + 1}`}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <button
                                onClick={() => setFlipped(true)}
                                className="w-full mt-6 py-3 rounded-xl bg-[#e8c547] hover:bg-[#e8c547]/80 text-black font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60"
                            >
                                Reveal answer
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
