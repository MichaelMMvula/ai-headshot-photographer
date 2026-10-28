import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ChevronRight,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SelfieUploader } from './components/SelfieUploader';
import { StyleSelector } from './components/StyleSelector';
import { CustomizationPanel } from './components/CustomizationPanel';
import { HeadshotResult } from './components/HeadshotResult';
import { HeadshotGallery } from './components/HeadshotGallery';
import { StyleShowcaseSection } from './components/StyleShowcaseSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { CustomizationOptions, GeneratedHeadshot } from './types';
import { HEADSHOT_STYLES, SAMPLE_SELFIE_URL } from './data/styles';

const INITIAL_OPTIONS: CustomizationOptions = {
  wardrobe: '',
  lighting: '',
  expression: '',
  aspectRatio: '1:1',
  customPrompt: '',
};

export default function App() {
  const [selfieBase64, setSelfieBase64] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('corporate-grey');
  const [customOptions, setCustomOptions] = useState<CustomizationOptions>(INITIAL_OPTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [activeHeadshot, setActiveHeadshot] = useState<GeneratedHeadshot | null>(null);
  const [history, setHistory] = useState<GeneratedHeadshot[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generationStage, setGenerationStage] = useState<string>('');

  // Initial load: pre-seed sample headshot in history for immediate inspiration
  useEffect(() => {
    const seedHeadshot: GeneratedHeadshot = {
      id: 'seed-corp-1',
      imageUrl: '/src/assets/images/style_corporate_grey_1793188801210.jpg',
      originalSelfieUrl: SAMPLE_SELFIE_URL,
      styleId: 'corporate-grey',
      styleName: 'Corporate Grey Backdrop',
      wardrobe: 'Tailored Navy Wool Suit',
      lighting: 'Three-point studio lighting',
      expression: 'Confident & Warm Smile',
      aspectRatio: '1:1',
      createdAt: Date.now() - 3600000,
      variations: [
        {
          id: 'seed-var-1',
          title: 'Take 1: Warm & Friendly Smile',
          subtitle: 'Softbox Fill & Relaxed Expression',
          imageUrl: '/src/assets/images/style_corporate_grey_1793188801210.jpg',
        },
        {
          id: 'seed-var-2',
          title: 'Take 2: Sculpted Rembrandt Key',
          subtitle: '15° Subtle Angle & Cheekbone Lighting',
          imageUrl: '/src/assets/images/style_tech_office_1793188803047.jpg',
        },
        {
          id: 'seed-var-3',
          title: 'Take 3: Radiant Catchlights',
          subtitle: 'Crisp Eye Catchlights & Golden Hair Rim',
          imageUrl: '/src/assets/images/style_outdoor_natural_1793188802006.jpg',
        },
      ],
    };
    setActiveHeadshot(seedHeadshot);
    setHistory([seedHeadshot]);
  }, []);

  const scrollToStudio = () => {
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToStyles = () => {
    document.getElementById('styles')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    setErrorMessage(null);
    setIsGenerating(true);

    const stages = [
      'Calibrating facial anatomical structure...',
      'Synthesizing 85mm portrait depth of field...',
      'Tailoring professional executive wardrobe...',
      'Balancing studio key and ambient fill lighting...',
      'Rendering publication-ready portrait details...',
    ];

    let currentStageIndex = 0;
    setGenerationStage(stages[0]);
    const stageInterval = setInterval(() => {
      currentStageIndex = (currentStageIndex + 1) % stages.length;
      setGenerationStage(stages[currentStageIndex]);
    }, 2500);

    try {
      const selectedStyle =
        HEADSHOT_STYLES.find((s) => s.id === selectedStyleId) || HEADSHOT_STYLES[0];

      const res = await fetch('/api/generate-headshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selfieBase64,
          styleId: selectedStyleId,
          wardrobe: customOptions.wardrobe,
          lighting: customOptions.lighting,
          expression: customOptions.expression,
          customPrompt: customOptions.customPrompt,
          aspectRatio: customOptions.aspectRatio,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate headshot. Please try again.');
      }

      const newHeadshot: GeneratedHeadshot = {
        id: `headshot-${Date.now()}`,
        imageUrl: data.imageUrl,
        originalSelfieUrl: selfieBase64 || '',
        styleId: selectedStyleId,
        styleName: selectedStyle.name,
        wardrobe: customOptions.wardrobe || selectedStyle.wardrobeVibe,
        lighting: customOptions.lighting || selectedStyle.lightingType,
        expression: customOptions.expression || 'Warm & Confident',
        aspectRatio: customOptions.aspectRatio,
        createdAt: Date.now(),
        promptNotes: customOptions.customPrompt,
      };

      setActiveHeadshot(newHeadshot);
      setHistory((prev) => [newHeadshot, ...prev]);

      // Scroll to result view
      setTimeout(() => {
        document.getElementById('result-view')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

      // Automatically generate 3 slight variations once headshot is successfully generated
      triggerVariations(newHeadshot);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during generation.');
    } finally {
      clearInterval(stageInterval);
      setIsGenerating(false);
      setGenerationStage('');
    }
  };

  const triggerVariations = async (targetHeadshot: GeneratedHeadshot) => {
    setIsGeneratingVariations(true);
    try {
      const res = await fetch('/api/generate-variations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetHeadshot.originalSelfieUrl || selfieBase64,
          headshotBase64: targetHeadshot.imageUrl,
          styleId: targetHeadshot.styleId,
          aspectRatio: targetHeadshot.aspectRatio,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.variations?.length > 0) {
        setActiveHeadshot((prev) => {
          if (!prev || prev.id !== targetHeadshot.id) return prev;
          return {
            ...prev,
            variations: data.variations,
          };
        });
        setHistory((prev) =>
          prev.map((item) =>
            item.id === targetHeadshot.id
              ? { ...item, variations: data.variations }
              : item
          )
        );
      }
    } catch (err) {
      console.warn('Background variations generation encountered notice:', err);
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  const handleSelectVariation = (selectedImageUrl: string) => {
    if (!activeHeadshot) return;
    const updated = {
      ...activeHeadshot,
      imageUrl: selectedImageUrl,
    };
    setActiveHeadshot(updated);
    setHistory((prev) =>
      prev.map((item) => (item.id === activeHeadshot.id ? updated : item))
    );
  };

  const handleRefine = async (instruction: string) => {
    if (!activeHeadshot) return;
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/refine-headshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: activeHeadshot.imageUrl,
          instruction,
          aspectRatio: activeHeadshot.aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to refine headshot.');
      }

      const updatedHeadshot: GeneratedHeadshot = {
        ...activeHeadshot,
        id: `headshot-refine-${Date.now()}`,
        imageUrl: data.imageUrl,
        createdAt: Date.now(),
      };

      setActiveHeadshot(updatedHeadshot);
      setHistory((prev) => [updatedHeadshot, ...prev]);
    } catch (err: any) {
      console.error('Refine error:', err);
      setErrorMessage(err.message || 'Failed to refine headshot.');
    } finally {
      setIsRefining(false);
    }
  };

  const selectedStyle =
    HEADSHOT_STYLES.find((s) => s.id === selectedStyleId) || HEADSHOT_STYLES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Header onStartClick={scrollToStudio} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero onStartClick={scrollToStudio} onExploreStylesClick={scrollToStyles} />

        {/* Studio Workspace Section */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-6" id="studio">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <Camera className="w-4 h-4" />
              <span>Interactive AI Studio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              Craft Your Executive Portrait
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload your photo, select a desired background and lighting environment, and generate commercial headshots
              calibrated for LinkedIn, resumes, and corporate media.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-8 p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block mb-0.5">Generation Notice</span>
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-300 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Workflow Steps Container */}
          <div className="space-y-8">
            {/* Step 1: Upload Selfie */}
            <SelfieUploader
              selfieBase64={selfieBase64}
              onSelfieSelected={(base64) => {
                setSelfieBase64(base64);
                setErrorMessage(null);
              }}
              onSelfieCleared={() => setSelfieBase64(null)}
            />

            {/* Step 2: Choose Photography Style */}
            <StyleSelector
              selectedStyleId={selectedStyleId}
              onSelectStyle={(id) => setSelectedStyleId(id)}
            />

            {/* Step 3: Customization Panel (Optional) */}
            <CustomizationPanel
              options={customOptions}
              onChange={(updated) => setCustomOptions((prev) => ({ ...prev, ...updated }))}
            />

            {/* Action Bar / Generate Button */}
            <div className="p-6 md:p-8 rounded-2xl border border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>Ready to Render:</span>
                  <span className="text-amber-400 font-bold">{selectedStyle.name}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {selfieBase64
                    ? 'Using your uploaded photo as facial reference.'
                    : 'Tip: Upload a selfie above, or click Generate to test with a clean baseline portrait.'}
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2.5 whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    <span>Rendering Headshot...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Studio Headshot</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* In-Progress Progress Stage Indicator */}
            {isGenerating && (
              <div className="p-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-center space-y-4 animate-pulse">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Camera className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="text-base font-bold text-white mb-1">
                    Generating High-Resolution Portrait
                  </div>
                  <div className="text-xs font-mono text-amber-300 tracking-wide">
                    {generationStage || 'Processing generative photography pipeline...'}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 max-w-md mx-auto">
                  Applying studio lighting key, simulated 85mm prime lens compression, and tailored wardrobe while preserving your facial identity.
                </div>
              </div>
            )}

            {/* Generated Result View */}
            {activeHeadshot && !isGenerating && (
              <HeadshotResult
                headshot={activeHeadshot}
                onRegenerate={handleGenerate}
                onRefine={handleRefine}
                isRefining={isRefining}
                onOpenLightbox={(img) => setLightboxImage(img)}
                onSelectVariation={handleSelectVariation}
                onGenerateVariations={() => triggerVariations(activeHeadshot)}
                isGeneratingVariations={isGeneratingVariations}
              />
            )}

            {/* Session History Gallery */}
            <HeadshotGallery
              headshots={history}
              activeId={activeHeadshot?.id || ''}
              onSelect={(item) => {
                setActiveHeadshot(item);
                document.getElementById('result-view')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onClearHistory={() => {
                if (activeHeadshot) {
                  setHistory([activeHeadshot]);
                }
              }}
            />
          </div>
        </section>

        {/* Style Showcase Editorial Section */}
        <StyleShowcaseSection
          onSelectStyle={(id) => {
            setSelectedStyleId(id);
          }}
        />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
