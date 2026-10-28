import React, { useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface LightboxModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (imageUrl) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `lumina-headshot-hd-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJpeg = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 1024;
        canvas.height = img.naturalHeight || 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `lumina-headshot-hd-${Date.now()}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
            },
            'image/jpeg',
            0.98
          );
          return;
        }
      } catch (e) {
        console.warn('Canvas JPEG export failed', e);
      }
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `lumina-headshot-hd-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = imageUrl;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-slate-300 hover:text-white bg-slate-900/80 rounded-full transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          <img
            src={imageUrl}
            alt="High-resolution headshot"
            className="max-h-[80vh] w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={downloadJpeg}
            className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-2 transition-colors shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download JPEG (HQ)</span>
          </button>
          <button
            type="button"
            onClick={downloadImage}
            className="px-4 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
