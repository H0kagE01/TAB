import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RoastLevel, GrindType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Russian Ruble price
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format gram weight or kg
 */
export function formatWeight(weight?: number): string {
  if (!weight) return '';
  if (weight >= 1000) {
    return `${weight / 1000} кг`;
  }
  return `${weight} г`;
}

/**
 * Roast Level translation and badge helpers
 */
export function getRoastLevelInfo(level?: RoastLevel) {
  switch (level) {
    case 'light':
      return {
        label: 'Светлая обжарка',
        description: 'Чистый вкус, яркая ягодная и цветочная кислотность для фильтра и V60',
        badgeClass: 'bg-amber-500/15 text-[#E5CBA8] border-amber-500/30',
        intensity: 1,
      };
    case 'medium':
      return {
        label: 'Средняя обжарка',
        description: 'Сбалансированный вкус, ноты шоколада, карамели и сладких фруктов',
        badgeClass: 'bg-[#D9A76A]/20 text-[#E5CBA8] border-[#D9A76A]/40',
        intensity: 2,
      };
    case 'dark':
      return {
        label: 'Тёмная обжарка',
        description: 'Плотное тело, насыщенная горечь какао, густая крема для эспрессо',
        badgeClass: 'bg-stone-800 text-stone-200 border-stone-600',
        intensity: 3,
      };
    default:
      return null;
  }
}

/**
 * Grind type human labels
 */
export function getGrindLabel(grind: GrindType): string {
  switch (grind) {
    case 'beans':
      return 'В зёрнах (цельное зерно)';
    case 'espresso':
      return 'Для эспрессо (рожковая кофеварка)';
    case 'filter':
      return 'Для фильтра / воронки V60 / капельной';
    case 'turka':
      return 'Для турки / джезвы (в пыль)';
    case 'moka':
      return 'Для гейзерной кофеварки (Moka)';
    case 'french-press':
      return 'Для френч-пресса / чашки';
    default:
      return 'В зёрнах';
  }
}
