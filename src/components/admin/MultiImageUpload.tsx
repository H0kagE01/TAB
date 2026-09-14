'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Loader2,
  Link as LinkIcon,
  Sparkles,
  Check,
} from 'lucide-react';
import { convertImageToWebP, formatBytes } from '@/lib/image-optimizer';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function MultiImageUpload({
  images,
  onChange,
  maxImages = 12,
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lastStats, setLastStats] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      setError('Пожалуйста, выберите файлы изображений (JPG, PNG, WEBP и др.)');
      return;
    }

    if (images.length + fileArray.length > maxImages) {
      setError(`Максимальное количество изображений — ${maxImages}`);
      return;
    }

    setError(null);
    setIsProcessing(true);
    setLastStats(null);

    try {
      const uploadedUrls: string[] = [];
      let totalOrig = 0;
      let totalNew = 0;

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setProgressText(`Оптимизация ${i + 1} из ${fileArray.length} в WebP...`);

        // Convert to WebP on client
        const optimized = await convertImageToWebP(file, {
          maxWidth: 2048,
          maxHeight: 2048,
          quality: 0.85,
        });

        totalOrig += optimized.originalSize;
        totalNew += optimized.newSize;

        // Upload to server
        setProgressText(`Загрузка ${i + 1} из ${fileArray.length}...`);
        const formData = new FormData();
        formData.append('file', optimized.file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Ошибка загрузки файла ${file.name}`);
        }

        const data = await res.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        const newImages = [...images, ...uploadedUrls];
        onChange(newImages);

        const savedPercent =
          totalOrig > 0 ? Math.round(((totalOrig - totalNew) / totalOrig) * 100) : 0;
        setLastStats(
          `Загружено ${uploadedUrls.length} фото в WebP: ${formatBytes(totalOrig)} ➔ ${formatBytes(totalNew)} (сжато на ${savedPercent}%)`
        );
      }
    } catch (err: any) {
      console.error('Batch upload error:', err);
      setError(err?.message || 'Ошибка обработки файлов');
    } finally {
      setIsProcessing(false);
      setProgressText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
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

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;

    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    onChange(copy);
  };

  const setPrimary = (index: number) => {
    if (index === 0) return;
    const copy = [...images];
    const item = copy.splice(index, 1)[0];
    copy.unshift(item);
    onChange(copy);
  };

  const handleAddManualUrl = () => {
    if (manualUrl.trim()) {
      if (images.length >= maxImages) {
        setError(`Максимальное количество изображений — ${maxImages}`);
        return;
      }
      onChange([...images, manualUrl.trim()]);
      setManualUrl('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-[#D9A76A]" />
          <span className="text-sm font-bold text-white">
            Галерея товара ({images.length} / {maxImages})
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs font-mono text-[#D9A76A] hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <LinkIcon className="h-3 w-3" />
          <span>{showUrlInput ? 'Скрыть ввод ссылки' : 'Добавить по URL ссылке'}</span>
        </button>
      </div>

      {/* Manual URL Input Field */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1C1410] border border-white/10">
          <input
            type="text"
            placeholder="Вставьте прямую ссылку на фото (https://...)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-stone-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3.5 py-1.5 rounded-lg bg-[#D9A76A] hover:bg-[#E5CBA8] text-[#0E0A08] text-xs font-bold transition-colors cursor-pointer"
          >
            Добавить
          </button>
        </div>
      )}

      {/* Hidden File Input for Multiple Files */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
          }
        }}
        className="hidden"
      />

      {/* Drag & Drop Upload Stage */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-all p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
          isDragging
            ? 'border-[#D9A76A] bg-[#D9A76A]/10 scale-[0.99]'
            : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/30'
        }`}
      >
        {isProcessing ? (
          <div className="space-y-2 flex flex-col items-center py-2">
            <Loader2 className="h-8 w-8 text-[#D9A76A] animate-spin" />
            <p className="text-xs font-bold text-white">{progressText}</p>
            <p className="text-[11px] text-[#8E8276]">Конвертируем в формат WebP и загружаем...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-[#D9A76A]/10 border border-[#D9A76A]/20 flex items-center justify-center text-[#D9A76A]">
              <UploadCloud className="h-6 w-6" />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">
                Нажмите для выбора фото или перетащите несколько файлов сюда
              </p>
              <p className="text-[11px] text-[#8E8276]">
                Поддерживаются JPG, PNG, WEBP, HEIC • Автоматическое сжатие в WebP
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono text-[#D9A76A]">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Автоматически формирует легкие WebP фото для быстрого сайта</span>
            </div>
          </>
        )}
      </div>

      {/* Stats Notification */}
      {lastStats && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{lastStats}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-500/20 p-2.5 rounded-xl">
          {error}
        </p>
      )}

      {/* Uploaded Gallery Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-mono uppercase text-[#8E8276] tracking-wider">
            Фотографии товара (первое фото является главным):
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => {
              const isPrimary = idx === 0;

              return (
                <div
                  key={idx}
                  className={`group relative rounded-2xl overflow-hidden bg-[#1A120D] border aspect-square transition-all ${
                    isPrimary
                      ? 'border-[#D9A76A] shadow-lg shadow-[#D9A76A]/10 ring-1 ring-[#D9A76A]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Фото ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Primary Badge */}
                  {isPrimary && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#D9A76A] text-[#0E0A08] text-[10px] font-bold font-mono shadow-md flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      <span>Главное</span>
                    </div>
                  )}

                  {/* Format tag */}
                  {img.endsWith('.webp') && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-emerald-400 text-[9px] font-mono border border-emerald-500/30 backdrop-blur-md">
                      WebP
                    </div>
                  )}

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 backdrop-blur-xs">
                    {/* Top Row: Make Primary & Index */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/70">
                        #{idx + 1}
                      </span>
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimary(idx)}
                          className="px-2 py-1 rounded bg-[#D9A76A] text-[#0E0A08] text-[10px] font-bold flex items-center gap-1 hover:bg-[#E5CBA8] transition-colors cursor-pointer"
                          title="Сделать главным фото"
                        >
                          <Star className="h-2.5 w-2.5" />
                          <span>Главное</span>
                        </button>
                      )}
                    </div>

                    {/* Bottom Row: Reorder & Delete */}
                    <div className="flex items-center justify-between gap-1 pt-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveImage(idx, 'left')}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                          title="Переместить влево"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === images.length - 1}
                          onClick={() => moveImage(idx, 'right')}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                          title="Переместить вправо"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                        title="Удалить фото"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add More Tile */}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#D9A76A]/50 aspect-square flex flex-col items-center justify-center gap-1 text-[#8E8276] hover:text-[#D9A76A] transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#D9A76A]/20 flex items-center justify-center transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-semibold">Добавить еще</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
