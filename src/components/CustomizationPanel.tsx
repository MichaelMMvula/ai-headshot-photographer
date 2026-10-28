import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sliders, Sparkles } from 'lucide-react';
import { ASPECT_RATIOS, EXPRESSION_PRESETS, LIGHTING_PRESETS, WARDROBE_PRESETS } from '../data/styles';
import { CustomizationOptions } from '../types';

interface CustomizationPanelProps {
  options: CustomizationOptions;
  onChange: (updated: Partial<CustomizationOptions>) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Step 3: Studio Fine-Tuning</span>
              <span className="text-xs font-normal text-slate-400">(Optional)</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Customize wardrobe, lighting nuance, facial expression, and framing ratio.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-amber-400 shrink-0">
          <span>{isOpen ? 'Collapse Controls' : 'Expand Controls'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 pt-0 border-t border-slate-800 space-y-6">
          {/* Aspect Ratio Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Framing & Crop Ratio
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ASPECT_RATIOS.map((ratio) => {
                const isSelected = options.aspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => onChange({ aspectRatio: ratio.id })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 text-white ring-1 ring-amber-400/50'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">{ratio.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{ratio.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wardrobe Styling */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Wardrobe Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {WARDROBE_PRESETS.map((wardrobe) => {
                const isSelected = options.wardrobe === wardrobe;
                return (
                  <button
                    key={wardrobe}
                    type="button"
                    onClick={() => onChange({ wardrobe: isSelected ? '' : wardrobe })}
                    className={`px-3 py-2 text-xs rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {wardrobe}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lighting Setup */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Studio Lighting Tone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LIGHTING_PRESETS.map((light) => {
                const isSelected = options.lighting === light;
                return (
                  <button
                    key={light}
                    type="button"
                    onClick={() => onChange({ lighting: isSelected ? '' : light })}
                    className={`px-3 py-2 text-xs rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {light}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expression Tone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Expression Tone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {EXPRESSION_PRESETS.map((expr) => {
                const isSelected = options.expression === expr;
                return (
                  <button
                    key={expr}
                    type="button"
                    onClick={() => onChange({ expression: isSelected ? '' : expr })}
                    className={`px-3 py-2 text-xs rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {expr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Prompt Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Additional Creative Direction (Text Prompt)</span>
              <span className="text-[11px] text-slate-500 normal-case font-normal">Optional</span>
            </label>
            <input
              type="text"
              value={options.customPrompt}
              onChange={(e) => onChange({ customPrompt: e.target.value })}
              placeholder="e.g. Add thin black designer eyeglasses, subtle golden rim lighting, warmer smile"
              className="w-full px-3.5 py-2.5 text-xs text-white bg-slate-950 border border-slate-700 rounded-lg placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
};
