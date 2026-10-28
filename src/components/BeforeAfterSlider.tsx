import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronsLeftRight, Play, Pause, Sparkles, User } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  onPositionChange?: (pos: number) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Original Selfie',
  afterLabel = 'AI Studio Headshot',
  className = '',
  onPositionChange,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [isHoldingOriginal, setIsHoldingOriginal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const animDirectionRef = useRef<number>(1);

  const updatePosition = useCallback((newPos: number) => {
    const clamped = Math.max(0, Math.min(100, newPos));
    setSliderPosition(clamped);
    onPositionChange?.(clamped);
  }, [onPositionChange]);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    updatePosition(percentage);
  }, [updatePosition]);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleInteractionEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      setIsPlayingAuto(false);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleInteractionEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleInteractionEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging, handleMouseMove, handleInteractionEnd, handleTouchMove]);

  // Auto-play sweep animation
  useEffect(() => {
    if (!isPlayingAuto) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let pos = sliderPosition;
    const speed = 0.5; // percent per frame

    const animate = () => {
      if (animDirectionRef.current === 1) {
        pos += speed;
        if (pos >= 95) {
          pos = 95;
          animDirectionRef.current = -1;
        }
      } else {
        pos -= speed;
        if (pos <= 5) {
          pos = 5;
          animDirectionRef.current = 1;
        }
      }
      updatePosition(pos);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlayingAuto, updatePosition]);

  const currentEffectivePos = isHoldingOriginal ? 100 : sliderPosition;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Slider Viewport Container */}
      <div
        ref={containerRef}
        className={`relative select-none overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl cursor-ew-resize ${className}`}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* Background Layer: AI Headshot (After) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="w-full h-full object-cover block pointer-events-none select-none"
          referrerPolicy="no-referrer"
        />

        {/* Foreground Layer: Original Selfie (Before) with CSS clip-path */}
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-none"
          style={{
            clipPath: `inset(0 ${100 - currentEffectivePos}% 0 0)`,
          }}
          referrerPolicy="no-referrer"
        />

        {/* Vertical divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 pointer-events-auto"
          style={{
            left: `${currentEffectivePos}%`,
            transition: isHoldingOriginal ? 'left 150ms ease-out' : 'none',
          }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-slate-950 shadow-2xl flex items-center justify-center border-2 border-slate-900 hover:scale-105 active:scale-95 transition-transform">
            <ChevronsLeftRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-medium text-slate-200 pointer-events-none flex items-center gap-1.5 shadow-md">
          <User className="w-3 h-3 text-slate-400" />
          <span>{beforeLabel}</span>
        </div>
        <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-[11px] font-semibold text-amber-300 pointer-events-none flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{afterLabel}</span>
        </div>

        {/* Bottom drag hint */}
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 pointer-events-none whitespace-nowrap shadow-sm">
          Slide horizontally to inspect transformation
        </div>
      </div>

      {/* Interactive Controls Bar for the Slider */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setIsPlayingAuto(false);
              updatePosition(100);
            }}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              sliderPosition === 100
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            Original
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlayingAuto(false);
              updatePosition(50);
            }}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              sliderPosition === 50
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            50/50 Split
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlayingAuto(false);
              updatePosition(0);
            }}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              sliderPosition === 0
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            AI Headshot
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Hold to Compare button */}
          <button
            type="button"
            onMouseDown={() => setIsHoldingOriginal(true)}
            onMouseUp={() => setIsHoldingOriginal(false)}
            onMouseLeave={() => setIsHoldingOriginal(false)}
            onTouchStart={() => setIsHoldingOriginal(true)}
            onTouchEnd={() => setIsHoldingOriginal(false)}
            className="px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-850 active:bg-amber-400 active:text-slate-950 border border-slate-800 text-slate-300 text-xs font-medium transition-colors select-none"
            title="Press and hold to temporarily view original selfie"
          >
            Hold to Compare
          </button>

          {/* Auto sweep animation */}
          <button
            type="button"
            onClick={() => setIsPlayingAuto(!isPlayingAuto)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isPlayingAuto
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            {isPlayingAuto ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlayingAuto ? 'Pause' : 'Auto Sweep'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
