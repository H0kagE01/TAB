'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Coffee,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  Layers,
  Clock,
  Flame,
  RotateCcw,
  FileText,
  Sliders,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MultiImageUpload } from '@/components/admin/MultiImageUpload';

interface ProductFormProps {
  initialProduct?: any;
  categories: any[];
  brands: any[];
  countries: any[];
  isNew?: boolean;
}

export function ProductFormClient({
  initialProduct,
  categories,
  brands,
  countries,
  isNew = false,
}: ProductFormProps) {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState(initialProduct?.title || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || categories[0]?.id || ''
  );
  const [brandId, setBrandId] = useState(initialProduct?.brandId || '');
  const [countryId, setCountryId] = useState(initialProduct?.countryId || '');
  const [price, setPrice] = useState(initialProduct?.price ? String(initialProduct.price) : '');
  const [oldPrice, setOldPrice] = useState(
    initialProduct?.oldPrice ? String(initialProduct.oldPrice) : ''
  );
  const [inStock, setInStock] = useState(initialProduct?.inStock ?? true);
  const [stockCount, setStockCount] = useState(initialProduct?.stockCount ?? 20);
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.shortDescription || ''
  );
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [images, setImages] = useState<string[]>(
    Array.isArray(initialProduct?.images)
      ? initialProduct.images.filter((img: any) => typeof img === 'string' && img.trim().length > 0)
      : []
  );

  // Flags
  const [isNewFlag, setIsNewFlag] = useState(initialProduct?.isNew || false);
  const [isPopular, setIsPopular] = useState(initialProduct?.isPopular || false);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);

  // Coffee Specs
  const [variety, setVariety] = useState(initialProduct?.coffeeSpecs?.variety || '');
  const [roastLevel, setRoastLevel] = useState(
    initialProduct?.coffeeSpecs?.roastLevel || 'medium'
  );
  const [processing, setProcessing] = useState(
    initialProduct?.coffeeSpecs?.processing || ''
  );
  const [altitude, setAltitude] = useState(initialProduct?.coffeeSpecs?.altitude || '');
  const [qScore, setQScore] = useState(
    initialProduct?.coffeeSpecs?.qScore ? String(initialProduct.coffeeSpecs.qScore) : ''
  );
  const [flavorNotesText, setFlavorNotesText] = useState(
    Array.isArray(initialProduct?.coffeeSpecs?.flavorNotes)
      ? initialProduct.coffeeSpecs.flavorNotes.join(', ')
      : ''
  );
  const [recommendedBrewText, setRecommendedBrewText] = useState(
    Array.isArray(initialProduct?.coffeeSpecs?.recommendedBrew)
      ? initialProduct.coffeeSpecs.recommendedBrew.join(', ')
      : ''
  );
  const [acidity, setAcidity] = useState(initialProduct?.coffeeSpecs?.acidity || 3);
  const [sweetness, setSweetness] = useState(initialProduct?.coffeeSpecs?.sweetness || 3);
  const [bitterness, setBitterness] = useState(initialProduct?.coffeeSpecs?.bitterness || 3);
  const [body, setBody] = useState(initialProduct?.coffeeSpecs?.body || 3);
  const [weightGrams, setWeightGrams] = useState(
    initialProduct?.coffeeSpecs?.weightGrams || 250
  );
  const [dripCount, setDripCount] = useState(
    initialProduct?.coffeeSpecs?.dripCount || ''
  );

  // Recipe State (for Product Page "Рецепт" Tab)
  const initialRecipe = initialProduct?.coffeeSpecs?.recipe || {};
  const [recipeTitle, setRecipeTitle] = useState(
    initialRecipe.title || 'Идеальное приготовление в V60 / Фильтре'
  );
  const [recipeSubtitle, setRecipeSubtitle] = useState(
    initialRecipe.subtitle || 'Рецепт экстракции от шеф-бариста ТАВ'
  );
  const [recipeBadge, setRecipeBadge] = useState(initialRecipe.badge || '15 г : 250 мл');
  const [recipeRatio, setRecipeRatio] = useState(initialRecipe.ratio || '15 г : 250 мл');
  const [recipeRatioDesc, setRecipeRatioDesc] = useState(initialRecipe.ratioDesc || '1 : 16.6');
  const [recipeTemp, setRecipeTemp] = useState(initialRecipe.temp || '92°C – 94°C');
  const [recipeTempDesc, setRecipeTempDesc] = useState(initialRecipe.tempDesc || 'горячая вода');
  const [recipeGrind, setRecipeGrind] = useState(initialRecipe.grind || 'Средний песок');
  const [recipeGrindDesc, setRecipeGrindDesc] = useState(initialRecipe.grindDesc || 'под V60');
  const [recipeTime, setRecipeTime] = useState(initialRecipe.time || '2:30 – 3:00');
  const [recipeTimeDesc, setRecipeTimeDesc] = useState(initialRecipe.timeDesc || 'общее время');
  const [recipeSteps, setRecipeSteps] = useState<string[]>(
    Array.isArray(initialRecipe.steps) && initialRecipe.steps.length > 0
      ? initialRecipe.steps.map((s: any) => (typeof s === 'string' ? s : s?.text || ''))
      : [
          'Блуминг (предсмачивание): Влейте 45 мл воды и подождите 40 секунд для равномерной дегазации зерна.',
          'Первый пролив: Плавно долейте воду до 150 мл медленными концентрическими кругами от центра к краям.',
          'Второй пролив: Долейте до 250 мл строго по центру. Дайте воде полностью стечь в сервер.',
        ]
  );

  const applyRecipeTemplate = (type: 'v60' | 'espresso' | 'drip' | 'turka') => {
    if (type === 'v60') {
      setRecipeTitle('Идеальное приготовление в V60 / Фильтре');
      setRecipeSubtitle('Рецепт экстракции от шеф-бариста ТАВ');
      setRecipeBadge('15 г : 250 мл');
      setRecipeRatio('15 г : 250 мл');
      setRecipeRatioDesc('1 : 16.6');
      setRecipeTemp('92°C – 94°C');
      setRecipeTempDesc('горячая вода');
      setRecipeGrind('Средний песок');
      setRecipeGrindDesc('под V60');
      setRecipeTime('2:30 – 3:00');
      setRecipeTimeDesc('общее время');
      setRecipeSteps([
        'Блуминг (предсмачивание): Влейте 45 мл воды и подождите 40 секунд для равномерной дегазации зерна.',
        'Первый пролив: Плавно долейте воду до 150 мл медленными концентрическими кругами от центра к краям.',
        'Второй пролив: Долейте до 250 мл строго по центру. Дайте воде полностью стечь в сервер.',
      ]);
    } else if (type === 'espresso') {
      setRecipeTitle('Классическая экстракция двойного эспрессо');
      setRecipeSubtitle('Параметры пролива от шеф-бариста ТАВ');
      setRecipeBadge('18 г : 36 г');
      setRecipeRatio('18 г : 36 г');
      setRecipeRatioDesc('коэффициент 1 : 2');
      setRecipeTemp('93°C – 94°C');
      setRecipeTempDesc('давление 9 бар');
      setRecipeGrind('Тонкий эспрессо');
      setRecipeGrindDesc('калиброванный');
      setRecipeTime('25 – 28 сек');
      setRecipeTimeDesc('время экстракции');
      setRecipeSteps([
        'Подготовка корзины: Тщательно протрите холдер насухо и распределите 18г помола WDT-инструментом.',
        'Темперовка: Сделайте строго горизонтальную темперовку с усилием около 15 кг.',
        'Экстракция: Запустите пролив на прогретой группе и получите 36г сбалансированного напитка за 25–28 секунд.',
      ]);
    } else if (type === 'drip') {
      setRecipeTitle('Заваривание порционного дрип-пакета');
      setRecipeSubtitle('Идеальная чашка за 2 минуты в любых условиях');
      setRecipeBadge('1 саше : 180–200 мл');
      setRecipeRatio('1 шт : 190 мл');
      setRecipeRatioDesc('1 саше на чашку');
      setRecipeTemp('92°C – 95°C');
      setRecipeTempDesc('не крутой кипяток');
      setRecipeGrind('В пакете');
      setRecipeGrindDesc('саше с азотом');
      setRecipeTime('2:00 – 2:30');
      setRecipeTimeDesc('в 3 пролива');
      setRecipeSteps([
        'Открытие и фиксация: Вскройте дрип-пакет по линии перфорации и надежно закрепите ушки на чашке.',
        'Предсмачивание: Влейте около 30–40 мл горячей воды, смочив весь кофе, и подождите 30 секунд.',
        'Проливы: Пролейте оставшуюся воду в 2–3 приема до краев пакета, дайте стечь и снимите дрип.',
      ]);
    } else if (type === 'turka') {
      setRecipeTitle('Приготовление в медной джезве (турке)');
      setRecipeSubtitle('Восточный метод с бархатистой пенкой');
      setRecipeBadge('10 г : 100 мл');
      setRecipeRatio('10 г : 100 мл');
      setRecipeRatioDesc('пропорция 1 : 10');
      setRecipeTemp('Холодная вода');
      setRecipeTempDesc('мягкая фильтрованная');
      setRecipeGrind('Экстра-тонкий');
      setRecipeGrindDesc('в пыль / пудру');
      setRecipeTime('3:00 – 4:00');
      setRecipeTimeDesc('медленный нагрев');
      setRecipeSteps([
        'Закладка: Насыпьте 10г кофе мельчайшего помола в джезву и залейте 100 мл холодной чистой воды.',
        'Перемешивание: Однократно перемешайте ложкой, чтобы смочить все частицы, и поставьте на средний огонь.',
        'Поднятие пенки: При первых признаках подъема крема (около 90–92°C) снимите турку, не доводя до кипения.',
      ]);
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const updated = [...recipeSteps];
    updated[index] = value;
    setRecipeSteps(updated);
  };

  const handleAddStep = () => {
    setRecipeSteps([...recipeSteps, '']);
  };

  const handleRemoveStep = (index: number) => {
    setRecipeSteps(recipeSteps.filter((_, i) => i !== index));
  };

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Auto generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (isNew && (!slug || slug === autoSlug(title))) {
      setSlug(autoSlug(val));
    }
  };

  const autoSlug = (text: string) => {
    const cyrillicMap: Record<string, string> = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
      з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
      п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
      ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
    };
    return text
      .toLowerCase()
      .split('')
      .map((char) => cyrillicMap[char] ?? char)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };



  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !categoryId || !price) {
      showToast('error', 'Заполните обязательные поля');
      return;
    }

    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      categoryId,
      brandId: brandId || null,
      countryId: countryId || null,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      inStock,
      stockCount: Number(stockCount) || 0,
      shortDescription: shortDescription.trim() || null,
      description: description.trim(),
      images,
      isNew: isNewFlag,
      isPopular,
      isFeatured,
      coffeeSpecs: {
        variety: variety.trim() || null,
        roastLevel,
        processing: processing.trim() || null,
        altitude: altitude.trim() || null,
        qScore: qScore ? Number(qScore) : null,
        flavorNotes: flavorNotesText
          .split(',')
          .map((n: string) => n.trim())
          .filter(Boolean),
        recommendedBrew: recommendedBrewText
          .split(',')
          .map((n: string) => n.trim())
          .filter(Boolean),
        acidity: Number(acidity),
        sweetness: Number(sweetness),
        bitterness: Number(bitterness),
        body: Number(body),
        weightGrams: Number(weightGrams) || 250,
        dripCount: dripCount ? Number(dripCount) : null,
        recipe: {
          title: recipeTitle.trim(),
          subtitle: recipeSubtitle.trim(),
          badge: recipeBadge.trim(),
          ratio: recipeRatio.trim(),
          ratioDesc: recipeRatioDesc.trim(),
          temp: recipeTemp.trim(),
          tempDesc: recipeTempDesc.trim(),
          grind: recipeGrind.trim(),
          grindDesc: recipeGrindDesc.trim(),
          time: recipeTime.trim(),
          timeDesc: recipeTimeDesc.trim(),
          steps: recipeSteps.map((s) => s.trim()).filter(Boolean),
        },
      },
    };

    try {
      const url = isNew
        ? '/api/admin/products'
        : `/api/admin/products/${initialProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка сохранения');

      showToast('success', isNew ? 'Товар успешно создан!' : 'Товар успешно обновлен!');
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      showToast('error', err.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={cn(
              'px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-xl border',
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-950/90 text-rose-300 border-rose-500/30'
            )}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8E8276] hover:text-[#D9A76A] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Назад к списку товаров</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white">
            {isNew ? 'Новый товар в каталоге' : `Редактирование: ${initialProduct?.title}`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:brightness-105 active:scale-95 text-[#0E0A08] text-xs font-bold transition-all shadow-[0_0_20px_rgba(217,167,106,0.35)] cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Сохранение...' : 'Сохранить товар'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (8 cols): Main info, images, descriptions */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Basic Information */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#140E0B] border border-white/10 space-y-5 shadow-xl">
            <h2 className="text-base font-bold font-serif text-white flex items-center gap-2">
              <Coffee className="h-4 w-4 text-[#D9A76A]" />
              <span>Основная информация</span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Название товара *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Например: Эфиопия Иргачефф Гримо"
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-3 px-3.5 text-sm text-white focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                    URL-слаг (slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ethiopia-yirgacheffe"
                    className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-mono text-white focus:outline-none focus:border-[#D9A76A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                    Категория *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Краткое описание (для карточки в каталоге)
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Бергамот, жасмин, белый персик и сладкий лайм"
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Полное описание товара
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Подробный рассказ о регионе, ферме, вкусовом профиле и рекомендациях..."
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 p-3.5 text-xs text-white focus:outline-none focus:border-[#D9A76A] leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Specialty Coffee Specs */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#140E0B] border border-[#D9A76A]/20 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h2 className="text-base font-bold font-serif text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-[#D9A76A]" />
                <span>Характеристики спешелти кофе</span>
              </h2>
              <span className="text-[10px] font-mono text-[#D9A76A] bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Specialty Passport
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Сорт / Разновидность
                </label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="100% Арабика (Эфиопское наследие)"
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Степень обжарки
                </label>
                <select
                  value={roastLevel}
                  onChange={(e) => setRoastLevel(e.target.value)}
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                >
                  <option value="light">Светлая (Light) — для фильтра и V60</option>
                  <option value="medium">Средняя (Medium) — универсальная</option>
                  <option value="dark">Тёмная (Dark) — для плотного эспрессо</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Способ обработки
                </label>
                <input
                  type="text"
                  value={processing}
                  onChange={(e) => setProcessing(e.target.value)}
                  placeholder="Мытая (Washed) / Натуральная / Анаэробная"
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Высота произрастания
                </label>
                <input
                  type="text"
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  placeholder="1 900 – 2 200 м"
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#D9A76A]">
                  Оценка SCA (Q-Score)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="80"
                  max="100"
                  value={qScore}
                  onChange={(e) => setQScore(e.target.value)}
                  placeholder="87.5"
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Вес пачки (граммы)
                </label>
                <input
                  type="number"
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(Number(e.target.value))}
                  placeholder="250"
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Вкусовые дескрипторы (через запятую)
              </label>
              <input
                type="text"
                value={flavorNotesText}
                onChange={(e) => setFlavorNotesText(e.target.value)}
                placeholder="Бергамот, Жасмин, Персик, Лайм, Молочный шоколад"
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Рекомендуемые методы заваривания (через запятую)
              </label>
              <input
                type="text"
                value={recommendedBrewText}
                onChange={(e) => setRecommendedBrewText(e.target.value)}
                placeholder="V60, Кемекс, Аэропресс, Эспрессо, Турка"
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
              />
            </div>

            {/* Taste Profile Scales 1-5 */}
            <div className="space-y-3 pt-2">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                Вкусовой баланс (шкалы от 1 до 5):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-[11px] text-[#C4B9AD] font-semibold flex justify-between">
                    <span>Кислотность</span>
                    <span className="font-mono text-[#D9A76A] font-bold">{acidity}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={acidity}
                    onChange={(e) => setAcidity(Number(e.target.value))}
                    className="w-full accent-[#D9A76A]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-[11px] text-[#C4B9AD] font-semibold flex justify-between">
                    <span>Сладость</span>
                    <span className="font-mono text-[#D9A76A] font-bold">{sweetness}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sweetness}
                    onChange={(e) => setSweetness(Number(e.target.value))}
                    className="w-full accent-[#D9A76A]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-[11px] text-[#C4B9AD] font-semibold flex justify-between">
                    <span>Плотность</span>
                    <span className="font-mono text-[#D9A76A] font-bold">{body}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={body}
                    onChange={(e) => setBody(Number(e.target.value))}
                    className="w-full accent-[#D9A76A]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="text-[11px] text-[#C4B9AD] font-semibold flex justify-between">
                    <span>Горечь</span>
                    <span className="font-mono text-[#D9A76A] font-bold">{bitterness}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={bitterness}
                    onChange={(e) => setBitterness(Number(e.target.value))}
                    className="w-full accent-[#D9A76A]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Barista Recipe & Extraction Settings */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#140E0B] border border-[#D9A76A]/20 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold font-serif text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#D9A76A]" />
                  <span>Рецепт экстракции от бариста</span>
                </h2>
                <p className="text-[11px] text-[#8E8276]">
                  Отображается во вкладке «Рецепт» на странице товара
                </p>
              </div>

              {/* Quick Template Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-[#8E8276] mr-1">Шаблоны:</span>
                <button
                  type="button"
                  onClick={() => applyRecipeTemplate('v60')}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#D9A76A]/20 hover:text-[#E5CBA8] border border-white/10 text-[11px] font-semibold text-[#C4B9AD] transition-colors cursor-pointer"
                >
                  V60 / Фильтр
                </button>
                <button
                  type="button"
                  onClick={() => applyRecipeTemplate('espresso')}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#D9A76A]/20 hover:text-[#E5CBA8] border border-white/10 text-[11px] font-semibold text-[#C4B9AD] transition-colors cursor-pointer"
                >
                  Эспрессо
                </button>
                <button
                  type="button"
                  onClick={() => applyRecipeTemplate('drip')}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#D9A76A]/20 hover:text-[#E5CBA8] border border-white/10 text-[11px] font-semibold text-[#C4B9AD] transition-colors cursor-pointer"
                >
                  Дрип-пакет
                </button>
                <button
                  type="button"
                  onClick={() => applyRecipeTemplate('turka')}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#D9A76A]/20 hover:text-[#E5CBA8] border border-white/10 text-[11px] font-semibold text-[#C4B9AD] transition-colors cursor-pointer"
                >
                  Турка
                </button>
              </div>
            </div>

            {/* Header fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Заголовок рецепта
                </label>
                <input
                  type="text"
                  value={recipeTitle}
                  onChange={(e) => setRecipeTitle(e.target.value)}
                  placeholder="Идеальное приготовление в V60 / Фильтре"
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Бейдж дозировки
                </label>
                <input
                  type="text"
                  value={recipeBadge}
                  onChange={(e) => setRecipeBadge(e.target.value)}
                  placeholder="15 г : 250 мл"
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-mono text-white focus:outline-none focus:border-[#D9A76A]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Подзаголовок / Источник
              </label>
              <input
                type="text"
                value={recipeSubtitle}
                onChange={(e) => setRecipeSubtitle(e.target.value)}
                placeholder="Рецепт экстракции от шеф-бариста ТАВ"
                className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
              />
            </div>

            {/* 4 Cards Grid: Ratio, Temp, Grind, Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Ratio */}
              <div className="p-3.5 rounded-2xl bg-[#1C1410] border border-white/10 space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#D9A76A] block">
                  1. Пропорция (дозировка)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8E8276] block">Значение:</span>
                    <input
                      type="text"
                      value={recipeRatio}
                      onChange={(e) => setRecipeRatio(e.target.value)}
                      placeholder="15 г : 250 мл"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-1.5 px-2 text-xs font-mono text-white focus:outline-none focus:border-[#D9A76A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8E8276] block">Сноска / коэфф.:</span>
                    <input
                      type="text"
                      value={recipeRatioDesc}
                      onChange={(e) => setRecipeRatioDesc(e.target.value)}
                      placeholder="1 : 16.6"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-1.5 px-2 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
                    />
                  </div>
                </div>
              </div>

              {/* Temp */}
              <div className="p-3.5 rounded-2xl bg-[#1C1410] border border-white/10 space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#D9A76A] block">
                  2. Температура воды
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8E8276] block">Температура:</span>
                    <input
                      type="text"
                      value={recipeTemp}
                      onChange={(e) => setRecipeTemp(e.target.value)}
                      placeholder="92°C – 94°C"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-1.5 px-2 text-xs font-mono text-white focus:outline-none focus:border-[#D9A76A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8E8276] block">Сноска:</span>
                    <input
                      type="text"
                      value={recipeTempDesc}
                      onChange={(e) => setRecipeTempDesc(e.target.value)}
                      placeholder="горячая вода"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-1.5 px-2 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
                    />
                  </div>
                </div>
              </div>

              {/* Grind */}
              <div className="p-3.5 rounded-2xl bg-[#1C1410] border border-white/10 space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#D9A76A] block">
                  3. Рекомендуемый помол
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8E8276] block">Фракция:</span>
                    <input
                      type="text"
                      value={recipeGrind}
                      onChange={(e) => setRecipeGrind(e.target.value)}
                      placeholder="Средний песок"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-1.5 px-2 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8E8276] block">Сноска / метод:</span>
                    <input
                      type="text"
                      value={recipeGrindDesc}
                      onChange={(e) => setRecipeGrindDesc(e.target.value)}
                      placeholder="под V60"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-1.5 px-2 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
                    />
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="p-3.5 rounded-2xl bg-[#1C1410] border border-white/10 space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#D9A76A] block">
                  4. Время пролива / тайминг
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8E8276] block">Время:</span>
                    <input
                      type="text"
                      value={recipeTime}
                      onChange={(e) => setRecipeTime(e.target.value)}
                      placeholder="2:30 – 3:00"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-1.5 px-2 text-xs font-mono text-white focus:outline-none focus:border-[#D9A76A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8E8276] block">Сноска:</span>
                    <input
                      type="text"
                      value={recipeTimeDesc}
                      onChange={(e) => setRecipeTimeDesc(e.target.value)}
                      placeholder="общее время"
                      className="w-full rounded-lg bg-black/30 border border-white/10 py-1.5 px-2 text-xs text-[#C4B9AD] focus:outline-none focus:border-[#D9A76A]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-step extraction guide */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Пошаговое руководство экстракции ({recipeSteps.length} шагов):
                </label>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D9A76A]/10 hover:bg-[#D9A76A]/20 text-[#D9A76A] border border-[#D9A76A]/30 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Добавить шаг</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {recipeSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-[#1C1410] border border-white/10">
                    <div className="h-6 w-6 rounded-full bg-[#D9A76A]/20 text-[#E5CBA8] font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-1">
                      {idx + 1}
                    </div>
                    <textarea
                      rows={2}
                      value={step}
                      onChange={(e) => handleStepChange(idx, e.target.value)}
                      placeholder={`Шаг ${idx + 1}: например, Блуминг (предсмачивание)...`}
                      className="flex-1 rounded-lg bg-black/30 border border-white/10 p-2 text-xs text-white focus:outline-none focus:border-[#D9A76A] leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      disabled={recipeSteps.length <= 1}
                      title="Удалить шаг"
                      className="p-1.5 rounded-lg hover:bg-rose-500/20 text-[#8E8276] hover:text-rose-400 transition-colors disabled:opacity-20 cursor-pointer mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Images Gallery */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#140E0B] border border-white/10 shadow-xl">
            <MultiImageUpload images={images} onChange={setImages} />
          </div>

        </div>

        {/* Right Col (4 cols): Pricing, Stock, Relationships & Badges */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: Pricing & Stock */}
          <div className="p-6 rounded-3xl bg-[#140E0B] border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold font-serif text-white uppercase tracking-wider">
              Цена и Наличие
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Цена (₽) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="850"
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#8E8276]">
                  Старая цена (для скидки)
                </label>
                <input
                  type="number"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="1000"
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs font-mono text-stone-400 focus:outline-none focus:border-[#D9A76A]"
                />
              </div>

              {/* In stock toggle */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">В наличии</span>
                <button
                  type="button"
                  onClick={() => setInStock(!inStock)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all border cursor-pointer',
                    inStock
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                  )}
                >
                  {inStock ? 'В наличии' : 'Нет в наличии'}
                </button>
              </div>
            </div>
          </div>

          {/* Card: Brand & Country */}
          <div className="p-6 rounded-3xl bg-[#140E0B] border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold font-serif text-white uppercase tracking-wider">
              Страна и Бренд
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Страна / Терруар
                </label>
                <select
                  value={countryId}
                  onChange={(e) => setCountryId(e.target.value)}
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                >
                  <option value="">Не выбрано</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flagEmoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                  Бренд / Производитель
                </label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full rounded-xl bg-[#1C1410] border border-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#D9A76A]"
                >
                  <option value="">Не выбрано</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card: Marketing Badges */}
          <div className="p-6 rounded-3xl bg-[#140E0B] border border-white/10 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold font-serif text-white uppercase tracking-wider">
              Маркетинговые метки
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.02] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewFlag}
                  onChange={(e) => setIsNewFlag(e.target.checked)}
                  className="rounded accent-[#D9A76A] w-4 h-4"
                />
                <span className="text-xs text-white font-medium">Новинка (бейдж NEW)</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.02] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="rounded accent-[#D9A76A] w-4 h-4"
                />
                <span className="text-xs text-white font-medium">
                  Популярный товар (на Главной)
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.02] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded accent-[#D9A76A] w-4 h-4"
                />
                <span className="text-xs text-white font-medium">Хит коллекции</span>
              </label>
            </div>
          </div>

        </div>

      </div>

    </form>
  );
}
