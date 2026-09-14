import prisma from '@/lib/prisma';
import { FilterState, Product, RoastLevel } from '@/types';
import { mockProducts } from '@/lib/mock-data/products';

const INCLUDE_RELATIONS = {
  category: true,
  brand: true,
  country: true,
  coffeeSpecs: true,
  collections: {
    include: {
      collection: {
        select: { id: true, slug: true, title: true },
      },
    },
  },
} as const;

/**
 * Helper to map Prisma Product + CoffeeSpecs to frontend Product model
 */
export function mapPrismaProductToAppProduct(p: any): Product {
  const collectionIds = Array.isArray(p.collections)
    ? p.collections.map((c: any) => c.collectionId || c.collection?.id).filter(Boolean)
    : [];
  const collectionSlugs = Array.isArray(p.collections)
    ? p.collections.map((c: any) => c.collection?.slug).filter(Boolean)
    : [];

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category?.slug || p.categoryId,
    categoryName: p.category?.name,
    brandId: p.brandId || undefined,
    brandName: p.brand?.name || undefined,
    countryId: p.countryId || undefined,
    countryName: p.country?.name || undefined,
    countryCode: p.country?.code || undefined,
    price: Number(p.price),
    inStock: p.inStock,
    stockCount: p.stockCount,
    shortDescription: p.shortDescription || undefined,
    description: p.description,
    images: Array.isArray(p.images)
      ? (p.images as string[]).filter((img) => typeof img === 'string' && img.trim().length > 0)
      : [],
    isNew: p.isNew,
    isPopular: p.isPopular,
    isFeatured: p.isFeatured,
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : new Date().toISOString(),
    collectionIds,
    collectionSlugs,
    coffeeSpecs: p.coffeeSpecs
      ? {
          variety: p.coffeeSpecs.variety || undefined,
          roastLevel: (p.coffeeSpecs.roastLevel as RoastLevel) || undefined,
          processing: p.coffeeSpecs.processing || undefined,
          altitude: p.coffeeSpecs.altitude || undefined,
          qScore: p.coffeeSpecs.qScore ? Number(p.coffeeSpecs.qScore) : undefined,
          flavorNotes: Array.isArray(p.coffeeSpecs.flavorNotes)
            ? (p.coffeeSpecs.flavorNotes as string[])
            : [],
          recommendedBrew: Array.isArray(p.coffeeSpecs.recommendedBrew)
            ? (p.coffeeSpecs.recommendedBrew as string[])
            : [],
          acidity: p.coffeeSpecs.acidity || undefined,
          sweetness: p.coffeeSpecs.sweetness || undefined,
          bitterness: p.coffeeSpecs.bitterness || undefined,
          body: p.coffeeSpecs.body || undefined,
          weight: p.coffeeSpecs.weightGrams || undefined,
          count: p.coffeeSpecs.dripCount || undefined,
          recipe: p.coffeeSpecs.recipe || undefined,
        }
      : undefined,
  };
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        country: true,
        coffeeSpecs: true,
      },
    });

    if (!product) return null;
    return mapPrismaProductToAppProduct(product);
  } catch (error) {
    console.warn(`Product [${slug}] DB unavailable, using fallback`);
    return mockProducts.find((p) => p.slug === slug || p.id === slug) || null;
  }
}

/**
 * Fetch popular products
 */
export async function getPopularProducts(limit: number = 6): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isPopular: true, inStock: true },
      take: limit,
      orderBy: { order: 'asc' },
      include: {
        category: true,
        brand: true,
        country: true,
        coffeeSpecs: true,
      },
    });

    return products.map(mapPrismaProductToAppProduct);
  } catch (error) {
    console.warn('Popular products DB unavailable, using fallback');
    return mockProducts.filter((p) => p.isPopular).slice(0, limit);
  }
}

/**
 * Fetch featured products for the hero carousel
 */
export async function getFeaturedProducts(limit: number = 5): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      take: limit,
      orderBy: { order: 'asc' },
      include: {
        category: true,
        brand: true,
        country: true,
        coffeeSpecs: true,
      },
    });

    return products.map(mapPrismaProductToAppProduct);
  } catch (error) {
    console.warn('Featured products DB unavailable, using fallback');
    return mockProducts.filter((p) => p.isFeatured).slice(0, limit);
  }
}

/**
 * Fetch products by a list of IDs (preserving the order of the ID array)
 */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids || ids.length === 0) return [];
  try {
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: INCLUDE_RELATIONS,
    });
    // Preserve the order specified in the ids array
    const map = new Map(products.map((p) => [p.id, p]));
    return ids
      .map((id) => map.get(id))
      .filter(Boolean)
      .map(mapPrismaProductToAppProduct);
  } catch (error) {
    console.warn('Products by IDs DB unavailable, using fallback');
    return mockProducts.filter((p) => ids.includes(p.id));
  }
}

/**
 * Fetch a lightweight list of all products for the admin product picker
 */
export async function getAllProductsForAdmin(): Promise<
  { id: string; title: string; price: number; images: string[]; category: string; isNew: boolean; isPopular: boolean; inStock: boolean }[]
> {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        images: true,
        isNew: true,
        isPopular: true,
        inStock: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: [{ isPopular: 'desc' }, { order: 'asc' }],
    });
    if (products && products.length > 0) {
      return products.map((p) => ({
        id: p.id,
        title: p.title,
        price: Number(p.price),
        images: Array.isArray(p.images) ? (p.images as string[]) : [],
        category: p.category?.name || '',
        isNew: p.isNew,
        isPopular: p.isPopular,
        inStock: p.inStock,
      }));
    }
  } catch (error) {
    console.warn('DB unavailable for getAllProductsForAdmin, using mock fallback');
  }

  return mockProducts.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    images: p.images,
    category: p.categoryName || p.category,
    isNew: p.isNew || false,
    isPopular: p.isPopular || false,
    inStock: p.inStock,
  }));
}

export async function getNewProducts(limit: number = 6): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isNew: true },
      take: limit,
      orderBy: { order: 'asc' },
      include: {
        category: true,
        brand: true,
        country: true,
        coffeeSpecs: true,
      },
    });

    return products.map(mapPrismaProductToAppProduct);
  } catch (error) {
    console.warn('New products DB unavailable, using fallback');
    return mockProducts.filter((p) => p.isNew).slice(0, limit);
  }
}

/**
 * Fetch all coffee products
 */
export async function getCoffeeProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: {
            in: ['single-origin', 'espresso-blends', 'drip-coffee', 'sets'],
          },
        },
      },
      orderBy: { order: 'asc' },
      include: {
        category: true,
        brand: true,
        country: true,
        coffeeSpecs: true,
      },
    });

    return products.map(mapPrismaProductToAppProduct);
  } catch (error) {
    console.warn('Coffee products DB unavailable, using fallback');
    return mockProducts.filter((p) => ['single-origin', 'espresso-blends', 'drip-coffee', 'sets', 'coffee'].includes(p.category));
  }
}

/**
 * Multi-faceted filtered products query
 */
export async function getFilteredProducts(filters: FilterState = {}): Promise<{
  products: Product[];
  total: number;
}> {
  try {
    const where: any = {};

    if (filters.category && filters.category !== 'all') {
      where.category = { slug: filters.category };
    }

    if (filters.brand && filters.brand !== 'all') {
      where.OR = [{ brandId: filters.brand }, { brand: { slug: filters.brand } }];
    }

    if (filters.country && filters.country !== 'all') {
      where.countryId = filters.country;
    }

    if (filters.collection && filters.collection !== 'all') {
      where.collections = {
        some: {
          collection: {
            slug: filters.collection,
          },
        },
      };
    }

    if (filters.inStockOnly) {
      where.inStock = true;
    }

    if (filters.isNew) {
      where.isNew = true;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { name: { contains: q, mode: 'insensitive' } } },
        { country: { name: { contains: q, mode: 'insensitive' } } },
        { coffeeSpecs: { variety: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (filters.roastLevel && filters.roastLevel !== 'all') {
      where.coffeeSpecs = {
        ...where.coffeeSpecs,
        roastLevel: filters.roastLevel,
      };
    }

    let orderBy: any = { order: 'asc' };
    if (filters.sortBy === 'price-asc') orderBy = { price: 'asc' };
    else if (filters.sortBy === 'price-desc') orderBy = { price: 'desc' };
    else if (filters.sortBy === 'newest') orderBy = { publishedAt: 'desc' };
    else orderBy = [{ isPopular: 'desc' }, { order: 'asc' }];

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: INCLUDE_RELATIONS,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: products.map(mapPrismaProductToAppProduct),
      total,
    };
  } catch (error) {
    console.warn('Filtered products DB query unavailable, using fallback');
    return { products: mockProducts, total: mockProducts.length };
  }
}
