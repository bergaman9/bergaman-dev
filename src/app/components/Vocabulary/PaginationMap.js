'use client';

export default function PaginationMap({ currentPage, totalPages, onPageChange, words = [], userProgress = [] }) {

    // Helper to get status color
    const getStatusColor = (wordId) => {
        const progress = userProgress.find(p => p.wordId === wordId);
        const status = progress ? progress.status : 'unknown';

        switch (status) {
            case 'known': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
            case 'learning': return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]';
            case 'target': return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]';
            default: return 'bg-[#1a1a1a] border border-white/5'; // Unknown/Default
        }
    };

    const getStatusLabel = (wordId) => {
        const progress = userProgress.find(p => p.wordId === wordId);
        return progress ? progress.status.charAt(0).toUpperCase() + progress.status.slice(1) : 'Unknown';
    };

    return (
        <div className="w-full mt-8">
            {/* Header: Page Info & Legend */}
            <div className="flex justify-between items-end mb-3 px-1">
                <span className="text-xs text-gray-500 font-mono">
                    Page {currentPage} of {totalPages}
                </span>

                {/* Status Legend */}
                <div className="flex gap-3 text-[10px] text-gray-500 items-center">
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-[2px] bg-[#1a1a1a] border border-white/5"></div> New
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-[2px] bg-yellow-500"></div> Learning
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-[2px] bg-green-500"></div> Known
                    </span>
                </div>
            </div>

            {/* The "Commit Map" Grid for Current Page Words */}
            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-wrap gap-2 justify-center">
                    {words.map((word, index) => (
                        <div
                            key={word._id}
                            title={`${word.term} (${getStatusLabel(word._id)})`}
                            className={`
                                w-4 h-4 rounded-[3px] transition-all duration-300 hover:scale-125 cursor-help
                                ${getStatusColor(word._id)}
                            `}
                        />
                    ))}
                    {/* Fill empty spots if last page has fewer words (optional, keeps grid nice?) 
                        Actually not determining grid size strictly, just flex. 
                        If we want exactly 12 spots always visualized even if empty? 
                        User just said "12 ser tane olacak" (will be 12).
                        If page has 5 items, showing 5 is correct.
                    */}
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center gap-4 mt-3">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="text-xs text-gray-400 hover:text-white disabled:opacity-30 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                    Previous Page
                </button>

                {/* Quick Page Jump Input could go here if needed later */}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="text-xs text-[#e8c547] hover:text-[#f0d675] disabled:opacity-30 disabled:text-gray-500 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 font-bold"
                >
                    Next Page
                </button>
            </div>
        </div>
    );
}
