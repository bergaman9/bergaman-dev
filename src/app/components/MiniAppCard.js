'use client';

import SafeImage from './SafeImage';

export default function MiniAppCard({
    title,
    description,
    icon,
    image,
    href,
    status = 'active', // active, coming_soon
    theme = 'gold', // gold, blue, red, purple, pink
    badge = null, // "New", "Beta", "Hot"
    isOpen,
    onClick,
    ...props
}) {

    const themeColors = {
        gold: {
            accent: 'text-[#e8c547]',
            border: 'border-[#e8c547]',
            bg: 'bg-[#e8c547]',
            hover: 'group-hover:border-[#e8c547]/60 group-hover:shadow-[0_0_20px_rgba(232,197,71,0.2)]',
            gradient: 'from-[#e8c547]/10 to-transparent'
        },
        blue: {
            accent: 'text-cyan-400',
            border: 'border-cyan-500',
            bg: 'bg-cyan-500',
            hover: 'group-hover:border-cyan-500/60 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]',
            gradient: 'from-cyan-500/10 to-transparent'
        },
        red: {
            accent: 'text-rose-400',
            border: 'border-rose-500',
            bg: 'bg-rose-500',
            hover: 'group-hover:border-rose-500/60 group-hover:shadow-[0_0_20px_rgba(251,113,133,0.2)]',
            gradient: 'from-rose-500/10 to-transparent'
        },
        purple: {
            accent: 'text-fuchsia-400',
            border: 'border-fuchsia-500',
            bg: 'bg-fuchsia-500',
            hover: 'group-hover:border-fuchsia-500/60 group-hover:shadow-[0_0_20px_rgba(232,121,249,0.2)]',
            gradient: 'from-fuchsia-500/10 to-transparent'
        },
        pink: {
            accent: 'text-pink-400',
            border: 'border-pink-500',
            bg: 'bg-pink-500',
            hover: 'group-hover:border-pink-500/60 group-hover:shadow-[0_0_20px_rgba(244,114,182,0.2)]',
            gradient: 'from-pink-500/10 to-transparent'
        }
    };

    const t = themeColors[theme] || themeColors.gold;

    // We'll use a local state for hover effect if needed, but for the accordion behavior, 
    // relying on the parent to pass 'isOpen' and 'onClick' is better for "one open at a time".
    // However, to keep it simple and reusable as standalone, let's allow it to handle its own state 
    // OR accept props. Let's make it flexible.

    // Actually, to strictly follow "Problematic scrolling" fix, an Accordion (controlled by parent) is best.
    // But since I can't easily change the parent state logic without rewriting the parent entirely,
    // I will add an internal toggle or just styling for a "Compact Mode" that expands on click.

    // User asked: "Just app icon, see what it is on click".
    // Let's assume we want them strictly collapsed by default (except maybe the featured one?).

    // Let's modify the component to take `isOpen` and `toggle` props, but fallback to internal state.

    // WAIT, I need to Import `useState`.
    // The previous file content started with 'use client' but didn't import useState.

    return (
        <div
            onClick={onClick}
            className={`
                relative group bg-[#0e1b12]/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden 
                transition-all duration-500 cursor-pointer
                ${isOpen ? 'shadow-2xl translate-y-[-4px] ' + t.hover : 'hover:bg-white/5 hover:border-white/10'}
                ${t.border}
            `}
        >

            {/* Header / Compact View */}
            <div className={`p-4 flex items-center gap-4 relative z-10 ${isOpen ? 'border-b border-white/5 bg-black/20' : ''}`}>

                {/* Subtle Gradient Background for unique identity */}
                <div className={`absolute inset-0 bg-gradient-to-r ${t.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>

                <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all duration-300 relative z-20 shadow-lg
                    ${isOpen ? t.bg + ' text-black scale-110' : 'bg-white/5 ' + t.accent + ' group-hover:bg-white/10 group-hover:scale-105'}
                `}>
                    <i className={icon}></i>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-base truncate transition-colors ${isOpen ? t.accent : 'text-gray-300 group-hover:text-white'}`}>
                            {title}
                        </h3>
                        {/* Compact Badge */}
                        {!isOpen && badge && (
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${t.border} ${t.accent} bg-black/40`}>
                                {badge}
                            </span>
                        )}
                    </div>
                    {!isOpen && (
                        <p className="text-xs text-gray-500 truncate group-hover:text-gray-400 transition-colors">
                            {status === 'coming_soon' ? 'Coming Soon' : 'Click to open'}
                        </p>
                    )}
                </div>

                {/* Status Indicator (Compact) */}
                <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-700'}`}></div>
            </div>

            {/* Expanded Content */}
            <div className={`
                transition-all duration-500 ease-in-out overflow-hidden
                ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
                {/* Image/Banner Area */}
                <div className="relative h-32 w-full overflow-hidden bg-black/20">
                    {image ? (
                        <SafeImage
                            src={image}
                            alt={title}
                            fill
                            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${status === 'coming_soon' ? 'grayscale opacity-50' : ''}`}
                        />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center ${t.bg}/10`}>
                            <i className={`${icon} text-4xl ${t.accent} opacity-50`}></i>
                        </div>
                    )}
                </div>

                <div className="p-5 flex flex-col relative z-10">
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {description}
                    </p>

                    {status === 'active' ? (
                        <a
                            href={href}
                            onClick={(e) => e.stopPropagation()}
                            className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl ${t.bg}/10 hover:${t.bg} ${t.accent} hover:text-black border border-${t.border}/20 transition-all duration-300 font-semibold text-sm group/btn`}
                        >
                            Open Tool <i className="fas fa-arrow-right transform group-hover/btn:translate-x-1 transition-transform"></i>
                        </a>
                    ) : (
                        <button
                            disabled
                            className="mt-auto w-full py-2.5 rounded-xl bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed font-medium text-sm"
                        >
                            Coming Soon
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
