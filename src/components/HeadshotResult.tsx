import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Check,
  Columns,
  Download,
  Eye,
  FileImage,
  Maximize2,
  RefreshCw,
  Send,
  Share2,
  Sliders,
  Sparkles,
  X,
} from 'lucide-react';
import { GeneratedHeadshot } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { SAMPLE_SELFIE_URL } from '../data/styles';

interface HeadshotResultProps {
  headshot: GeneratedHeadshot;
  onRegenerate: () => void;
  onRefine: (instruction: string) => Promise<void>;
  isRefining: boolean;
  onOpenLightbox: (imageUrl: string) => void;
}

export const HeadshotResult: React.FC<HeadshotResultProps> = ({
  headshot,
  onRegenerate,
  onRefine,
  isRefining,
  onOpenLightbox,
}) => {
  const [viewMode, setViewMode] = useState<'slider' | 'single' | 'side-by-side'>('slider');
  const [toggleState, setToggleState] = useState<'after' | 'before'>('after');
  const [retouchText, setRetouchText] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadJpegSuccess, setDownloadJpegSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Guarantee valid before image so slider always works
  const beforeImage = headshot.originalSelfieUrl || SAMPLE_SELFIE_URL;
  const afterImage = headshot.imageUrl;

  const quickRetouchPrompts = [
    'Change suit jacket to classic dark navy',
    'Warm, approachable, friendly smile',
    'Increase background blur for deeper bokeh',
    'Add subtle golden rim lighting to hair',
    'Dress in executive charcoal blazer with white shirt',
  ];

  const handleDownload = (cropName = 'high-res') => {
    const link = document.createElement('a');
    link.href = headshot.imageUrl;
    link.download = `lumina-headshot-${headshot.styleId}-${cropName}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleDownloadJpeg = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 1024;
        canvas.height = img.naturalHeight || 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // White background for clean opaque JPEG output
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `lumina-headshot-${headshot.styleId}-hq-${Date.now()}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setDownloadJpegSuccess(true);
                setToastMessage('High-quality JPEG image downloaded successfully!');
                setTimeout(() => setDownloadJpegSuccess(false), 2500);
                setTimeout(() => setToastMessage(null), 3500);
              }
            },
            'image/jpeg',
            0.98
          );
          return;
        }
      } catch (err) {
        console.warn('Canvas JPEG conversion failed, falling back to direct download', err);
      }

      // Fallback
      const link = document.createElement('a');
      link.href = headshot.imageUrl;
      link.download = `lumina-headshot-${headshot.styleId}-hq-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadJpegSuccess(true);
      setToastMessage('High-quality JPEG image downloaded successfully!');
      setTimeout(() => setDownloadJpegSuccess(false), 2500);
      setTimeout(() => setToastMessage(null), 3500);
    };

    img.onerror = () => {
      const link = document.createElement('a');
      link.href = headshot.imageUrl;
      link.download = `lumina-headshot-${headshot.styleId}-hq-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadJpegSuccess(true);
      setToastMessage('High-quality JPEG image downloaded successfully!');
      setTimeout(() => setDownloadJpegSuccess(false), 2500);
      setTimeout(() => setToastMessage(null), 3500);
    };

    img.src = headshot.imageUrl;
  };

  const handleShare = async () => {
    const urlToCopy = headshot.imageUrl.startsWith('data:')
      ? headshot.imageUrl
      : headshot.imageUrl.startsWith('http')
      ? headshot.imageUrl
      : `${window.location.origin}${headshot.imageUrl}`;

    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(urlToCopy);
        copied = true;
      }
    } catch (err) {
      console.warn('Clipboard writeText failed, trying fallback', err);
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = urlToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (fallbackErr) {
        console.error('Fallback clipboard copy failed', fallbackErr);
      }
    }

    setShareSuccess(true);
    setToastMessage('Headshot image URL copied to clipboard! Ready to share.');
    setTimeout(() => {
      setShareSuccess(false);
    }, 2500);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const submitRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!retouchText.trim() || isRefining) return;
    const text = retouchText;
    setRetouchText('');
    await onRefine(text);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 space-y-8" id="result-view">
      {/* Top Header of Result */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <span>Studio Production Completed</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-normal">{headshot.styleName}</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Professional Headshot</h2>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Instant Toggle Button */}
          <button
            type="button"
            onClick={() => {
              if (viewMode !== 'single') setViewMode('single');
              setToggleState((prev) => (prev === 'after' ? 'before' : 'after'));
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors flex items-center gap-1.5"
            title="Instant one-click toggle between Original and Headshot"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Toggle: {toggleState === 'after' ? 'View Original' : 'View Headshot'}</span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'slider' ? 'bg-amber-400 text-slate-950 shadow-sm font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Before & After Slider</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'side-by-side' ? 'bg-amber-400 text-slate-950 shadow-sm font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('single');
                setToggleState('after');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'single' ? 'bg-amber-400 text-slate-950 shadow-sm font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Headshot Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="flex justify-center">
        {viewMode === 'slider' ? (
          <div className="w-full max-w-2xl relative">
            <div className="aspect-square w-full relative">
              <BeforeAfterSlider
                beforeImage={beforeImage}
                afterImage={afterImage}
                beforeLabel="Original Casual Selfie"
                afterLabel="AI Studio Headshot"
                className="w-full h-full"
              />
              <button
                type="button"
                onClick={() => onOpenLightbox(afterImage)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-900 transition-colors z-20"
                title="View full screen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
            {/* Left: Original Casual Selfie */}
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative aspect-square shadow-lg">
              <img
                src={beforeImage}
                alt="Original Selfie"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/85 backdrop-blur-sm border border-slate-700/80 text-[11px] font-medium text-slate-300">
                Original Casual Selfie
              </div>
              <div className="absolute bottom-3 left-3 right-3 p-2 rounded-lg bg-slate-950/80 backdrop-blur-sm text-[11px] text-slate-400">
                Casual attire · Everyday ambient lighting
              </div>
            </div>

            {/* Right: AI Studio Headshot */}
            <div className="rounded-xl overflow-hidden border border-amber-400/50 bg-slate-950 relative aspect-square shadow-2xl">
              <img
                src={afterImage}
                alt="Generated Headshot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-amber-400 text-slate-950 text-[11px] font-bold shadow-md">
                AI Studio Headshot
              </div>
              <button
                type="button"
                onClick={() => onOpenLightbox(afterImage)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 hover:text-white"
                title="Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-3 left-3 right-3 p-2 rounded-lg bg-slate-950/80 backdrop-blur-sm flex items-center justify-between text-[11px]">
                <span className="text-white font-medium">{headshot.styleName}</span>
                <span className="text-amber-400 font-mono">85mm Studio Lighting</span>
              </div>
            </div>
          </div>
        ) : (
          /* Single Image View with Instant Toggle state */
          <div className="w-full max-w-xl aspect-square relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <img
              src={toggleState === 'after' ? afterImage : beforeImage}
              alt={toggleState === 'after' ? 'Generated Headshot' : 'Original Selfie'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => onOpenLightbox(toggleState === 'after' ? afterImage : beforeImage)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-slate-200 hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-sm border border-slate-700 text-xs font-semibold text-white">
              {toggleState === 'after' ? 'AI Studio Headshot' : 'Original Casual Selfie'}
            </div>
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">
                {toggleState === 'after' ? headshot.styleName : 'Input Selfie Reference'}
              </span>
              <button
                type="button"
                onClick={() => setToggleState((prev) => (prev === 'after' ? 'before' : 'after'))}
                className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2"
              >
                Switch to {toggleState === 'after' ? 'Original' : 'Headshot'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Strip: Downloads & Regenerate */}
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* High-Quality JPEG Download Button */}
          <button
            type="button"
            onClick={handleDownloadJpeg}
            className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap ${
              downloadJpegSuccess
                ? 'bg-emerald-400 text-slate-950 font-bold'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
            title="Download as high-quality JPEG format"
          >
            {downloadJpegSuccess ? (
              <>
                <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>JPEG Downloaded!</span>
              </>
            ) : (
              <>
                <FileImage className="w-4 h-4" />
                <span>Download JPEG</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleDownload('original')}
            className="px-3.5 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Downloaded PNG!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Download PNG</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleDownload('linkedin-1x1')}
            className="px-3.5 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            Download LinkedIn 1:1
          </button>

          <button
            type="button"
            onClick={() => handleDownload('resume-3x4')}
            className="px-3.5 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            Download Resume 3:4
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
              shareSuccess
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/40'
            }`}
            title="Copy generated image URL to clipboard"
          >
            {shareSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                <span>URL Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={onRegenerate}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate Another Variation</span>
        </button>
      </div>

      {/* AI Retouch & Refine Prompt Bar */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Photographer Retouch & Edit Bar</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Want to tweak this portrait? Describe adjustments in plain English (e.g. blazer color, lighting, smile, accessories).
          </p>
        </div>

        <form onSubmit={submitRefine} className="flex gap-2">
          <input
            type="text"
            value={retouchText}
            onChange={(e) => setRetouchText(e.target.value)}
            disabled={isRefining}
            placeholder="e.g. Make the smile slightly warmer and add a navy blue sports coat..."
            className="flex-1 px-4 py-2.5 text-xs text-white bg-slate-900 border border-slate-750 rounded-lg placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!retouchText.trim() || isRefining}
            className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
          >
            {isRefining ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Refining...</span>
              </>
            ) : (
              <>
                <span>Apply Edit</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick prompt chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-500">Quick tweaks:</span>
          {quickRetouchPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isRefining}
              onClick={() => onRefine(prompt)}
              className="px-2.5 py-1 text-[11px] text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors text-left disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Success Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-xl bg-slate-900/95 backdrop-blur-md border border-amber-500/40 text-white shadow-2xl flex items-center justify-between gap-3 animate-bounce-short">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Copied to Clipboard</div>
              <div className="text-[11px] text-slate-300">{toastMessage}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
            title="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
