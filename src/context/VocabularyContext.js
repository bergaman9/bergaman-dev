'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const VocabularyContext = createContext();

// --- Spaced repetition (SM-2 lite). Grades: 'again' | 'hard' | 'good' | 'easy'
const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;

function scheduleSrs(prev, grade) {
    const rec = prev || { ease: DEFAULT_EASE, interval: 0, reps: 0, lapses: 0 };
    let { ease, interval, reps, lapses } = rec;
    const now = Date.now();

    if (grade === 'again') {
        reps = 0;
        lapses += 1;
        ease = Math.max(MIN_EASE, ease - 0.2);
        // Re-show within the same session (~1 min) until it sticks.
        return { ease, interval: 0, reps, lapses, due: now + 60 * 1000, last: now };
    }

    reps += 1;
    if (grade === 'hard') ease = Math.max(MIN_EASE, ease - 0.15);
    if (grade === 'easy') ease = ease + 0.15;

    let nextInterval;
    if (reps === 1) nextInterval = grade === 'easy' ? 4 : 1;
    else if (reps === 2) nextInterval = grade === 'easy' ? 7 : 3;
    else {
        const factor = grade === 'hard' ? 1.2 : grade === 'easy' ? ease * 1.3 : ease;
        nextInterval = Math.max(1, Math.round((interval || 1) * factor));
    }

    return { ease, interval: nextInterval, reps, lapses, due: now + nextInterval * DAY_MS, last: now };
}

export function VocabularyProvider({ children }) {
    const [userId, setUserId] = useState(null);
    const [userProgress, setUserProgress] = useState([]);
    const [wordLists, setWordLists] = useState([]); // { id, title, target, description, words: [] }
    const [srs, setSrs] = useState({}); // { [wordId]: { ease, interval, reps, lapses, due, last } }
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const storedId = localStorage.getItem('vocab_user_id');
        const storedProgress = localStorage.getItem('vocab_progress');
        const storedLists = localStorage.getItem('vocab_lists');
        const storedSrs = localStorage.getItem('vocab_srs');

        if (storedId) setUserId(storedId);
        else {
            const newId = crypto.randomUUID();
            setUserId(newId);
            localStorage.setItem('vocab_user_id', newId);
        }

        if (storedProgress) {
            try {
                setUserProgress(JSON.parse(storedProgress));
            } catch (e) {
                console.error("Failed to parse progress", e);
            }
        }

        if (storedLists) {
            try {
                setWordLists(JSON.parse(storedLists));
            } catch (e) {
                console.error("Failed to parse lists", e);
            }
        }

        if (storedSrs) {
            try {
                setSrs(JSON.parse(storedSrs));
            } catch (e) {
                console.error("Failed to parse SRS data", e);
            }
        }

        setLoading(false);
    }, []);

    // Persist SRS schedule
    useEffect(() => {
        if (userId) localStorage.setItem('vocab_srs', JSON.stringify(srs));
    }, [srs, userId]);

    // Persist Changes
    useEffect(() => {
        if (userId) {
            localStorage.setItem('vocab_progress', JSON.stringify(userProgress));
        }
    }, [userProgress, userId]);

    useEffect(() => {
        if (userId) {
            localStorage.setItem('vocab_lists', JSON.stringify(wordLists));
        }
    }, [wordLists, userId]);

    // Fetch Progress when userId is available
    useEffect(() => {
        if (userId) {
            // fetchProgress();
        }
    }, [userId]);


    const fetchProgress = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/user/progress?userId=${userId}`);
            if (response.data.success) {
                setUserProgress(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateWordStatus = async (wordId, status) => {
        // Optimistic Update
        setUserProgress(prev => {
            const exists = prev.find(w => w.wordId === wordId);
            if (exists) {
                return prev.map(w => w.wordId === wordId ? { ...w, status } : w);
            }
            return [...prev, { wordId, status }];
        });

        try {
            await axios.post('/api/user/progress', { userId, wordId, status });
        } catch (error) {
            console.error('Error syncing status:', error);
            // Revert optimization on error could be implemented here
        }
    };

    const syncWithCode = (code) => {
        if (code && code.length > 5) { // Basic validation
            localStorage.setItem('bergaman_vocab_user_id', code);
            setUserId(code);
            return true;
        }
        return false;
    };

    const getWordStatus = (wordId) => {
        const word = userProgress.find(w => w.wordId === wordId);
        return word ? word.status : null;
    };

    // --- Spaced repetition API
    const reviewWord = (wordId, grade) => {
        setSrs(prev => ({ ...prev, [wordId]: scheduleSrs(prev[wordId], grade) }));
        // A reviewed word is, at minimum, being learned (don't downgrade 'known').
        const current = getWordStatus(wordId);
        if (grade === 'again' || (current !== 'known' && current !== 'learning')) {
            updateWordStatus(wordId, grade === 'easy' ? 'known' : 'learning');
        }
    };

    // Words scheduled and now due (oldest due first).
    const getDueWords = (allWords = []) => {
        const now = Date.now();
        return allWords
            .filter(w => srs[w._id] && srs[w._id].due <= now)
            .sort((a, b) => srs[a._id].due - srs[b._id].due);
    };

    // Build a review queue: due words first, then unseen 'learning'/'want_to_learn'
    // words so there is always something to study. Capped to a session size.
    const buildReviewQueue = (allWords = [], limit = 20) => {
        const due = getDueWords(allWords);
        if (due.length >= limit) return due.slice(0, limit);
        const seen = new Set(due.map(w => w._id));
        const fresh = allWords.filter(w => {
            if (seen.has(w._id) || srs[w._id]) return false;
            const status = getWordStatus(w._id);
            return status === 'learning' || status === 'want_to_learn';
        });
        return [...due, ...fresh].slice(0, limit);
    };

    // SRS keys are word ids, so due/scheduled counts need no word objects.
    const getReviewStats = () => {
        const now = Date.now();
        const ids = Object.keys(srs);
        const dueCount = ids.filter(id => srs[id].due <= now).length;
        const mature = ids.filter(id => srs[id].interval >= 21).length;
        return { dueCount, scheduled: ids.length, mature };
    };

    // List functions (placeholders for now)
    const createWordList = (title, target, description) => {
        const newList = { id: crypto.randomUUID(), title, target, description, words: [] };
        setWordLists(prev => [...prev, newList]);
        return newList;
    };

    const deleteWordList = (listId) => {
        setWordLists(prev => prev.filter(list => list.id !== listId));
    };

    const addWordToList = (listId, word) => {
        setWordLists(prev => prev.map(list =>
            list.id === listId ? { ...list, words: [...list.words, word] } : list
        ));
    };

    const removeWordFromList = (listId, wordId) => {
        setWordLists(prev => prev.map(list =>
            list.id === listId ? { ...list, words: list.words.filter(w => w.id !== wordId) } : list
        ));
    };

    return (
        <VocabularyContext.Provider value={{
            userId,
            userProgress,
            loading,
            updateWordStatus,
            syncWithCode,
            getWordStatus,
            srs,
            reviewWord,
            getDueWords,
            buildReviewQueue,
            getReviewStats,
            wordLists,
            createWordList,
            deleteWordList,
            addWordToList,
            removeWordFromList
        }}>
            {children}
        </VocabularyContext.Provider>
    );
}

export function useVocabulary() {
    return useContext(VocabularyContext);
}
