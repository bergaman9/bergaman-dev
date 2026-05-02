'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBookOpen, FaExclamationTriangle, FaDownload, FaKey, FaCopy, FaCheck, FaChartBar, FaTrophy } from 'react-icons/fa';
import SearchFilters from '@/components/Vocabulary/SearchFilters';
import WordCard from '@/components/Vocabulary/WordCard';
import StatsModal from '@/components/Vocabulary/StatsModal';
import WordOfTheDay from '@/components/Vocabulary/WordOfTheDay';
import QuizModal from '@/components/Vocabulary/QuizModal';
import PaginationMap from '@/components/Vocabulary/PaginationMap';
import { useVocabulary } from '@/context/VocabularyContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageContainer from '@/components/PageContainer';
import Modal from '@/components/UI/Modal';
import { SkeletonCard } from '@/components/Skeleton';

const ALLOWED_VAULT_STATUSES = new Set(['known', 'learning', 'want_to_learn']);
const MAX_IMPORT_SIZE = 256 * 1024;

function escapeCsvValue(value) {
    const text = String(value ?? '').replace(/\r?\n/g, ' ');
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadTextFile(filename, content, type = 'text/csv;charset=utf-8') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const next = text[i + 1];

        if (char === '"') {
            if (inQuotes && next === '"') {
                field += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push(field);
            field = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && next === '\n') i++;
            row.push(field);
            if (row.some((value) => value.trim() !== '')) rows.push(row);
            row = [];
            field = '';
        } else {
            field += char;
        }
    }

    row.push(field);
    if (row.some((value) => value.trim() !== '')) rows.push(row);
    if (rows.length < 2) return [];

    const headers = rows[0].map((header) => header.trim());
    return rows.slice(1).map((values) => headers.reduce((record, header, index) => {
        record[header] = values[index] ?? '';
        return record;
    }, {}));
}

export default function VocabularyPage() {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ search: '', level: 'All' });
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    // Context for Vault Key
    const { userId, syncWithCode, userProgress, updateWordStatus } = useVocabulary();
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [inputCode, setInputCode] = useState('');

    const [copied, setCopied] = useState(false);
    const [totalWordCount, setTotalWordCount] = useState(25000); // Default fallback

    const fetchWords = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                search: filters.search,
                level: filters.level,
                page: pagination.page,
                limit: 12,
            };

            const response = await axios.get('/api/words', { params });

            if (response.data.success) {
                setWords(response.data.data);
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage
                }));
                if (response.data.totalWords) {
                    setTotalWordCount(response.data.totalWords);
                }
            }
        } catch (err) {
            console.error("Failed to fetch words", err);
            setError('Failed to load words. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWords();
    }, [filters, pagination.page]);

    const handleSearch = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleExport = async (type) => {
        // Filter only marked words (known, learning, want_to_learn)
        const markedWords = userProgress.filter(w => ['known', 'learning', 'want_to_learn'].includes(w.status));

        if (markedWords.length === 0) {
            alert("No words marked in your vault yet!");
            return;
        }

        try {
            // Get IDs of marked words
            const ids = markedWords.map(w => w.wordId).join(',');

            // Fetch full details for these words
            const response = await axios.get(`/api/words?ids=${ids}&limit=10000`); // High limit to get all

            if (!response.data.success || response.data.data.length === 0) {
                alert("Failed to fetch word details for export.");
                return;
            }

            const wordsToExport = response.data.data.map(word => {
                const userStatus = markedWords.find(mw => mw.wordId === word._id)?.status || 'unknown';
                return { ...word, userStatus };
            });

            if (type === 'csv') {
                const headers = ['Id', 'Term', 'Status', 'Level', 'Type', 'Meaning', 'Example', 'Pronunciation'];
                const rows = wordsToExport.map(w => [
                    w._id,
                    w.term,
                    w.userStatus,
                    w.level,
                    w.type,
                    w.meaning,
                    w.exampleSentence,
                    w.pronunciation
                ]);
                const csv = [headers, ...rows]
                    .map((row) => row.map(escapeCsvValue).join(','))
                    .join('\n');
                downloadTextFile('my_vocabulary_vault.csv', csv);
            } else if (type === 'pdf') {
                const doc = new jsPDF();
                doc.text("My Vocabulary Vault", 14, 20);
                doc.setFontSize(10);
                doc.text(`Total Words: ${wordsToExport.length}`, 14, 28);

                const tableColumn = ["Term", "Status", "Level", "Meaning"];
                const tableRows = [];

                wordsToExport.forEach(w => {
                    const wordData = [
                        w.term,
                        w.userStatus,
                        w.level,
                        w.meaning,
                    ];
                    tableRows.push(wordData);
                });

                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 35,
                });
                doc.save("my_vocabulary_vault.pdf");
            }
        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed. Please try again.");
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.csv')) {
            alert("Import only accepts CSV files exported from this app.");
            e.target.value = '';
            return;
        }
        if (file.size > MAX_IMPORT_SIZE) {
            alert("Import file is too large. Maximum size is 256 KB.");
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const data = parseCsv(evt.target.result);

                if (data.length === 0) {
                    alert("Import file appears empty.");
                    return;
                }

                if (!data[0].Term || !data[0].Status) {
                    alert("Invalid file format. Please use a file exported from this app.");
                    return;
                }

                let updatedCount = 0;
                setLoading(true);

                for (const row of data.slice(0, 1000)) {
                    const status = String(row.Status || '').toLowerCase();
                    if (ALLOWED_VAULT_STATUSES.has(status) && row.Term) {
                        try {
                            if (row.Id) {
                                await updateWordStatus(row.Id, status);
                                updatedCount++;
                            } else {
                                const res = await axios.get(`/api/words?search=${encodeURIComponent(row.Term)}&limit=1`);
                                if (res.data.success && res.data.data.length > 0) {
                                    const word = res.data.data[0];
                                    if (word.term === row.Term) {
                                        await updateWordStatus(word._id, status);
                                        updatedCount++;
                                    }
                                }
                            }
                        } catch (err) {
                            console.error(`Failed to import ${row.Term}`, err);
                        }
                    }
                }

                setLoading(false);
                alert(`Import complete! Updated ${updatedCount} words.`);
                e.target.value = '';
                window.location.reload();

            } catch (error) {
                console.error("Import error", error);
                alert("Failed to parse file.");
                setLoading(false);
                e.target.value = '';
            }
        };
        reader.onerror = () => {
            alert("Failed to read file.");
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(userId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSync = () => {
        if (syncWithCode(inputCode)) {
            setShowKeyModal(false);
            // Ideally trigger a toast here
            alert("Progress synced successfully!");
            window.location.reload(); // Reload to refresh context state cleanly
        } else {
            alert("Invalid code format.");
        }
    };

    const renderContent = () => {
        if (error) {
            return (
                <div className="text-center py-12 bg-red-500/10 rounded-2xl border border-red-500/20 mb-8">
                    <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-400 mb-2">Oops! Something went wrong</h3>
                    <p className="text-gray-400">{error}</p>
                    <button
                        onClick={() => fetchWords()}
                        className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        if (loading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <SkeletonCard key={index} showImage={false} rows={4} footer={false} />
                    ))}
                </div>
            );
        }

        if (words.length === 0) {
            return (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400">No words found trying clearing filters.</p>
                    <button
                        onClick={() => setFilters({ search: '', level: 'All' })}
                        className="mt-4 text-[#e8c547] hover:underline"
                    >
                        Clear Filters
                    </button>
                </div>
            );
        }

        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {words.map((word) => (
                        <WordCard key={word._id} word={word} />
                    ))}
                </div>

                {/* Pagination Map */}
                {pagination.totalPages > 1 && (
                    <PaginationMap
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                        words={words}
                        userProgress={userProgress}
                    />
                )}
            </>
        );
    };

    return (
        <PageContainer className="bg-black min-h-screen relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-[500px] opacity-20">
                    <img
                        src="/images/vocabulary/vocabulary-vault-banner.png"
                        alt="Vocabulary Vault Banner"
                        className="w-full h-full object-cover mask-image-gradient"
                        style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}
                    />
                </div>
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
                            Vocabulary Vault
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Master <span className="text-[#e8c547] font-bold">{totalWordCount.toLocaleString()}+</span> words. Track your progress anywhere.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {/* Vault Key Widget */}
                        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-3 flex items-center gap-3">
                            <div className="bg-accent/20 p-2 rounded-lg">
                                <FaKey className="text-accent" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Your Vault Key</span>
                                <div className="flex items-center gap-2">
                                    <code className="text-sm font-mono text-white bg-black/30 px-2 py-1 rounded">
                                        {userId ? userId.slice(0, 8) + '...' : 'Loading...'}
                                    </code>
                                    <button onClick={() => setShowKeyModal(true)} className="text-xs text-accent hover:underline">
                                        Manage
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Button */}
                        <button
                            onClick={() => setShowStatsModal(true)}
                            className="h-full px-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-sm font-medium"
                            title="View Statistics"
                        >
                            <FaChartBar /> <span className="hidden md:inline">Stats</span>
                        </button>

                        {/* Quiz Button */}
                        <button
                            onClick={() => setShowQuizModal(true)}
                            className="h-full px-6 flex items-center gap-2 bg-[#e8c547] hover:bg-[#d4b445] text-black border border-[#e8c547] rounded-xl transition-colors text-sm font-bold shadow-[0_0_15px_rgba(232,197,71,0.2)] hover:shadow-[0_0_25px_rgba(232,197,71,0.4)]"
                            title="Start Quiz"
                        >
                            <FaTrophy /> Practice
                        </button>

                        {/* Export Dropdown */}
                        <div className="relative group">
                            <button className="h-full px-6 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-sm font-medium">
                                <FaDownload /> Export
                            </button>
                            <div className="absolute right-0 top-full pt-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-50">
                                <div className="bg-black border border-white/10 rounded-xl shadow-xl overflow-hidden">
                                    <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-300 hover:text-white border-b border-white/5">
                                        Export as CSV (.csv)
                                    </button>
                                    <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-300 hover:text-white">
                                        Export as PDF (.pdf)
                                    </button>
                                    <div className="border-t border-white/5 my-1"></div>
                                    <label className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm font-medium text-[#e8c547] hover:text-[#e8c547]/80 cursor-pointer block flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <input type="file" accept=".csv,text/csv" onChange={handleImport} className="hidden" />
                                            <FaDownload className="rotate-180" />
                                            <span>Import CSV (.csv)</span>
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-normal ml-6">
                                            Format: Columns "Term" & "Status" (optional)
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <WordOfTheDay />

                <SearchFilters onSearch={handleSearch} initialFilters={filters} />

                {/* Content Area */}
                {renderContent()}
            </div>

            {/* Sync Modal */}
            <Modal
                isOpen={showKeyModal}
                onClose={() => setShowKeyModal(false)}
                title="Manage Vault Key"
                className="max-w-md"
            >
                <div className="p-6">
                    <p className="text-gray-400 text-sm mb-6">
                        This key allows you to sync your vocabulary progress across devices or browsers without creating an account. Keep it safe!
                    </p>

                    {/* Current Key */}
                    <div className="mb-6">
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Your Current Key</label>
                        <div className="flex gap-2">
                            <code className="flex-1 bg-black border border-white/10 rounded-lg p-3 font-mono text-sm break-all">
                                {userId}
                            </code>
                            <button
                                onClick={copyToClipboard}
                                className="px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center min-w-[50px]"
                            >
                                {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                            </button>
                        </div>
                    </div>

                    {/* Restore Key */}
                    <div className="mb-6">
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Restore Progress / Enter Key</label>
                        <input
                            type="text"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="Paste your key here..."
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowKeyModal(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleSync}
                            disabled={!inputCode}
                            className="px-6 py-2 bg-accent hover:bg-accent/80 text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Restore
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Stats Modal */}
            {showStatsModal && (
                <StatsModal
                    onClose={() => setShowStatsModal(false)}
                    userProgress={userProgress}
                    words={words} // Note: This only passes current page words, ideally needs all.
                // StatsModal logic handles this gracefully for now.
                />
            )}

            {/* Quiz Modal */}
            {showQuizModal && (
                <QuizModal
                    onClose={() => setShowQuizModal(false)}
                    userProgress={userProgress}
                    allWords={words} // Pass current words to help quiz gen, component fetches more if needed
                />
            )}
        </PageContainer>
    );
}
