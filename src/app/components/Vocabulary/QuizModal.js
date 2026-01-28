'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaQuestionCircle, FaCheck, FaTrophy, FaRedo } from 'react-icons/fa';
import axios from 'axios';

export default function QuizModal({ onClose, userProgress, allWords = [] }) {
    const [gameState, setGameState] = useState('loading'); // loading, playing, finished
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        generateQuiz();
    }, []);

    const generateQuiz = async () => {
        setGameState('loading');
        try {
            // Fetch words if not provided or insufficient
            let quizWords = allWords;
            if (quizWords.length < 20) {
                const response = await axios.get('/api/words?limit=50&level=B2'); // Fetch a batch for quiz
                if (response.data.success) quizWords = response.data.data;
            }

            const newQuestions = [];
            // Create 10 questions
            for (let i = 0; i < 10; i++) {
                if (quizWords.length < 4) break;

                const correctWord = quizWords[Math.floor(Math.random() * quizWords.length)];

                // 4 Options including correct one
                const options = [correctWord];
                while (options.length < 4) {
                    const random = quizWords[Math.floor(Math.random() * quizWords.length)];
                    if (!options.find(w => w._id === random._id)) options.push(random);
                }

                // Shuffle options
                options.sort(() => Math.random() - 0.5);

                newQuestions.push({
                    type: Math.random() > 0.5 ? 'term_to_meaning' : 'meaning_to_term',
                    word: correctWord,
                    options: options
                });
            }

            setQuestions(newQuestions);
            setGameState('playing');
        } catch (error) {
            console.error("Quiz gen error", error);
            onClose(); // Fail silently/gracefully by closing
        }
    };

    const handleAnswer = (option) => {
        if (showResult) return;

        setSelectedAnswer(option);
        setShowResult(true);

        const isCorrect = option._id === questions[currentQuestionIndex].word._id;
        if (isCorrect) {
            setScore(prev => prev + 10);
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }

        // Wait then next question
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                setGameState('finished');
            }
        }, 1500);
    };

    if (gameState === 'loading') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <div className="animate-pulse text-2xl text-[#e8c547] font-bold">Generating Quiz...</div>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
                <div className="bg-[#111] border border-[#e8c547]/30 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#e8c547] to-transparent"></div>

                    <FaTrophy className="text-6xl text-[#e8c547] mx-auto mb-6 animate-bounce" />
                    <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
                    <p className="text-gray-400 mb-8">You scored <span className="text-[#e8c547] font-bold text-xl">{score}</span> points</p>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={onClose} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">
                            Close
                        </button>
                        <button onClick={generateQuiz} className="px-6 py-3 rounded-xl bg-[#e8c547] hover:bg-[#e8c547]/80 text-black font-bold transition-colors flex items-center justify-center gap-2">
                            <FaRedo /> Play Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestionIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                        Question {currentQuestionIndex + 1}/{questions.length}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-[#e8c547] font-bold">Score: {score}</div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
                    <div
                        className="h-full bg-[#e8c547] transition-all duration-300 ease-out"
                        style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                    ></div>
                </div>

                {/* Question */}
                <div className="mb-8 text-center">
                    <div className="mb-2 text-gray-400 text-sm">
                        {currentQ.type === 'term_to_meaning' ? 'What is the meaning of:' : 'Which word means:'}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        {currentQ.type === 'term_to_meaning' ? currentQ.word.term : `"${currentQ.word.meaning}"`}
                    </h3>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQ.options.map((option) => {
                        const isSelected = selectedAnswer?._id === option._id;
                        const isCorrect = option._id === currentQ.word._id;

                        let buttonStyle = "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300";
                        if (showResult) {
                            if (isCorrect) buttonStyle = "bg-green-500/20 border-green-500 text-green-400";
                            else if (isSelected) buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                            else buttonStyle = "bg-white/5 border-white/10 text-gray-500 opacity-50";
                        }

                        return (
                            <button
                                key={option._id}
                                onClick={() => handleAnswer(option)}
                                disabled={showResult}
                                className={`p-4 rounded-xl border text-left transition-all duration-200 font-medium ${buttonStyle} disabled:cursor-default`}
                            >
                                {currentQ.type === 'term_to_meaning' ? option.meaning : option.term}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
