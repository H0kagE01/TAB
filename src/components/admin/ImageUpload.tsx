'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Link as LinkIcon,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { convertImageToWebP, formatBytes } from '@/lib/image-optimizer';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  compact?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Изображение',
  description,
  placeholder = 'https://... или /images/...',
  aspectRatio = 'auto',
  compact = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: number;
    newSize: number;
    savedPercent: number;
  } | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync manual URL when value changes
  React.useEffect(() => {
    setManualUrl(value);
  }, [value]);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите файл изображения (JPG, PNG, WEBP и др.)');
      return;
    }

    setError(null);
    setIsOptimizing(true);
    setCompressionInfo(null);

    try {
      // 1. Client-side conversion to high-quality WebP
      const optimized = await convertImageToWebP(file, {
        maxWidth: 2048,
        maxHeight: 2048,
        quality: 0.85,
      });

      setCompressionInfo({
        originalSize: optimized.originalSize,
        newSize: optimized.newSize,
        savedPercent: optimized.savedPercent,
      });

      setIsOptimizing(false);
      setIsUploading(true);

      // 2. Upload WebP file to server
      const formData = new FormData();
      formData.append('file', optimized.file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Ошибка загрузки файла на сервер');
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err?.message || 'Ошибка обработки или загрузки изображения');
    } finally {
      setIsOptimizing(false);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleManualApply = () => {
    onChange(manualUrl.trim());
    setShowUrlInput(false);
  };

  const handleRemove = () => {
    onChange('');
    setCompressionInfo(null);
    setError(null);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-video';
      case 'wide':
        return 'aspect-[21/9]';
      default:
        return 'h-40 sm:h-48';
    }
  };

  const isBusy = isOptimizing || isUploading;

  return (
    <div className="space-y-2">
      {/* Header with Label and Actions */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD] flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-[#D9A76A]" />
          <span>{label}</span>
        </label>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-mono text-[#D9A76A] hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="h-3 w-3" />
          <span>{showUrlInput ? 'Скрыть URL' : 'Указать ссылку'}</span>
        </button>
      </div>

      {description && <p className="text-[11px] text-[#8E8276]">{description}</p>}

      {/* Manual URL Input Toggle */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1C1410] border border-white/10">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-xs text-white placeholder-stone-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleManualApply}
            className="px-3 py-1.5 rounded-lg bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] text-xs font-bold transition-colors cursor-pointer"
          >
            Применить
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Main Upload / Preview Area */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden bg-[#1A120D] border border-white/15 group">
          {/* Image Display */}
          <div className={`relative w-full ${getAspectClass()} overflow-hidden`}>
            {/* Fallback support for regular img or next/image */}
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
          </div>

          {/* Hover Overlay with Quick Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Заменить фото</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isBusy}
              className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
              title="Удалить изображение"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* WebP & URL Badge at bottom */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md bg-black/75 text-[10px] font-mono text-stone-300 backdrop-blur-md truncate max-w-[200px] sm:max-w-xs border border-white/10">
              {value}
            </span>
            {value.endsWith('.webp') && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 backdrop-blur-md">
                WebP
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isBusy && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
            isDragging
              ? 'border-[#D9A76A] bg-[#D9A76A]/10 scale-[0.99]'
              : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/30'
          } ${compact ? 'py-5' : 'py-8'}`}
        >
          {isBusy ? (
            <div className="space-y-2 flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-[#D9A76A] animate-spin" />
              <div className="text-xs font-semibold text-white">
                {isOptimizing ? 'Конвертация в WebP...' : 'Сохранение на сервере...'}
              </div>
              <p className="text-[11px] text-[#8E8276]">Сжимаем и оптимизируем качество</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#D9A76A]/10 border border-[#D9A76A]/20 flex items-center justify-center text-[#D9A76A] shadow-inner">
                <UploadCloud className="h-6 w-6" />
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">
                  Нажмите для выбора фото или перетащите файл сюда
                </p>
                <p className="text-[11px] text-[#8E8276]">
                  JPG, PNG, HEIC, WEBP • Автоматически конвертируется в WebP
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono text-[#D9A76A]">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Экономия до 90% размера без потери качества</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Optimization Statistics Badge */}
      {compressionInfo && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>
            Преобразовано в WebP: {formatBytes(compressionInfo.originalSize)} ➔{' '}
            <strong className="text-white">{formatBytes(compressionInfo.newSize)}</strong>{' '}
            (экономия <strong className="text-emerald-400">{compressionInfo.savedPercent}%</strong>)
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-500/20 p-2.5 rounded-xl">
          {error}
        </p>
      )}
    </div>
  );
}
