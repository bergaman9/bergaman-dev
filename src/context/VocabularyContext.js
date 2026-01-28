'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const VocabularyContext = createContext();

export function VocabularyProvider({ children }) {
    const [userId, setUserId] = useState(null);
    const [userProgress, setUserProgress] = useState([]);
    const [wordLists, setWordLists] = useState([]); // { id, title, target, description, words: [] }
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const storedId = localStorage.getItem('vocab_user_id');
        const storedProgress = localStorage.getItem('vocab_progress');
        const storedLists = localStorage.getItem('vocab_lists');

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

        setLoading(false);
    }, []);

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
