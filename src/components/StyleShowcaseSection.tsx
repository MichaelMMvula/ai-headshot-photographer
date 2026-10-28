import React from 'react';
import { Camera, Check, Sparkles } from 'lucide-react';
import { HEADSHOT_STYLES } from '../data/styles';

interface StyleShowcaseSectionProps {
  onSelectStyle: (styleId: string) => void;
}

export const StyleShowcaseSection: React.FC<StyleShowcaseSectionProps> = ({ onSelectStyle }) => {
  return (
    <section className="py-16 border-b border-slate-850" id="comparison">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <span>Studio Lighting & Atmosphere</span>
            <span aria-hidden="true">·</span>
            <span>Master Profiles</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
            Designed for Every Professional Context
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Each photography style incorporates custom optical calibration, specific three-point lighting formulas,
            and context-authentic backdrops crafted for modern executives, founders, and leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {HEADSHOT_STYLES.slice(0, 3).map((style, index) => (
            <div
              key={style.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={style.previewImage}
                    alt={style.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{style.name}</span>
                    <span className="text-[11px] font-mono text-amber-400">0{index + 1}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-base font-bold text-white">{style.tagline}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{style.description}</p>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    {style.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    onSelectStyle(style.id);
                    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-750 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Use This Style</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
