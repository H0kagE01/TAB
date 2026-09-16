import React from 'react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { HeroSection } from '@/components/hero/HeroSection';
import { DirectionsBlock } from '@/components/directions/DirectionsBlock';
import { FeaturedProducts } from '@/components/catalog/FeaturedProducts';
import { CollectionsGrid } from '@/components/catalog/CollectionsGrid';
import { AboutSnippet } from '@/components/home/AboutSnippet';
import { StoresSection } from '@/components/stores/StoresSection';
import { getPopularProducts, getNewProducts, getCollections } from '@/lib/mock-data';
import { getFeaturedProducts, getProductsByIds } from '@/lib/db/products';
import { getMainStore } from '@/lib/db/stores';
import { getPageWithBlocks } from '@/lib/db/pages';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithBlocks('home');
  return {
    title: page?.seoTitle || 'ТАВ — Спешелти кофе свежей обжарки в Майкопе | Каталог и дрип-пакеты',
    description:
      page?.seoDescription ||
      'Спешелти кофе свежей еженедельной обжарки от ТАВ: моносорта из Эфиопии, Колумбии, Кении, фирменные эспрессо-купажи и порционные дрип-пакеты в Майкопе.',
    keywords: page?.seoKeywords || undefined,
  };
}

export default async function HomePage() {
  const [popularProductsFallback, newProductsFallback, collections, pageData, featuredProducts, mainStore] =
    await Promise.all([
      getPopularProducts(6),
      getNewProducts(6),
      getCollections(),
      getPageWithBlocks('home'),
      getFeaturedProducts(5),
      getMainStore(),
    ]);

  // Helper map: blockType → { isActive, content }
  const blocksMap = new Map<string, { isActive: boolean; content: any }>();
  if (pageData?.blocks) {
    for (const b of pageData.blocks) {
      blocksMap.set(b.blockType, { isActive: b.isActive, content: b.content });
    }
  }

  const isBlockActive = (type: string) => {
    if (!pageData) return true;
    return blocksMap.get(type)?.isActive ?? false;
  };

  const getBlockContent = (type: string) => blocksMap.get(type)?.content || {};

  const popContent    = getBlockContent('featured_products_popular');
  const newContent    = getBlockContent('featured_products_new');
  const dirContent    = getBlockContent('directions');
  const colContent    = getBlockContent('collections_grid');
  const aboutContent  = getBlockContent('about_snippet');
  const storesContent = getBlockContent('stores_section');

  // Use manually selected products if productIds are set, otherwise fall back to isPopular/isNew
  const popIds: string[] = Array.isArray(popContent.productIds) ? popContent.productIds : [];
  const newIds: string[] = Array.isArray(newContent.productIds) ? newContent.productIds : [];

  const [popularProducts, newProducts] = await Promise.all([
    popIds.length > 0 ? getProductsByIds(popIds) : popularProductsFallback,
    newIds.length > 0 ? getProductsByIds(newIds) : newProductsFallback,
  ]);

  return (
    <div className="flex flex-col">
      {/* 1. Hero */}
      {isBlockActive('hero') && <HeroSection featuredProducts={featuredProducts} />}

      {/* 2. Направления кофе ТАВ */}
      {isBlockActive('directions') && (
        <DirectionsBlock
          badge={dirContent.badge}
          headline={dirContent.headline}
          headlineHighlight={dirContent.headlineHighlight}
          description={dirContent.description}
          cards={Array.isArray(dirContent.cards) ? dirContent.cards : undefined}
        />
      )}

      {/* 3. Популярные */}
      {isBlockActive('featured_products_popular') && (
        <FeaturedProducts
          badge={popContent.badge || 'Выбор недели'}
          title={popContent.title || 'Популярный спешелти кофе'}
          subtitle={
            popContent.subtitle ||
            'Сбалансированные эспрессо-купажи, яркие моносорта и порционный дрип-кофе, которые выбирают наши гости.'
          }
          products={popularProducts}
          actionLabel={popContent.actionLabel || 'Смотреть весь каталог'}
          actionHref={popContent.actionHref || '/catalog'}
        />
      )}

      {/* 4. Новинки */}
      {isBlockActive('featured_products_new') && (
        <FeaturedProducts
          badge={newContent.badge || 'Свежие микролоты'}
          title={newContent.title || 'Новинки коллекции ТАВ'}
          subtitle={
            newContent.subtitle ||
            'Свежие поступления зерна нового урожая, лимитированная анаэробная ферментация и аксессуары для заваривания.'
          }
          products={newProducts}
          actionLabel={newContent.actionLabel || 'Все новинки кофе'}
          actionHref={newContent.actionHref || '/catalog?isNew=true'}
        />
      )}

      {/* 5. Тематические подборки */}
      {isBlockActive('collections_grid') && (
        <CollectionsGrid
          collections={collections}
          badge={colContent.badge}
          title={colContent.title}
          description={colContent.description}
        />
      )}

      {/* 6. О философии ТАВ */}
      {isBlockActive('about_snippet') && (
        <AboutSnippet
          badge={aboutContent.badge}
          headline={aboutContent.headline}
          headlineHighlight={aboutContent.headlineHighlight}
          quote={aboutContent.quote}
          description={aboutContent.description}
          ctaLabel={aboutContent.ctaLabel}
          ctaHref={aboutContent.ctaHref}
          imageUrl={aboutContent.imageUrl}
          featureStripTitle={aboutContent.featureStripTitle}
          featureStripBadge={aboutContent.featureStripBadge}
          panel1Title={aboutContent.panel1Title}
          panel1Text={aboutContent.panel1Text}
          panel2Title={aboutContent.panel2Title}
          panel2Text={aboutContent.panel2Text}
        />
      )}

      {/* 7. Где нас найти */}
      {isBlockActive('stores_section') && (
        <StoresSection
          store={mainStore}
          badge={storesContent.badge}
          headline={storesContent.headline}
          headlineHighlight={storesContent.headlineHighlight}
          description={storesContent.description}
          photoUrl={storesContent.photoUrl}
          address={storesContent.address}
          workingHours={storesContent.workingHours}
          phone={storesContent.phone}
          formattedPhone={storesContent.formattedPhone}
          phoneNote={storesContent.phoneNote}
          contactsSubheading={storesContent.contactsSubheading}
          busStop={storesContent.busStop}
          topBadgeOpen={storesContent.topBadgeOpen}
          topBadgeParking={storesContent.topBadgeParking}
          pill1={storesContent.pill1}
          pill2={storesContent.pill2}
          pill3={storesContent.pill3}
          yandexMapsUrl={storesContent.yandexMapsUrl}
          yandexMapsBtnText={storesContent.yandexMapsBtnText}
          twoGisUrl={storesContent.twoGisUrl}
          twoGisBtnText={storesContent.twoGisBtnText}
        />
      )}
    </div>
  );
}
