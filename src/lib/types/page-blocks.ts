import { z } from 'zod';
import { RoastLevel } from '@/types';

/* ============================================================
   1. ROAST GUIDE (Профили обжарки)
   ============================================================ */

export const RoastProfileItemSchema = z.object({
  levelKey: z.enum(['light', 'medium', 'dark']),
  title: z.string().min(1, 'Укажите название профиля'),
  badge: z.string().min(1, 'Укажите бейдж'),
  subtitle: z.string().min(1, 'Укажите краткое описание'),
  description: z.string().min(1, 'Укажите подробное описание'),
  flavorNotes: z.array(z.string()).min(1, 'Добавьте хотя бы одну вкусовую ноту'),
  recommendedBrew: z.string().min(1, 'Укажите рекомендованный способ заваривания'),
  acidity: z.number().int().min(1).max(5),
  body: z.number().int().min(1).max(5),
  sweetness: z.number().int().min(1).max(5),
  bitterness: z.number().int().min(1).max(5),
  recommendedProductId: z.string().nullable().optional(),
});

export type RoastProfileItem = z.infer<typeof RoastProfileItemSchema>;

export const RoastGuideBlockContentSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  profiles: z.array(RoastProfileItemSchema).optional(),
});

export type RoastGuideBlockContent = z.infer<typeof RoastGuideBlockContentSchema>;

export interface ResolvedRoastProfile extends RoastProfileItem {
  id: RoastLevel;
  color: string;
  glowColor: string;
  recommendedProduct?: {
    id: string;
    slug: string;
    title: string;
    price: number;
    image: string;
    inStock: boolean;
  } | null;
}

/* ============================================================
   2. TERROIR ATLAS (Атлас терруаров)
   ============================================================ */

export const TerroirItemSchema = z.object({
  id: z.string().min(1, 'Укажите идентификатор терруара'),
  countryId: z.string().min(1, 'Выберите страну'),
  region: z.string().min(1, 'Укажите регион'),
  continent: z.string().min(1, 'Укажите континент'),
  altitude: z.string().min(1, 'Укажите высоту произрастания'),
  process: z.string().min(1, 'Укажите способ обработки'),
  sommelierNotes: z.string().min(1, 'Укажите сомелье-заметку'),
  flavorNotes: z.array(z.string()).min(1, 'Добавьте дескрипторы вкуса'),
  imageUrl: z.string().min(1, 'Укажите URL изображения'),
  productId: z.string().nullable().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type TerroirItem = z.infer<typeof TerroirItemSchema>;

export const TerroirAtlasBlockContentSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  items: z.array(TerroirItemSchema).optional(),
});

export type TerroirAtlasBlockContent = z.infer<typeof TerroirAtlasBlockContentSchema>;

export interface ResolvedTerroirItem extends TerroirItem {
  country?: {
    id: string;
    name: string;
    code: string;
    flagEmoji?: string | null;
  } | null;
  product?: {
    id: string;
    slug: string;
    title: string;
    price: number;
    image: string;
    inStock: boolean;
  } | null;
}

/* ============================================================
   3. SHOWROOM / BOUTIQUE SHOWCASE (Зоны пространства ТАВ)
   ============================================================ */

export const ShowroomZoneItemSchema = z.object({
  id: z.string().min(1, 'Укажите идентификатор зоны'),
  label: z.string().min(1, 'Укажите текст кнопки таба'),
  title: z.string().min(1, 'Укажите заголовок витрины'),
  desc: z.string().min(1, 'Укажите описание'),
  image: z.string().min(1, 'Укажите изображение'),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type ShowroomZoneItem = z.infer<typeof ShowroomZoneItemSchema>;

export const BoutiqueShowcaseBlockContentSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  zones: z.array(ShowroomZoneItemSchema).optional(),
});

export type BoutiqueShowcaseBlockContent = z.infer<typeof BoutiqueShowcaseBlockContentSchema>;

/* ============================================================
   4. INQUIRY TOPICS / CONCIERGE TERMINAL (Темы обращений)
   ============================================================ */

export const TopicItemSchema = z.object({
  id: z.string().min(1, 'Укажите идентификатор темы'),
  label: z.string().min(1, 'Укажите название кнопки'),
  title: z.string().min(1, 'Укажите заголовок в сообщении'),
  placeholder: z.string().min(1, 'Укажите текст подсказки'),
  iconKey: z.string().default('coffee'),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type TopicItem = z.infer<typeof TopicItemSchema>;

export const ConciergeTerminalBlockContentSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  topics: z.array(TopicItemSchema).optional(),
});

export type ConciergeTerminalBlockContent = z.infer<typeof ConciergeTerminalBlockContentSchema>;

/* ============================================================
   VALIDATION DISPATCHER
   ============================================================ */

export function validateBlockContent(blockType: string, content: any): { success: boolean; error?: string; data?: any } {
  try {
    switch (blockType) {
      case 'roast_guide': {
        const parsed = RoastGuideBlockContentSchema.safeParse(content);
        if (!parsed.success) {
          return { success: false, error: parsed.error.issues.map((i) => i.message).join(', ') };
        }
        return { success: true, data: parsed.data };
      }
      case 'terroir_atlas': {
        const parsed = TerroirAtlasBlockContentSchema.safeParse(content);
        if (!parsed.success) {
          return { success: false, error: parsed.error.issues.map((i) => i.message).join(', ') };
        }
        return { success: true, data: parsed.data };
      }
      case 'boutique_showcase': {
        const parsed = BoutiqueShowcaseBlockContentSchema.safeParse(content);
        if (!parsed.success) {
          return { success: false, error: parsed.error.issues.map((i) => i.message).join(', ') };
        }
        return { success: true, data: parsed.data };
      }
      case 'concierge_terminal': {
        const parsed = ConciergeTerminalBlockContentSchema.safeParse(content);
        if (!parsed.success) {
          return { success: false, error: parsed.error.issues.map((i) => i.message).join(', ') };
        }
        return { success: true, data: parsed.data };
      }
      default:
        return { success: true, data: content };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Ошибка валидации контента блока' };
  }
}
