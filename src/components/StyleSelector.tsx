import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { HEADSHOT_STYLES } from '../data/styles';
import { HeadshotStyle } from '../types';

interface StyleSelectorProps {
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyleId,
  onSelectStyle,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8" id="styles">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Step 2: Choose Photography Style</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Select the aesthetic, lighting setup, and professional environment for your headshot.
          </p>
        </div>

        {/* Clean typographic indicator */}
        <div className="text-xs text-slate-400">
          <span>{HEADSHOT_STYLES.length} Curated Studio Presets</span>
        </div>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HEADSHOT_STYLES.map((style: HeadshotStyle) => {
          const isSelected = selectedStyleId === style.id;
          return (
            <div
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              className={`group relative rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer flex flex-col ${
                isSelected
                  ? 'border-amber-400 bg-slate-900 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Style Image Preview */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                <img
                  src={style.previewImage}
                  alt={style.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Selected Checkmark Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                {/* Bottom title on image */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white tracking-tight">{style.name}</h3>
                  <div className="text-xs text-amber-300/90 mt-0.5">{style.tagline}</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">{style.description}</p>

                {/* Clean unboxed metadata with typographic separators */}
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Lighting:</span>
                    <span className="text-slate-300 font-medium">{style.lightingType}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Wardrobe:</span>
                    <span className="text-slate-300 font-medium">{style.wardrobeVibe}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Best for:</span>
                    <span className="text-amber-300/80">{style.recommendedFor}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStyle(style.id);
                    }}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Selected Style' : 'Select This Style'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
