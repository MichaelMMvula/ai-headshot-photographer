import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, RefreshCw, Upload, User, Video, X } from 'lucide-react';
import { SAMPLE_SELFIE_URL } from '../data/styles';

interface SelfieUploaderProps {
  selfieBase64: string | null;
  onSelfieSelected: (base64: string) => void;
  onSelfieCleared: () => void;
}

export const SelfieUploader: React.FC<SelfieUploaderProps> = ({
  selfieBase64,
  onSelfieSelected,
  onSelfieCleared,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onSelfieSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const loadSampleSelfie = async () => {
    try {
      const response = await fetch(SAMPLE_SELFIE_URL);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        onSelfieSelected(base64data);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to load sample selfie:', err);
      // Fallback: use direct URL
      onSelfieSelected(SAMPLE_SELFIE_URL);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access webcam. Please check browser permissions or upload an existing photo.');
    }
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      stopCamera();
      onSelfieSelected(dataUrl);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <span>Step 1: Upload Your Casual Selfie</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Any everyday phone selfie or snapshot works. Our AI will preserve your facial likeness and transform the rest.
          </p>
        </div>

        {!selfieBase64 && (
          <button
            type="button"
            onClick={loadSampleSelfie}
            className="self-start sm:self-auto px-3.5 py-2 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-2 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Use Sample Selfie</span>
          </button>
        )}
      </div>

      {/* Selfie Upload Area or Preview */}
      {selfieBase64 ? (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-5 md:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-xl group">
              <img
                src={selfieBase64}
                alt="Uploaded selfie preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={onSelfieCleared}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/80 text-slate-200 hover:text-white hover:bg-rose-600 transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-sm text-[11px] text-amber-300 font-medium text-center">
                Input Reference Active
              </div>
            </div>
          </div>

          <div className="sm:col-span-7 md:col-span-8 flex flex-col justify-center space-y-3">
            <div className="text-sm font-semibold text-white">Photo Loaded Successfully</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your photo is loaded and ready. Now select a style below to generate your studio headshot with
              professional wardrobe, customized lighting, and tailored backdrops.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
              >
                Change Photo
              </button>
              <button
                type="button"
                onClick={onSelfieCleared}
                className="px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-md transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : isCameraActive ? (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-amber-400/40 rounded-xl bg-slate-950">
          {cameraError ? (
            <div className="text-center py-6">
              <p className="text-sm text-rose-400 mb-4">{cameraError}</p>
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700"
              >
                Cancel & Upload File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-slate-700 bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-2xl pointer-events-none" />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={captureCameraPhoto}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Photo</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950/40'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-amber-400">
              <Upload className="w-6 h-6 text-amber-400" />
            </div>

            <div className="text-base font-semibold text-white mb-1">
              Click to browse or drag and drop your selfie
            </div>
            <div className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              PNG, JPG, or WEBP up to 20MB. Clear front-facing selfie works best.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
                <span>Choose From Files</span>
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Video className="w-3.5 h-3.5 text-slate-300" />
                <span>Use Webcam</span>
              </button>

              <button
                type="button"
                onClick={loadSampleSelfie}
                className="px-4 py-2 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Demo With Sample Selfie</span>
              </button>
            </div>
          </div>

          {/* Quick Photography Tips */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div>
              <span className="font-semibold text-slate-300 block mb-0.5">Natural Daylight</span>
              Even light across your face avoids harsh dark shadows.
            </div>
            <div>
              <span className="font-semibold text-slate-300 block mb-0.5">Neutral Face Angle</span>
              Look straight into the lens at eye level with relaxed shoulders.
            </div>
            <div>
              <span className="font-semibold text-slate-300 block mb-0.5">No Heavy Accessories</span>
              Remove sunglasses or hats that obscure facial structure.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
