import React from 'react';
import { Download, History, Trash2 } from 'lucide-react';
import { GeneratedHeadshot } from '../types';

interface HeadshotGalleryProps {
  headshots: GeneratedHeadshot[];
  activeId: string;
  onSelect: (headshot: GeneratedHeadshot) => void;
  onClearHistory: () => void;
}

export const HeadshotGallery: React.FC<HeadshotGalleryProps> = ({
  headshots,
  activeId,
  onSelect,
  onClearHistory,
}) => {
  if (headshots.length <= 1) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Session Headshots Gallery</h3>
          <span className="text-xs text-slate-400 font-mono">({headshots.length} generated)</span>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {headshots.map((item) => {
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`group relative rounded-xl overflow-hidden border cursor-pointer aspect-square bg-slate-950 transition-all ${
                isActive
                  ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                  : 'border-slate-800 hover:border-slate-600'
              }`}
            >
              <img
                src={item.imageUrl}
                alt={item.styleName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="text-[10px] font-semibold text-white truncate">{item.styleName}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
