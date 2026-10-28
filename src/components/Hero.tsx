import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { HERO_SHOWCASE_URL } from '../data/styles';

interface HeroProps {
  onStartClick: () => void;
  onExploreStylesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick, onExploreStylesClick }) => {
  return (
    <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-850 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Split Screen Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-4">
              <span>Studio-Grade AI Photography</span>
              <span aria-hidden="true">·</span>
              <span>Identity-Preserving Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6 [text-wrap:balance]">
              Turn casual everyday selfies into executive headshots.
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
              Skip the expensive studio booking, awkward lighting setups, and wardrobe changes.
              Upload a single casual photo and get generic, high-end commercial headshots in corporate slate,
              modern tech office, or warm outdoor sunlight.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={onStartClick}
                className="px-6 py-3.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all duration-200 shadow-md hover:shadow-amber-500/10 flex items-center gap-2 whitespace-nowrap"
              >
                <span>Upload Selfie & Generate</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreStylesClick}
                className="px-6 py-3.5 text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-750 rounded-lg transition-colors whitespace-nowrap"
              >
                Explore 5 Studio Styles
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Facial Likeness Preserved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Commercial Rights Included</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Sub-15s Generation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <img
                src={HERO_SHOWCASE_URL}
                alt="Executive studio headshot showcase"
                className="w-full h-auto aspect-4/3 lg:aspect-3/4 object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">Executive Portrait Series</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">85mm f/2.0 · Three-point studio lighting</div>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-mono font-medium">Ready in 10s</span>
                  <div className="text-slate-400 text-[11px]">1K / 2K Export</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Metrics Strip in full-width row below split */}
        <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-white font-mono tabular-nums">85mm</div>
            <div className="text-xs text-slate-400 mt-1">Portrait Prime Bokeh</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-white font-mono tabular-nums">&lt; 15s</div>
            <div className="text-xs text-slate-400 mt-1">Studio Generation Time</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-white font-mono tabular-nums">5 Styles</div>
            <div className="text-xs text-slate-400 mt-1">Corporate, Tech & Outdoor</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-white font-mono tabular-nums">100%</div>
            <div className="text-xs text-slate-400 mt-1">Identity Likeness Focus</div>
          </div>
        </div>
      </div>
    </section>
  );
};
