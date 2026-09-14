import prisma from '@/lib/prisma';
import {
  ResolvedRoastProfile,
  ResolvedTerroirItem,
  ShowroomZoneItem,
  TopicItem,
  RoastProfileItem,
  TerroirItem,
} from '@/lib/types/page-blocks';
import { RoastLevel } from '@/types';

export interface PageBlockData {
  id: string;
  pageId: string;
  blockType: string;
  name: string;
  order: number;
  isActive: boolean;
  content: any;
}

export interface PageData {
  id: string;
  slug: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImage: string | null;
  isPublished: boolean;
  blocks: PageBlockData[];
}

const ROAST_COLOR_TOKENS: Record<RoastLevel, { color: string; glowColor: string }> = {
  light: {
    color: 'from-amber-400 to-yellow-500',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
  medium: {
    color: 'from-amber-600 to-orange-500',
    glowColor: 'rgba(217, 119, 6, 0.45)',
  },
  dark: {
    color: 'from-[#8B5A2B] to-[#5C3A21]',
    glowColor: 'rgba(139, 90, 43, 0.5)',
  },
};

import { mockPages } from '@/lib/mock-data/pages';

/**
 * Fetch a page by its slug with all its blocks sorted by order
 */
export async function getPageWithBlocks(slug: string, includeInactive: boolean = true): Promise<PageData | null> {
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        blocks: {
          where: includeInactive ? {} : { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (page) {
      return {
        ...page,
        blocks: page.blocks.map((b) => ({
          ...b,
          content: b.content,
        })),
      };
    }
  } catch (error) {
    console.warn(`DB unavailable for page [${slug}], using mock fallback`);
  }

  const mock = mockPages.find((p) => p.slug === slug);
  if (!mock) return null;

  return {
    ...mock,
    blocks: includeInactive
      ? mock.blocks
      : mock.blocks.filter((b) => b.isActive),
  };
}

const DEFAULT_ROAST_PROFILES: RoastProfileItem[] = [
  {
    levelKey: 'light',
    title: 'Светлая обжарка (Light)',
    badge: 'Для ценителей',
    subtitle: 'Цветы, бергамот и сочные спелые фрукты',
    description: 'Раскрывает истинный терруар и природную сочность кофейной ягоды.',
    flavorNotes: ['Бергамот', 'Жасмин', 'Белый персик', 'Лайм'],
    recommendedBrew: 'V60 воронка, Кемекс, Аэропресс, Фильтр-кофеварка',
    acidity: 5,
    body: 2,
    sweetness: 4,
    bitterness: 1,
    recommendedProductId: null,
  },
  {
    levelKey: 'medium',
    title: 'Средняя обжарка (Medium)',
    badge: 'Хит & Баланс',
    subtitle: 'Карамель, молочный шоколад и баланс',
    description: 'Самый гармоничный и универсальный профиль.',
    flavorNotes: ['Молочный шоколад', 'Карамель', 'Красное яблоко', 'Фундук'],
    recommendedBrew: 'Гейзерная кофеварка (Moka), Автоматическая кофемашина, Эспрессо',
    acidity: 3,
    body: 4,
    sweetness: 5,
    bitterness: 2,
    recommendedProductId: null,
  },
  {
    levelKey: 'dark',
    title: 'Тёмная обжарка (Dark Espresso)',
    badge: 'Классика',
    subtitle: 'Плотное тело, темный шоколад и какао',
    description: 'Густой, плотный и маслянистый эспрессо-профиль без лишней кислотности.',
    flavorNotes: ['Тёмный шоколад', 'Жареный фундук', 'Патока', 'Какао'],
    recommendedBrew: 'Классический эспрессо, Капучино, Латте, Турка (Джезва)',
    acidity: 1,
    body: 5,
    sweetness: 3,
    bitterness: 4,
    recommendedProductId: null,
  },
];

const DEFAULT_TERROIR_ITEMS: TerroirItem[] = [
  {
    id: 'ethiopia-yirgacheffe',
    countryId: 'country-ethiopia',
    region: 'Иргачиф (Yirgacheffe)',
    continent: 'Восточная Африка',
    altitude: '1900 – 2200 м',
    process: 'Мытая обработка (Washed)',
    sommelierNotes: 'Спешелти микролот высшей категории с высокогорных склонов Эфиопии. Яркий букет белых цветов и цитрусовых нот.',
    flavorNotes: ['Бергамот', 'Жасмин', 'Белый персик', 'Лайм'],
    imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=1200&auto=format&fit=crop',
    productId: null,
    order: 1,
    isActive: true,
  },
  {
    id: 'colombia-huila',
    countryId: 'country-colombia',
    region: 'Уила (Huila)',
    continent: 'Южная Америка',
    altitude: '1600 – 1900 м',
    process: 'Мытая обработка (Washed)',
    sommelierNotes: 'Гармоничный профиль из долины Уила: сочное красное яблоко, карамельная сладость и бархатное тело.',
    flavorNotes: ['Красное яблоко', 'Карамель', 'Тростниковый сахар'],
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
    productId: null,
    order: 2,
    isActive: true,
  },
  {
    id: 'kenya-nyeri',
    countryId: 'country-kenya',
    region: 'Ньери (Nyeri)',
    continent: 'Восточная Африка',
    altitude: '1750 – 2100 м',
    process: 'Двойная ферментация',
    sommelierNotes: 'Вулканические почвы горы Кения. Выразительная смородиновая кислотность, ноты грейпфрута и черного чая.',
    flavorNotes: ['Черная смородина', 'Грейпфрут', 'Красный чай'],
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop',
    productId: null,
    order: 3,
    isActive: true,
  },
];

/**
 * Fetch resolved data for the Coffee page, including dynamically resolving
 * recommended product references in Roast Guide and Terroir Atlas.
 */
export async function getResolvedCoffeePage() {
  const page = await getPageWithBlocks('coffee');

  const heroBlock = page?.blocks.find((b) => b.blockType === 'hero');
  const roastGuideBlock = page?.blocks.find((b) => b.blockType === 'roast_guide');
  const terroirBlock = page?.blocks.find((b) => b.blockType === 'terroir_atlas');
  const grindingBlock = page?.blocks.find((b) => b.blockType === 'grinding_station');
  const collectionBlock = page?.blocks.find((b) => b.blockType === 'coffee_collection');
  const sensoryBlock = page?.blocks.find((b) => b.blockType === 'sensory_cycle');

  const heroContent = heroBlock?.content || {};
  const roastGuideContent = roastGuideBlock?.content || {};
  const terroirAtlasContent = terroirBlock?.content || {};
  const grindingStationContent = grindingBlock?.content || {};
  const coffeeCollectionContent = collectionBlock?.content || {};
  const sensoryCycleContent = sensoryBlock?.content || {};

  // 1. Resolve Roast Guide Profiles with Live Product Data
  const rawProfiles: RoastProfileItem[] =
    Array.isArray(roastGuideContent.profiles) && roastGuideContent.profiles.length > 0
      ? roastGuideContent.profiles
      : DEFAULT_ROAST_PROFILES;

  const resolvedProfiles: ResolvedRoastProfile[] = await Promise.all(
    rawProfiles.map(async (p) => {
      const level = (p.levelKey as RoastLevel) || 'medium';
      const tokens = ROAST_COLOR_TOKENS[level] || ROAST_COLOR_TOKENS.medium;

      let recommendedProduct = null;
      if (p.recommendedProductId) {
        const prod = await prisma.product.findUnique({
          where: { id: p.recommendedProductId },
          select: {
            id: true,
            slug: true,
            title: true,
            price: true,
            images: true,
            inStock: true,
          },
        });
        if (prod) {
          const imgs = Array.isArray(prod.images) ? (prod.images as string[]) : [];
          recommendedProduct = {
            id: prod.id,
            slug: prod.slug,
            title: prod.title,
            price: Number(prod.price),
            image: imgs[0] || '/images/products/ethiopia.jpg',
            inStock: prod.inStock,
          };
        }
      }

      return {
        ...p,
        id: level,
        color: tokens.color,
        glowColor: tokens.glowColor,
        recommendedProduct,
      };
    })
  );

  // 2. Resolve Terroir Atlas Items with Live Country and Product Data
  const rawTerroirItems: TerroirItem[] =
    Array.isArray(terroirAtlasContent.items) && terroirAtlasContent.items.length > 0
      ? terroirAtlasContent.items.filter((t: TerroirItem) => t.isActive !== false)
      : DEFAULT_TERROIR_ITEMS;

  const resolvedTerroirItems: ResolvedTerroirItem[] = await Promise.all(
    rawTerroirItems.map(async (t) => {
      let country = null;
      if (t.countryId) {
        const c = await prisma.country.findUnique({
          where: { id: t.countryId },
          select: { id: true, name: true, code: true, flagEmoji: true },
        });
        if (c) country = c;
      }

      let product = null;
      if (t.productId) {
        const prod = await prisma.product.findUnique({
          where: { id: t.productId },
          select: {
            id: true,
            slug: true,
            title: true,
            price: true,
            images: true,
            inStock: true,
          },
        });
        if (prod) {
          const imgs = Array.isArray(prod.images) ? (prod.images as string[]) : [];
          product = {
            id: prod.id,
            slug: prod.slug,
            title: prod.title,
            price: Number(prod.price),
            image: imgs[0] || '/images/products/ethiopia.jpg',
            inStock: prod.inStock,
          };
        }
      }

      return {
        ...t,
        country,
        product,
      };
    })
  );

  return {
    page,
    heroContent,
    roastGuideContent,
    roastProfiles: resolvedProfiles,
    terroirAtlasContent,
    terroirData: resolvedTerroirItems,
    grindingStationContent,
    coffeeCollectionContent,
    sensoryCycleContent,
  };
}

/**
 * Fetch resolved data for the Contacts page, extracting dynamic showroom zones
 * and concierge inquiry topics.
 */
export async function getResolvedContactsPage() {
  const page = await getPageWithBlocks('contacts');

  const heroBlock = page?.blocks.find((b) => b.blockType === 'hero');
  const boutiqueBlock = page?.blocks.find((b) => b.blockType === 'boutique_showcase');
  const mapBlock = page?.blocks.find((b) => b.blockType === 'map_section');
  const conciergeHubBlock = page?.blocks.find((b) => b.blockType === 'concierge_hub');
  const conciergeBlock = page?.blocks.find((b) => b.blockType === 'concierge_terminal');
  const guestFaqBlock = page?.blocks.find((b) => b.blockType === 'guest_faq');
  const wholesaleBlock = page?.blocks.find((b) => b.blockType === 'wholesale_banner');

  const heroContent = heroBlock?.content || {};
  const showroomContent = boutiqueBlock?.content || {};
  const mapContent = mapBlock?.content || {};
  const conciergeHubContent = conciergeHubBlock?.content || {};
  const conciergeContent = conciergeBlock?.content || {};
  const guestFaqContent = guestFaqBlock?.content || {};
  const wholesaleContent = wholesaleBlock?.content || {};

  const showroomZones: ShowroomZoneItem[] = Array.isArray(showroomContent.zones)
    ? showroomContent.zones
        .filter((z: ShowroomZoneItem) => z.isActive !== false)
        .sort((a: ShowroomZoneItem, b: ShowroomZoneItem) => a.order - b.order)
    : [];

  const inquiryTopics: TopicItem[] = Array.isArray(conciergeContent.topics)
    ? conciergeContent.topics
        .filter((t: TopicItem) => t.isActive !== false)
        .sort((a: TopicItem, b: TopicItem) => a.order - b.order)
    : [];

  return {
    page,
    heroContent,
    isHeroActive: heroBlock ? heroBlock.isActive : true,
    showroomContent,
    isShowroomActive: boutiqueBlock ? boutiqueBlock.isActive : true,
    showroomZones,
    mapContent,
    isMapActive: mapBlock ? mapBlock.isActive : true,
    conciergeHubContent,
    isConciergeHubActive: conciergeHubBlock ? conciergeHubBlock.isActive : true,
    conciergeContent,
    isConciergeActive: conciergeBlock ? conciergeBlock.isActive : true,
    inquiryTopics,
    guestFaqContent,
    isGuestFaqActive: guestFaqBlock ? guestFaqBlock.isActive : true,
    wholesaleContent,
    isWholesaleActive: wholesaleBlock ? wholesaleBlock.isActive : true,
  };
}

/**
 * Fetch all pages for the Admin Panel list
 */
export async function getAllPages() {
  try {
    return await prisma.page.findMany({
      orderBy: { title: 'asc' },
      include: {
        _count: {
          select: { blocks: true },
        },
      },
    });
  } catch (error) {
    console.warn('Pages DB unavailable, using fallback mockPages');
    return mockPages.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      seoKeywords: p.seoKeywords,
      ogImage: p.ogImage,
      isPublished: p.isPublished,
      _count: { blocks: p.blocks.length },
    })) as any;
  }
}

/**
 * Update page SEO and general info
 */
export async function updatePageInfo(
  id: string,
  data: {
    title?: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string | null;
    ogImage?: string | null;
    isPublished?: boolean;
  }
) {
  try {
    return await prisma.page.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.warn('DB unavailable in updatePageInfo, updating mock data in memory');
    const p = mockPages.find((x) => x.id === id || x.slug === id);
    if (p) {
      if (data.title !== undefined) p.title = data.title;
      if (data.seoTitle !== undefined) p.seoTitle = data.seoTitle;
      if (data.seoDescription !== undefined) p.seoDescription = data.seoDescription;
      if (data.seoKeywords !== undefined) p.seoKeywords = data.seoKeywords;
      if (data.ogImage !== undefined) p.ogImage = data.ogImage;
      if (data.isPublished !== undefined) p.isPublished = data.isPublished;
      return p;
    }
    return { id, ...data } as any;
  }
}

/**
 * Update block content, name or active status
 */
export async function updatePageBlock(
  id: string,
  data: {
    name?: string;
    isActive?: boolean;
    order?: number;
    content?: any;
  }
) {
  try {
    return await prisma.pageBlock.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.warn('DB unavailable in updatePageBlock, updating mock block in memory');
    for (const page of mockPages) {
      const b = page.blocks.find((blk) => blk.id === id);
      if (b) {
        if (data.name !== undefined) b.name = data.name;
        if (data.isActive !== undefined) b.isActive = data.isActive;
        if (data.order !== undefined) b.order = data.order;
        if (data.content !== undefined) b.content = data.content;
        return b;
      }
    }
    return {
      id,
      pageId: '',
      blockType: '',
      name: data.name || '',
      order: data.order || 1,
      isActive: data.isActive ?? true,
      content: data.content || {},
    };
  }
}

/**
 * Reorder blocks
 */
export async function reorderPageBlocks(updates: { id: string; order: number }[]) {
  try {
    return await prisma.$transaction(
      updates.map((item) =>
        prisma.pageBlock.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
  } catch (error) {
    console.warn('DB unavailable in reorderPageBlocks, updating mock in memory');
    for (const u of updates) {
      for (const page of mockPages) {
        const b = page.blocks.find((blk) => blk.id === u.id);
        if (b) b.order = u.order;
      }
    }
    return updates;
  }
}

/**
 * Create a new page block
 */
export async function createPageBlock(data: {
  pageId: string;
  blockType: string;
  name: string;
  order: number;
  content: any;
}) {
  try {
    return await prisma.pageBlock.create({
      data: {
        ...data,
        isActive: true,
      },
    });
  } catch (error) {
    console.warn('DB unavailable in createPageBlock, adding to mock in memory');
    const newBlock = {
      id: `blk-${Date.now()}`,
      pageId: data.pageId,
      blockType: data.blockType,
      name: data.name,
      order: data.order,
      isActive: true,
      content: data.content,
    };
    const page = mockPages.find((p) => p.id === data.pageId || p.slug === data.pageId);
    if (page) {
      page.blocks.push(newBlock);
    }
    return newBlock;
  }
}

/**
 * Delete a page block
 */
export async function deletePageBlock(id: string) {
  try {
    return await prisma.pageBlock.delete({
      where: { id },
    });
  } catch (error) {
    console.warn('DB unavailable in deletePageBlock, removing from mock in memory');
    for (const page of mockPages) {
      const idx = page.blocks.findIndex((b) => b.id === id);
      if (idx !== -1) {
        const deleted = page.blocks.splice(idx, 1)[0];
        return deleted;
      }
    }
    return { id, pageId: '' };
  }
}

