export type ProductCategory =
  | 'coffee'
  | 'single-origin'
  | 'espresso-blends'
  | 'drip-coffee'
  | 'accessories'
  | 'sets';

export type RoastLevel = 'light' | 'medium' | 'dark';

export type GrindType =
  | 'beans'
  | 'espresso'
  | 'filter'
  | 'turka'
  | 'moka'
  | 'french-press';

export interface Country {
  id: string;
  name: string;
  code: string; // ISO 2-letter code
  slug: string;
  flagEmoji?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  countryId?: string;
  countryName?: string;
  description?: string;
  logoUrl?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  accentColor?: string;
  order: number;
}

export interface CoffeeRecipeStep {
  step?: number;
  title?: string;
  text: string;
}

export interface CoffeeRecipe {
  title?: string; // "Идеальное приготовление в V60 / Фильтре"
  subtitle?: string; // "Рецепт экстракции от шеф-бариста ТАВ"
  badge?: string; // "15 г : 250 мл"
  ratio?: string; // "15 г : 250 мл"
  ratioDesc?: string; // "1 : 16.6"
  temp?: string; // "92°C – 94°C"
  tempDesc?: string; // "горячая вода"
  grind?: string; // "Средний песок"
  grindDesc?: string; // "под V60"
  time?: string; // "2:30 – 3:00"
  timeDesc?: string; // "общее время"
  steps?: (string | CoffeeRecipeStep)[];
}

export interface CoffeeSpecs {
  variety?: string; // e.g. "100% Арабика (Эфиопское наследие)", "Желтый Бурбон"
  roastLevel?: RoastLevel; // light, medium, dark
  processing?: string; // e.g. "Мытая (Washed)", "Натуральная (Natural)", "Анаэробная"
  altitude?: string; // e.g. "1 900 – 2 200 м"
  qScore?: number; // e.g. 87.5
  flavorNotes?: string[]; // e.g. ["Бергамот", "Жасмин", "Персик", "Лайм"]
  recommendedBrew?: string[]; // e.g. ["V60", "Кемекс", "Аэропресс"]
  acidity?: number; // 1-5
  sweetness?: number; // 1-5
  bitterness?: number; // 1-5
  body?: number; // 1-5
  weight?: number; // Weight in grams (e.g. 250, 1000)
  count?: number; // for drip boxes (e.g. 10 шт)
  recipe?: CoffeeRecipe; // Рецепт экстракции от бариста
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: ProductCategory | string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  countryId?: string;
  countryName?: string;
  countryCode?: string;
  price: number;
  oldPrice?: number | null;
  inStock: boolean;
  stockCount?: number;
  description: string;
  shortDescription?: string;
  images: string[];
  isNew?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  publishedAt: string;
  
  // Collections relations
  collectionIds?: string[];
  collectionSlugs?: string[];

  // Dynamic coffee specs
  coffeeSpecs?: CoffeeSpecs;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  badgeText?: string;
  coverImage: string;
  productIds: string[];
}

export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  formattedPhone: string;
  workingHours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  photoUrl: string;
  isMain: boolean;
  description?: string;
  yandexMapsUrl?: string;
  twoGisUrl?: string;
}

export interface InquiryFormData {
  customerName: string;
  customerPhone: string;
  preferredStoreId?: string;
  productId?: string;
  productTitle?: string;
  comment?: string;
  grind?: GrindType;
}

export interface FilterState {
  search?: string;
  category?: string | 'all';
  brand?: string;
  country?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  inStockOnly?: boolean;
  roastLevel?: RoastLevel | 'all';
  flavorNote?: string;
  sortBy?: 'popular' | 'newest' | 'price-asc' | 'price-desc';
}

export type { SiteSettingsData } from '@/lib/db/settings';
