import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

interface HeaderProps {
  onStartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
            <Camera className="w-4 h-4" />
          </div>
          <span>Lumina Headshots</span>
        </a>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#studio" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Studio
          </a>
          <a href="#styles" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Styles
          </a>
          <a href="#comparison" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Before & After
          </a>
          <a href="#guide" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Selfie Guide
          </a>
          <a href="#faq" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            FAQ
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartClick}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Headshot</span>
          </button>
        </div>
      </div>
    </header>
  );
};
