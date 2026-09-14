'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  Coffee,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Package,
  Layers,
  Droplets,
  Wrench,
} from 'lucide-react';
import { Product, ProductCategory, RoastLevel, Brand, Category, Country } from '@/types';
import { ProductCard } from './ProductCard';
import { CustomSelect } from '../common/CustomSelect';

interface CatalogClientProps {
  initialProducts: Product[];
  initialCategory?: string | 'all';
  categories?: Category[];
  brands?: Brand[];
  countries?: Country[];
}

export function CatalogClient({
  initialProducts,
  initialCategory = 'all',
  categories = [],
  brands = [],
  countries = [],
}: CatalogClientProps) {
  const searchParams = useSearchParams();

  // Filter States
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('q') || searchParams.get('search') || ''
  );
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>(
    initialCategory
  );
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedRoast, setSelectedRoast] = useState<RoastLevel | 'all'>('all');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    searchParams.get('collection') || null
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(searchParams.get('isNew') === 'true');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-asc' | 'price-desc'>('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all' && initialCategory === 'all') count++;
    if (selectedBrand !== 'all') count++;
    if (selectedCountry !== 'all') count++;
    if (selectedRoast !== 'all') count++;
    if (selectedCollection) count++;
    if (inStockOnly) count++;
    if (newOnly) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    selectedCategory,
    initialCategory,
    selectedBrand,
    selectedCountry,
    selectedRoast,
    selectedCollection,
    inStockOnly,
    newOnly,
    searchQuery,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    if (initialCategory === 'all') {
      setSelectedCategory('all');
    }
    setSelectedBrand('all');
    setSelectedCountry('all');
    setSelectedRoast('all');
    setSelectedCollection(null);
    setInStockOnly(false);
    setNewOnly(false);
    setSortBy('popular');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = product.title.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchBrand = product.brandName?.toLowerCase().includes(q);
          const matchCountry = product.countryName?.toLowerCase().includes(q);
          const matchNotes = product.coffeeSpecs?.flavorNotes?.some((n) =>
            n.toLowerCase().includes(q)
          );

          if (!matchTitle && !matchDesc && !matchBrand && !matchCountry && !matchNotes) {
            return false;
          }
        }

        // Collection filter
        if (selectedCollection && !product.collectionSlugs?.includes(selectedCollection)) {
          return false;
        }

        // Category
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Brand
        if (selectedBrand !== 'all' && product.brandId !== selectedBrand) {
          return false;
        }

        // Country
        if (selectedCountry !== 'all' && product.countryId !== selectedCountry) {
          return false;
        }

        // Stock
        if (inStockOnly && !product.inStock) {
          return false;
        }

        // New Only
        if (newOnly && !product.isNew) {
          return false;
        }

        // Coffee Roast Level
        if (selectedRoast !== 'all' && product.coffeeSpecs?.roastLevel !== selectedRoast) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
        // Default popular
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [
    initialProducts,
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedCountry,
    inStockOnly,
    newOnly,
    selectedRoast,
    sortBy,
  ]);

  const handleCategorySelect = (
    category: string | 'all',
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    setSelectedCategory(category);
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-12 sm:pb-16">
      
      {/* 1. TOP CONTROLS & CATEGORY NAVIGATOR (Sticky on Mobile & Tablet, Natural on Desktop) */}
      <div className="sticky top-[54px] sm:top-[64px] lg:relative lg:top-auto z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-5 py-2.5 sm:py-3 lg:py-4 bg-[#0E0A08]/95 lg:bg-[#140E0B] backdrop-blur-xl border-b lg:border border-white/10 rounded-none lg:rounded-3xl shadow-xl transition-all mb-4 sm:mb-6 lg:mb-8">
        <div className="space-y-2.5 sm:space-y-3">
          
          {/* Search Bar + Mobile Filter Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8276]" />
              <input
                type="text"
                placeholder="Поиск по сорту, нотам вкуса (бергамот, шоколад, жасмин)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-[#140E0B] lg:bg-[#0E0A08] py-2 sm:py-2.5 pl-10 pr-9 text-xs sm:text-sm text-white placeholder:text-[#8E8276] shadow-inner focus:border-[#D9A76A] focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8E8276] hover:text-white cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Mobile/Tablet Filter Drawer Button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className={`lg:hidden flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap ${
                activeFiltersCount > 0
                  ? 'bg-[#D9A76A] text-[#0E0A08] border-[#D9A76A]'
                  : 'bg-[#140E0B] text-[#C4B9AD] border-white/15 hover:text-white'
              }`}
            >
              <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Фильтры</span>
              {activeFiltersCount > 0 && (
                <span className="h-4 min-w-[16px] px-1 rounded-full bg-[#0E0A08] text-[#D9A76A] text-[10px] flex items-center justify-center font-black">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Horizontal Scrollable Category Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={(e) => handleCategorySelect('all', e)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#D9A76A] text-[#0E0A08] border-[#D9A76A] shadow-md shadow-[#D9A76A]/20'
                  : 'bg-[#0E0A08] text-[#C4B9AD] border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              Все позиции
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={(e) => handleCategorySelect(cat.slug, e)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#D9A76A] text-[#0E0A08] border-[#D9A76A] shadow-md shadow-[#D9A76A]/20'
                      : 'bg-[#0E0A08] text-[#C4B9AD] border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Coffee className="h-3.5 w-3.5 opacity-80" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 2. MAIN CATALOG BODY (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* DESKTOP FILTERS SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 space-y-5 sticky top-24 z-20 bg-[#140E0B] p-5 rounded-3xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <SlidersHorizontal className="h-4 w-4 text-[#D9A76A]" />
              <span>Фильтры кофе</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-[#D9A76A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Сбросить ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Roast Level Filter */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8E8276] font-bold block">
              Степень обжарки:
            </span>
            <div className="grid grid-cols-1 gap-1 text-xs">
              {[
                { id: 'all', label: 'Любая обжарка' },
                { id: 'light', label: 'Светлая (фильтр / V60)' },
                { id: 'medium', label: 'Средняя (универсальная / баланс)' },
                { id: 'dark', label: 'Тёмная (плотный эспрессо)' },
              ].map((roast) => {
                const isSelected = selectedRoast === roast.id;
                return (
                  <button
                    key={roast.id}
                    type="button"
                    onClick={() => setSelectedRoast(roast.id as any)}
                    className={`px-3 py-2 rounded-xl text-left font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#D9A76A]/20 text-[#E5CBA8] border border-[#D9A76A]/40 font-bold'
                        : 'text-[#C4B9AD] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{roast.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-[#D9A76A]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country Origin Filter */}
          <div className="space-y-2 pt-3.5 border-t border-white/10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8E8276] font-bold block">
              Страна произрастания:
            </span>
            <CustomSelect
              value={selectedCountry}
              onChange={(val) => setSelectedCountry(val)}
              options={[
                { value: 'all', label: 'Все страны и терруары' },
                ...countries.map((c) => ({
                  value: c.id,
                  label: `${c.flagEmoji || '☕'} ${c.name}`,
                })),
              ]}
            />
          </div>

          {/* Brand Collection Filter */}
          <div className="space-y-2 pt-3.5 border-t border-white/10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8E8276] font-bold block">
              Линейка ТАВ:
            </span>
            <CustomSelect
              value={selectedBrand}
              onChange={(val) => setSelectedBrand(val)}
              options={[
                { value: 'all', label: 'Все линейки' },
                ...brands.map((b) => ({
                  value: b.id,
                  label: b.name,
                })),
              ]}
            />
          </div>

          {/* Checkboxes: In Stock & New */}
          <div className="space-y-2.5 pt-3.5 border-t border-white/10 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer text-[#C4B9AD] hover:text-white select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded bg-[#140E0B] border-white/20 text-[#D9A76A] focus:ring-[#D9A76A]"
              />
              <span>Только в наличии в Майкопе</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-[#C4B9AD] hover:text-white select-none">
              <input
                type="checkbox"
                checked={newOnly}
                onChange={(e) => setNewOnly(e.target.checked)}
                className="h-4 w-4 rounded bg-[#140E0B] border-white/20 text-[#D9A76A] focus:ring-[#D9A76A]"
              />
              <span>Свежие микролоты и новинки</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS GRID AREA */}
        <div className="lg:col-span-9 space-y-4 sm:space-y-6">
          
          {/* Top Sort Bar & Results Counter */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[#140E0B] border border-white/10 text-xs text-[#8E8276]">
            <div className="font-semibold text-white">
              Найдено позиций: <span className="text-[#D9A76A] font-bold">{filteredProducts.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[#8E8276] text-xs">Сортировка:</span>
              <CustomSelect
                size="sm"
                align="right"
                className="w-44 sm:w-52"
                value={sortBy}
                onChange={(val) => setSortBy(val as any)}
                options={[
                  { value: 'popular', label: 'По популярности' },
                  { value: 'newest', label: 'Сначала новинки' },
                  { value: 'price-asc', label: 'По возрастанию цены' },
                  { value: 'price-desc', label: 'По убыванию цены' },
                ]}
              />
            </div>
          </div>

          {/* Products Grid: 2-Col Mobile / 2-Col Tablet / 3-Col Desktop */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24 space-y-4 rounded-3xl bg-[#140E0B] border border-white/10 p-8">
              <Coffee className="h-12 w-12 mx-auto text-[#8E8276] opacity-40" />
              <h3 className="text-lg font-serif font-bold text-white">Позиций не найдено</h3>
              <p className="text-xs sm:text-sm text-[#8E8276] max-w-md mx-auto">
                Попробуйте изменить параметры поиска или сбросить фильтры, чтобы увидеть все доступные сорта ТАВ.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9A76A] text-[#0E0A08] text-xs font-bold shadow-lg hover:bg-[#E5CBA8] transition-all cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Сбросить все фильтры</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* MOBILE FILTERS DRAWER */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[80] lg:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setMobileFiltersOpen(false)}
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-full max-h-[85vh] bg-[#140E0B] border-t border-white/20 rounded-t-3xl shadow-2xl p-5 sm:p-6 overflow-y-auto space-y-6 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 font-bold text-white text-base">
                  <SlidersHorizontal className="h-4 w-4 text-[#D9A76A]" />
                  <span>Фильтры каталога</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-full text-[#8E8276] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Roast Filter */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8E8276] font-bold block">
                  Степень обжарки:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'all', label: 'Любая' },
                    { id: 'light', label: 'Светлая' },
                    { id: 'medium', label: 'Средняя' },
                    { id: 'dark', label: 'Тёмная' },
                  ].map((roast) => {
                    const isSelected = selectedRoast === roast.id;
                    return (
                      <button
                        key={roast.id}
                        type="button"
                        onClick={() => setSelectedRoast(roast.id as any)}
                        className={`p-2.5 rounded-xl text-center font-medium transition-all ${
                          isSelected
                            ? 'bg-[#D9A76A] text-[#0E0A08] font-bold'
                            : 'bg-white/5 text-[#C4B9AD] border border-white/10'
                        }`}
                      >
                        {roast.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Country Filter */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8E8276] font-bold block">
                  Страна:
                </span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#1C1410] border border-white/15 rounded-xl p-3 text-xs text-white"
                >
                  <option value="all">Все страны и терруары</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Line Filter */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8E8276] font-bold block">
                  Линейка ТАВ:
                </span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-[#1C1410] border border-white/15 rounded-xl p-3 text-xs text-white"
                >
                  <option value="all">Все линейки</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock & New Toggles */}
              <div className="space-y-3 pt-2 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer text-[#C4B9AD]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded bg-[#140E0B] border-white/20 text-[#D9A76A]"
                  />
                  <span>Только в наличии в Майкопе</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-[#C4B9AD]">
                  <input
                    type="checkbox"
                    checked={newOnly}
                    onChange={(e) => setNewOnly(e.target.checked)}
                    className="h-4 w-4 rounded bg-[#140E0B] border-white/20 text-[#D9A76A]"
                  />
                  <span>Свежие микролоты и новинки</span>
                </label>
              </div>

              {/* Drawer Apply / Reset Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-[#C4B9AD]"
                >
                  Сбросить
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#D9A76A] text-[#0E0A08] text-xs font-bold"
                >
                  Применить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
