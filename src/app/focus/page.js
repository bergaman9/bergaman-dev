"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

const MODES = {
  work: { label: 'Focus', minutes: 25, icon: 'fas fa-brain' },
  short: { label: 'Short Break', minutes: 5, icon: 'fas fa-mug-hot' },
  long: { label: 'Long Break', minutes: 15, icon: 'fas fa-couch' },
};

function format(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function FocusTimerPage() {
  const [mode, setMode] = useState('work');
  const [secondsLeft, setSecondsLeft] = useState(MODES.work.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);
  const intervalRef = useRef(null);

  const totalForMode = MODES[mode].minutes * 60;
  const progress = 1 - secondsLeft / totalForMode;

  const switchMode = useCallback((nextMode) => {
    setMode(nextMode);
    setSecondsLeft(MODES[nextMode].minutes * 60);
    setIsRunning(false);
  }, []);

  // Tick
  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Handle completion
  useEffect(() => {
    if (secondsLeft !== 0) return;
    setIsRunning(false);
    if (mode === 'work') {
      setCompletedRounds((r) => r + 1);
      // Every 4th focus round earns a long break
      switchMode((completedRounds + 1) % 4 === 0 ? 'long' : 'short');
    } else {
      switchMode('work');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  // Reflect remaining time in the tab title while running
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const base = 'Focus Timer | Bergaman';
    document.title = isRunning ? `${format(secondsLeft)} · ${MODES[mode].label}` : base;
    return () => { document.title = base; };
  }, [secondsLeft, isRunning, mode]);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(MODES[mode].minutes * 60);
  };

  // Circular progress geometry
  const R = 120;
  const C = 2 * Math.PI * R;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--mini-accent, #fb7185)' }}>
          <i className="fas fa-hourglass-half mr-2"></i> Focus Timer
        </h1>
        <p className="text-gray-400 mt-2">Work in focused sprints with the Pomodoro technique.</p>
      </header>

      {/* Mode switcher */}
      <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Timer mode">
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            role="tab"
            aria-selected={mode === key}
            onClick={() => switchMode(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 ${
              mode === key
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
            }`}
          >
            <i className={`${m.icon} mr-2 text-xs`}></i>{m.label}
          </button>
        ))}
      </div>

      {/* Dial */}
      <div className="flex justify-center mb-8">
        <div className="relative w-72 h-72 max-w-full">
          <svg viewBox="0 0 280 280" className="w-full h-full -rotate-90">
            <circle cx="140" cy="140" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
            <circle
              cx="140" cy="140" r={R} fill="none"
              stroke="var(--mini-accent, #fb7185)" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-bold tabular-nums text-white">{format(secondsLeft)}</span>
            <span className="text-sm text-gray-400 mt-2">{MODES[mode].label}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          aria-label="Reset timer"
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
        >
          <i className="fas fa-rotate-left"></i>
        </button>
        <button
          onClick={() => setIsRunning((v) => !v)}
          className="px-10 py-4 rounded-full font-bold text-lg text-black transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
          style={{ background: 'var(--mini-accent, #fb7185)' }}
        >
          <i className={`fas ${isRunning ? 'fa-pause' : 'fa-play'} mr-2`}></i>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => { setSecondsLeft(0); }}
          aria-label="Skip to next session"
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
        >
          <i className="fas fa-forward-step"></i>
        </button>
      </div>

      <p className="text-center text-gray-500 text-sm mt-8">
        <i className="fas fa-check-circle text-rose-400/70 mr-1.5"></i>
        {completedRounds} focus {completedRounds === 1 ? 'round' : 'rounds'} completed
      </p>
    </div>
  );
}
