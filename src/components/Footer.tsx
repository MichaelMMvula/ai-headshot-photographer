import React from 'react';
import { Camera } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-900 pt-8">
        <div className="flex items-center gap-2 text-white font-semibold">
          <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Camera className="w-3.5 h-3.5" />
          </div>
          <span>Lumina AI Headshot Studio</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <a href="#studio" className="hover:text-white transition-colors">
            Studio
          </a>
          <a href="#styles" className="hover:text-white transition-colors">
            Styles
          </a>
          <a href="#comparison" className="hover:text-white transition-colors">
            Comparison
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </div>

        <div className="text-slate-500">
          &copy; {new Date().getFullYear()} Lumina Studio. Commercial headshots engineered with generative AI.
        </div>
      </div>
    </footer>
  );
};
