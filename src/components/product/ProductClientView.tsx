'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  Sparkles,
  MapPin,
  Package,
  ShieldCheck,
  Store,
  Clock,
  ArrowRight,
  ShoppingBag,
  Zap,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Scale,
  Award,
  Droplets,
  Layers,
  FileText,
  Sliders,
  Flame,
} from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, formatWeight, getRoastLevelInfo } from '@/lib/utils';
import { useCart } from '../inquiry/InquiryContext';
import { ProductCard } from '../catalog/ProductCard';
import type { StoreLocation } from '@/types';
import { mockStores } from '@/lib/mock-data/stores';

interface ProductClientViewProps {
  product: Product;
  relatedProducts: Product[];
  store?: StoreLocation;
}

export function ProductClientView({
  product,
  relatedProducts,
  store: storeProp,
}: ProductClientViewProps) {
  const validImages = React.useMemo(() => {
    return Array.isArray(product.images)
      ? product.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
      : [];
  }, [product.images]);

  const [selectedImage, setSelectedImage] = useState<string>(validImages[0] || '');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedGrind, setSelectedGrind] = useState('В зёрнах (не молоть)');
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<'passport' | 'sensory' | 'recipe' | 'delivery'>('passport');

  const { addToCart } = useCart();

  React.useEffect(() => {
    if (validImages.length > 0) {
      setSelectedImage(validImages[0]);
      setLightboxIndex(0);
    } else {
      setSelectedImage('');
      setLightboxIndex(0);
    }
  }, [product.id, validImages]);

  // Lock body scroll when lightbox is open
  React.useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  // Keyboard navigation for Lightbox
  React.useEffect(() => {
    if (!isLightboxOpen || validImages.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % validImages.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, validImages.length]);

  const openLightbox = (index: number = 0) => {
    if (validImages.length === 0) return;
    const safeIdx = index >= 0 && index < validImages.length ? index : 0;
    setLightboxIndex(safeIdx);
    setIsLightboxOpen(true);
  };

  const isBeanOrBlend =
    product.category === 'single-origin' ||
    product.category === 'espresso-blends' ||
    product.category === 'coffee';

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const grind = isBeanOrBlend ? selectedGrind : undefined;
    addToCart(product, quantity, grind, false, e?.currentTarget);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const store = storeProp ?? mockStores[0];

  const currentMainImage = selectedImage || validImages[0] || '';

  return (
    <div className="w-full text-white">
      {/* Lightbox / Fullscreen Image Zoom Modal */}
      <AnimatePresence>
        {isLightboxOpen && validImages.length > 0 && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20 cursor-pointer"
              aria-label="Закрыть полноэкранный просмотр"
            >
              <X className="h-6 w-6" />
            </button>

            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20 cursor-pointer"
                  aria-label="Предыдущее фото"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) => (prev + 1) % validImages.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20 cursor-pointer"
                  aria-label="Следующее фото"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="relative w-full max-w-4xl h-[70vh] sm:h-[80vh] flex items-center justify-center">
              <Image
                src={validImages[lightboxIndex] || currentMainImage}
                alt={`${product.title} - полноэкранное фото`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. Breadcrumbs Navigation */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#8E8276] mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-white transition-colors">
          Главная
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-white transition-colors">
          Каталог
        </Link>
        {product.categoryName && (
          <>
            <span>/</span>
            <Link
              href={`/catalog?category=${product.category}`}
              className="hover:text-white transition-colors"
            >
              {product.categoryName}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-[#C4B9AD] truncate max-w-[200px] sm:max-w-none">
          {product.title}
        </span>
      </nav>

      {/* 2. Top Header with Title and Badges */}
      <div className="space-y-2 mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {product.brandName && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[11px] sm:text-xs font-semibold text-[#D9A76A] border border-white/10">
              {product.brandName}
            </span>
          )}
          {product.coffeeSpecs?.qScore && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#D9A76A]/20 text-[#E5CBA8] text-[11px] sm:text-xs font-mono font-bold border border-[#D9A76A]/40">
              ★ Q-Score {product.coffeeSpecs.qScore}
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] sm:text-xs font-bold border border-amber-500/30">
              Новинка
            </span>
          )}
          {product.countryName && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[#C4B9AD] text-[11px] sm:text-xs border border-white/10">
              {product.countryName}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-white tracking-tight leading-tight">
          {product.title}
        </h1>
      </div>

      {/* 3. Main 2-Column Hero: Gallery Left + Buy Box Right */}
      <div className="grid grid-cols-1 sm:grid-cols-12 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 items-start">
        
        {/* LEFT COLUMN (sm:col-span-5): Clean Gallery + Origin Stamp Card (No Empty Space) */}
        <div className="sm:col-span-5 space-y-3 sm:space-y-3.5">
          <div
            onClick={() => openLightbox(validImages.indexOf(currentMainImage))}
            className={`relative aspect-square w-full rounded-3xl overflow-hidden bg-[#140E0B] border border-white/15 shadow-2xl group max-w-sm sm:max-w-none mx-auto ${
              validImages.length > 0 ? 'cursor-zoom-in' : ''
            }`}
          >
            {currentMainImage ? (
              <Image
                src={currentMainImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 45vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1C1410] to-[#0E0A08] text-[#8E8276] p-6 text-center select-none">
                <div className="w-20 h-20 rounded-3xl bg-[#D9A76A]/10 border border-[#D9A76A]/20 flex items-center justify-center mb-3 text-[#D9A76A] shadow-inner">
                  <Coffee className="w-10 h-10" />
                </div>
                <span className="text-sm font-semibold text-white font-serif">{product.title}</span>
                <span className="text-xs text-[#A89D91] mt-1">Specialty Coffee • ТАВ</span>
              </div>
            )}
            
            {/* Top Brand Tag */}
            <div className="absolute top-3.5 left-3.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-[#D9A76A]/40 text-xs font-mono font-bold text-[#D9A76A]">
              {product.brandName || 'ТАВ'}
            </div>
          </div>

          {/* Thumbnails */}
          {validImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-center sm:justify-start">
              {validImages.map((img, idx) => {
                const isSelected = currentMainImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img);
                      setLightboxIndex(idx);
                    }}
                    className={`relative h-16 w-16 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      isSelected
                        ? 'border-[#D9A76A] shadow-md shadow-[#D9A76A]/20 scale-105'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Mini Origin Stamp & Lot Specification under photo (Eliminates empty void on tablet & desktop) */}
          {product.coffeeSpecs ? (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#140E0B] border border-white/10 space-y-2.5 shadow-lg text-xs">
              <div className="flex items-center justify-between text-[#8E8276] border-b border-white/5 pb-2">
                <span className="font-mono uppercase tracking-wider text-[10px] text-[#D9A76A] font-bold flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Спецификация лота</span>
                </span>
                {product.coffeeSpecs.qScore && (
                  <span className="text-[11px] font-mono font-bold text-[#E5CBA8]">
                    Q-Grade {product.coffeeSpecs.qScore}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {product.countryName && (
                  <div>
                    <span className="text-[#8E8276] block text-[10px]">Регион:</span>
                    <strong className="text-white font-medium truncate block">{product.countryName}</strong>
                  </div>
                )}
                {product.coffeeSpecs.variety && (
                  <div>
                    <span className="text-[#8E8276] block text-[10px]">Разновидность:</span>
                    <strong className="text-white font-medium truncate block">{product.coffeeSpecs.variety}</strong>
                  </div>
                )}
                {product.coffeeSpecs.altitude && (
                  <div>
                    <span className="text-[#8E8276] block text-[10px]">Высота:</span>
                    <strong className="text-white font-medium truncate block">{product.coffeeSpecs.altitude}</strong>
                  </div>
                )}
                {product.coffeeSpecs.processing && (
                  <div>
                    <span className="text-[#8E8276] block text-[10px]">Обработка:</span>
                    <strong className="text-white font-medium truncate block">{product.coffeeSpecs.processing.split(' ')[0]}</strong>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#8E8276]">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="h-3 w-3" /> 100% Specialty Arabica
                </span>
                <span>Ростер ТАВ</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#140E0B] border border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#D9A76A] font-bold text-xs">
                <Award className="h-4 w-4" />
                <span>Оригинальное качество ТАВ</span>
              </div>
              <p className="text-[#C4B9AD] text-[11px]">
                {product.brandName ? `Авторизованная поставка бренда ${product.brandName}.` : 'Фирменная гарантия и контроль качества.'}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (sm:col-span-7): Order & Purchase Box */}
        <div className="sm:col-span-7 space-y-3.5 sm:space-y-4">
          
          {/* Price & In-stock */}
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10">
            <div className="text-3xl sm:text-4xl font-black text-white font-serif">
              {formatPrice(product.price)}
            </div>

            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                В наличии в ТАВ
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-[#8E8276] border border-white/10">
                Под заказ
              </span>
            )}
          </div>

          {/* Sensory Taste Highlights & Quick Specs */}
          {product.coffeeSpecs && (
            <div className="space-y-2.5">
              {/* Flavor Pills */}
              {product.coffeeSpecs.flavorNotes && product.coffeeSpecs.flavorNotes.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[#8E8276] text-[11px] font-mono uppercase mr-1">
                    Вкус:
                  </span>
                  {product.coffeeSpecs.flavorNotes.map((note, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-[#D9A76A]/15 text-[#E5CBA8] font-semibold text-xs border border-[#D9A76A]/30"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              )}

              {/* Sensory Mini Bars */}
              {(product.coffeeSpecs.acidity !== undefined ||
                product.coffeeSpecs.sweetness !== undefined) && (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {product.coffeeSpecs.acidity !== undefined && (
                    <div className="space-y-1 bg-white/[0.03] p-2.5 rounded-xl border border-white/10 text-xs">
                      <div className="flex justify-between text-[11px] text-[#C4B9AD]">
                        <span>Кислотность</span>
                        <span className="text-[#D9A76A] font-bold font-mono">
                          {product.coffeeSpecs.acidity}/5
                        </span>
                      </div>
                      <div className="flex gap-1 h-1.5 pt-0.5">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div
                            key={lvl}
                            className={`flex-1 rounded-full ${
                              lvl <= (product.coffeeSpecs?.acidity || 0)
                                ? 'bg-[#D9A76A]'
                                : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {product.coffeeSpecs.sweetness !== undefined && (
                    <div className="space-y-1 bg-white/[0.03] p-2.5 rounded-xl border border-white/10 text-xs">
                      <div className="flex justify-between text-[11px] text-[#C4B9AD]">
                        <span>Сладость</span>
                        <span className="text-[#D9A76A] font-bold font-mono">
                          {product.coffeeSpecs.sweetness}/5
                        </span>
                      </div>
                      <div className="flex gap-1 h-1.5 pt-0.5">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div
                            key={lvl}
                            className={`flex-1 rounded-full ${
                              lvl <= (product.coffeeSpecs?.sweetness || 0)
                                ? 'bg-[#D9A76A]'
                                : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Specs Chips */}
              <div className="flex flex-wrap gap-1.5 text-xs text-[#C4B9AD] pt-0.5">
                {product.coffeeSpecs.roastLevel && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/10">
                    <span className="text-[#8E8276]">Обжарка:</span>{' '}
                    <strong className="text-white">
                      {product.coffeeSpecs.roastLevel === 'light'
                        ? 'Светлая'
                        : product.coffeeSpecs.roastLevel === 'medium'
                        ? 'Средняя'
                        : 'Тёмная'}
                    </strong>
                  </span>
                )}
                {product.coffeeSpecs.processing && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/10">
                    <span className="text-[#8E8276]">Обработка:</span>{' '}
                    <strong className="text-white">{product.coffeeSpecs.processing.split(' ')[0]}</strong>
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/10">
                  <span className="text-[#8E8276]">Фасовка:</span>{' '}
                  <strong className="text-white">
                    {product.coffeeSpecs.count
                      ? `${product.coffeeSpecs.count} шт`
                      : product.coffeeSpecs.weight
                      ? `${product.coffeeSpecs.weight} г`
                      : '250 г'}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {/* Grind Selector (Segmented Chips) */}
          {isBeanOrBlend && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#E5CBA8] uppercase tracking-wider flex items-center gap-1.5 text-xs">
                  <Coffee className="h-3.5 w-3.5 text-[#D9A76A]" />
                  <span>Выбор помола:</span>
                </span>
                <span className="text-[10px] text-[#D9A76A] font-bold bg-[#D9A76A]/10 px-2 py-0.5 rounded-full border border-[#D9A76A]/20">
                  Бесплатно 0 ₽
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                {[
                  'В зёрнах (не молоть)',
                  'Для турки (джезвы)',
                  'Для эспрессо',
                  'Для гейзера (Moka)',
                  'Для фильтра / V60',
                  'Для френч-пресса',
                ].map((grind) => {
                  const isSelected = selectedGrind === grind;
                  return (
                    <button
                      key={grind}
                      type="button"
                      onClick={() => setSelectedGrind(grind)}
                      className={`h-10 sm:h-11 px-2.5 sm:px-3 rounded-xl text-left text-[11px] font-semibold border transition-all cursor-pointer flex items-center justify-between gap-1 active:scale-95 ${
                        isSelected
                          ? 'bg-[#D9A76A] text-[#0E0A08] border-[#D9A76A] font-bold shadow-md'
                          : 'bg-white/[0.04] text-[#C4B9AD] border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="whitespace-nowrap truncate">{grind}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 flex-shrink-0 text-[#0E0A08]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Row: Stepper + Add to Cart Button */}
          <div className="flex items-center gap-2 sm:gap-3 pt-2">
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#140E0A] border border-white/15 flex-shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Уменьшить количество"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="font-mono text-base font-bold text-white px-2.5 min-w-[32px] text-center">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Увеличить количество"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-between rounded-2xl p-3.5 sm:p-4 text-sm sm:text-base font-bold bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:from-[#B8854F] hover:to-[#D9A76A] text-[#0E0A08] shadow-xl shadow-amber-950/60 transition-all duration-300 cursor-pointer active:scale-95 group"
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                <ShoppingBag className="h-5 w-5 flex-shrink-0" />
                <span>{addedFeedback ? 'В корзине ✓' : 'В корзину'}</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-sm">
                <span>{formatPrice(product.price * quantity)}</span>
                <div className="h-7 w-7 rounded-xl bg-black/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-4 w-4 text-[#0E0A08]" />
                </div>
              </div>
            </button>
          </div>

          {/* Delivery & Pickup Info Strip */}
          <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-[#A69C91]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-[#D9A76A] flex-shrink-0" />
                <span>
                  Самовывоз в Майкопе: <strong className="text-white">{store.address}</strong>
                </span>
              </div>
              <span className="text-emerald-400 font-bold text-[11px] bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Готов за 15 мин
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#8E8276] pt-1">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#D9A76A]" /> Свежая обжарка
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> 100% Specialty
              </span>
              <span className="flex items-center gap-1">
                <Droplets className="h-3 w-3 text-amber-400" /> Помол Mahlkönig 0 ₽
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Interactive Tabs Section (Clean Full-Width Symmetrical Architecture) */}
      <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-white/10 space-y-6">
        
        {/* Sleek Segmented Pill Tabs Control */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-[#140E0B] rounded-2xl border border-white/10 max-w-3xl">
          <button
            type="button"
            onClick={() => setActiveTab('passport')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'passport'
                ? 'bg-[#D9A76A] text-[#0E0A08] shadow-md font-bold'
                : 'text-[#8E8276] hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">Паспорт лота</span>
          </button>

          {product.coffeeSpecs ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('sensory')}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'sensory'
                    ? 'bg-[#D9A76A] text-[#0E0A08] shadow-md font-bold'
                    : 'text-[#8E8276] hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">Вкус (SCA)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('recipe')}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'recipe'
                    ? 'bg-[#D9A76A] text-[#0E0A08] shadow-md font-bold'
                    : 'text-[#8E8276] hover:text-white hover:bg-white/5'
                }`}
              >
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">Рецепт</span>
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={() => setActiveTab('delivery')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'delivery'
                ? 'bg-[#D9A76A] text-[#0E0A08] shadow-md font-bold'
                : 'text-[#8E8276] hover:text-white hover:bg-white/5'
            }`}
          >
            <Store className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">Самовывоз</span>
          </button>
        </div>

        {/* Tab 1: Passport & Description */}
        {activeTab === 'passport' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="max-w-4xl space-y-2">
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                О сорте и терруаре
              </h3>
              <p className="text-sm sm:text-base text-[#C4B9AD] leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.coffeeSpecs ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 text-xs">
                {product.countryName && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-1">
                    <span className="text-[#8E8276] block text-[11px]">Страна и регион</span>
                    <strong className="text-white text-sm sm:text-base block">{product.countryName}</strong>
                  </div>
                )}
                {product.coffeeSpecs.variety && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-1">
                    <span className="text-[#8E8276] block text-[11px]">Разновидность арабики</span>
                    <strong className="text-white text-sm sm:text-base block">{product.coffeeSpecs.variety}</strong>
                  </div>
                )}
                {product.coffeeSpecs.processing && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-1">
                    <span className="text-[#8E8276] block text-[11px]">Метод обработки</span>
                    <strong className="text-white text-sm sm:text-base block">{product.coffeeSpecs.processing}</strong>
                  </div>
                )}
                {product.coffeeSpecs.altitude && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-1">
                    <span className="text-[#8E8276] block text-[11px]">Высота произрастания</span>
                    <strong className="text-white text-sm sm:text-base block">{product.coffeeSpecs.altitude}</strong>
                  </div>
                )}
                {product.coffeeSpecs.roastLevel && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-1">
                    <span className="text-[#8E8276] block text-[11px]">Профиль обжарки</span>
                    <strong className="text-[#E5CBA8] text-sm sm:text-base block">
                      {product.coffeeSpecs.roastLevel === 'light'
                        ? 'Светлая (фильтр / воронка)'
                        : product.coffeeSpecs.roastLevel === 'medium'
                        ? 'Средняя (универсальная)'
                        : 'Тёмная (эспрессо)'}
                    </strong>
                  </div>
                )}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-1">
                  <span className="text-[#8E8276] block text-[11px]">Упаковка и фасовка</span>
                  <strong className="text-white text-sm sm:text-base block">
                    {product.coffeeSpecs.count
                      ? `${product.coffeeSpecs.count} шт (дрип-пакеты)`
                      : product.coffeeSpecs.weight
                      ? `${product.coffeeSpecs.weight} г с zip-lock и клапаном`
                      : '250 г'}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-1">
                  <span className="text-[#8E8276] block text-[11px]">Бренд</span>
                  <strong className="text-white text-sm sm:text-base block">{product.brandName || 'ТАВ'}</strong>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-1">
                  <span className="text-[#8E8276] block text-[11px]">Страна</span>
                  <strong className="text-white text-sm sm:text-base block">{product.countryName || 'Япония / Германия'}</strong>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-1">
                  <span className="text-[#8E8276] block text-[11px]">Гарантия</span>
                  <strong className="text-white text-sm sm:text-base block">100% Оригинальный товар</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Sensory Profile */}
        {activeTab === 'sensory' && product.coffeeSpecs && (
          <div className="space-y-6 animate-fadeIn">
            {/* Flavor Cloud */}
            {product.coffeeSpecs.flavorNotes && (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#140E0B] border border-white/10 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8E8276] block">
                  Доминирующие дескрипторы вкусового колеса (SCA):
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.coffeeSpecs.flavorNotes.map((note, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-xl bg-[#D9A76A]/15 text-[#E5CBA8] font-bold text-sm border border-[#D9A76A]/30"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sensory Scale Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
              {product.coffeeSpecs.acidity !== undefined && (
                <div className="p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs text-[#C4B9AD]">
                    <span className="font-bold">Кислотность (Acidity)</span>
                    <span className="text-[#D9A76A] font-bold font-mono text-sm">
                      {product.coffeeSpecs.acidity}/5
                    </span>
                  </div>
                  <div className="flex gap-1.5 h-2 pt-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`flex-1 rounded-full ${
                          lvl <= (product.coffeeSpecs?.acidity || 0)
                            ? 'bg-[#D9A76A]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.coffeeSpecs.body !== undefined && (
                <div className="p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs text-[#C4B9AD]">
                    <span className="font-bold">Тело и плотность (Body)</span>
                    <span className="text-[#D9A76A] font-bold font-mono text-sm">
                      {product.coffeeSpecs.body}/5
                    </span>
                  </div>
                  <div className="flex gap-1.5 h-2 pt-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`flex-1 rounded-full ${
                          lvl <= (product.coffeeSpecs?.body || 0)
                            ? 'bg-[#D9A76A]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.coffeeSpecs.sweetness !== undefined && (
                <div className="p-5 rounded-2xl bg-[#140E0B] border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs text-[#C4B9AD]">
                    <span className="font-bold">Сладость (Sweetness)</span>
                    <span className="text-[#D9A76A] font-bold font-mono text-sm">
                      {product.coffeeSpecs.sweetness}/5
                    </span>
                  </div>
                  <div className="flex gap-1.5 h-2 pt-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`flex-1 rounded-full ${
                          lvl <= (product.coffeeSpecs?.sweetness || 0)
                            ? 'bg-[#D9A76A]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Barista Recipe (Balanced 2-Column Desktop Grid) */}
        {activeTab === 'recipe' && product.coffeeSpecs && (
          <div className="p-5 sm:p-6 lg:p-7 rounded-3xl bg-[#140E0B] border border-white/10 space-y-6 animate-fadeIn">
            {(() => {
              const r = product.coffeeSpecs.recipe;
              const title = r?.title || 'Идеальное приготовление в V60 / Фильтре';
              const subtitle = r?.subtitle || 'Рецепт экстракции от шеф-бариста ТАВ';
              const badge = r?.badge || r?.ratio || '15 г : 250 мл';
              const ratio = r?.ratio || '15 г : 250 мл';
              const ratioDesc = r?.ratioDesc || '1 : 16.6';
              const temp = r?.temp || '92°C – 94°C';
              const tempDesc = r?.tempDesc || 'горячая вода';
              const grind = r?.grind || 'Средний песок';
              const grindDesc = r?.grindDesc || 'под V60';
              const time = r?.time || '2:30 – 3:00';
              const timeDesc = r?.timeDesc || 'общее время';

              const defaultSteps = [
                'Блуминг (предсмачивание): Влейте 45 мл воды и подождите 40 секунд для равномерной дегазации зерна.',
                'Первый пролив: Плавно долейте воду до 150 мл медленными концентрическими кругами от центра к краям.',
                'Второй пролив: Долейте до 250 мл строго по центру. Дайте воде полностью стечь в сервер.',
              ];

              const steps =
                Array.isArray(r?.steps) && r.steps.length > 0 ? r.steps : defaultSteps;

              return (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                        {subtitle}
                      </span>
                      <h4 className="text-lg sm:text-xl font-serif font-bold text-white">
                        {title}
                      </h4>
                    </div>
                    {badge && (
                      <span className="px-3 py-1 rounded-full bg-[#D9A76A]/10 text-[#E5CBA8] border border-[#D9A76A]/20 text-xs font-mono font-bold self-start sm:self-auto">
                        {badge}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                    {/* 4 Metric Cards */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                        <span className="text-[#8E8276] block text-[11px]">Пропорция</span>
                        <strong className="text-white font-mono text-sm block">{ratio}</strong>
                        {ratioDesc && (
                          <span className="text-[10px] text-[#8E8276]">{ratioDesc}</span>
                        )}
                      </div>
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                        <span className="text-[#8E8276] block text-[11px]">Температура</span>
                        <strong className="text-white font-mono text-sm block">{temp}</strong>
                        {tempDesc && (
                          <span className="text-[10px] text-[#8E8276]">{tempDesc}</span>
                        )}
                      </div>
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                        <span className="text-[#8E8276] block text-[11px]">Помол</span>
                        <strong className="text-white font-mono text-sm block">{grind}</strong>
                        {grindDesc && (
                          <span className="text-[10px] text-[#8E8276]">{grindDesc}</span>
                        )}
                      </div>
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                        <span className="text-[#8E8276] block text-[11px]">Время пролива</span>
                        <strong className="text-white font-mono text-sm block">{time}</strong>
                        {timeDesc && (
                          <span className="text-[10px] text-[#8E8276]">{timeDesc}</span>
                        )}
                      </div>
                    </div>

                    {/* Step-by-step extraction guide */}
                    <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-xs text-[#C4B9AD]">
                      <strong className="text-[#E5CBA8] block text-xs uppercase tracking-wider font-bold">
                        Пошаговое руководство экстракции:
                      </strong>
                      <div className="space-y-2.5 text-xs leading-relaxed">
                        {steps.map((stepItem, idx) => {
                          const stepText =
                            typeof stepItem === 'string'
                              ? stepItem
                              : stepItem.title
                              ? `${stepItem.title}: ${stepItem.text}`
                              : stepItem.text;

                          const colonIndex = stepText.indexOf(':');
                          const hasColon = colonIndex > 0 && colonIndex < 40;

                          return (
                            <div key={idx} className="flex items-start gap-2.5">
                              <span className="h-5 w-5 rounded-full bg-[#D9A76A]/20 text-[#E5CBA8] font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              {hasColon ? (
                                <p>
                                  <strong>{stepText.slice(0, colonIndex)}</strong>:
                                  {stepText.slice(colonIndex + 1)}
                                </p>
                              ) : (
                                <p>{stepText}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Tab 4: Pickup & Payment (Full Width Balanced Grid) */}
        {activeTab === 'delivery' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 text-xs animate-fadeIn">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#140E0B] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                  <Store className="h-5 w-5 text-[#D9A76A]" />
                  <span>Пространство ТАВ в Майкопе</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  15 мин
                </span>
              </div>
              
              <div className="space-y-1.5 text-xs sm:text-sm text-[#C4B9AD]">
                <div>Адрес: <strong className="text-white">{store.address}</strong></div>
                <div className="text-[#8E8276] text-xs">График работы: {store.workingHours}</div>
              </div>

              <div className="pt-2.5 border-t border-white/5 flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <Check className="h-4 w-4 flex-shrink-0" />
                <span>Бесплатный самовывоз • Свежий помол перед выдачей</span>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-[#140E0B] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base border-b border-white/10 pb-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span>Оплата и гарантия</span>
              </div>
              
              <p className="text-xs sm:text-sm text-[#C4B9AD] leading-relaxed">
                Оплата онлайн картой на сайте при оформлении заказа или картой / наличными при получении в пространстве ТАВ.
              </p>

              <div className="pt-2.5 border-t border-white/5 text-[#8E8276] text-xs">
                Кассовый чек и контроль свежести в каждом заказе.
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 5. Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 sm:mt-24 pt-12 border-t border-white/10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D9A76A]">
                Вам может понравиться
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Другие сорта и дрип-кофе ТАВ
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-bold text-[#D9A76A] hover:text-white flex items-center gap-1"
            >
              <span>Весь каталог</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
