import { FilterState, Product, Category, Brand, Country, Collection, StoreLocation } from '@/types';
import prisma from '@/lib/prisma';
import { mockBrands } from './brands';
import { mockCategories } from './categories';
import { mockCollections } from './collections';
import { mockCountries } from './countries';
import { mockProducts } from './products';
import { mockStores } from './stores';
import { mapPrismaProductToAppProduct } from '@/lib/db/products';

export * from './brands';
export * from './categories';
export * from './collections';
export * from './countries';
export * from './products';
export * from './stores';

/**
 * Fetch all categories from DB or mock
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const cats = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    if (cats.length > 0) {
      return cats.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        shortDescription: c.shortDescription || '',
        longDescription: c.longDescription || '',
        imageUrl: c.imageUrl || '',
        accentColor: c.accentColor || undefined,
        order: c.order,
      }));
    }
  } catch (error) {
    console.warn('Categories DB unavailable, using fallback mock data');
  }
  return mockCategories.sort((a, b) => a.order - b.order);
}

/**
 * Fetch category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const c = await prisma.category.findUnique({ where: { slug } });
    if (c) {
      return {
        id: c.id,
        slug: c.slug,
        name: c.name,
        shortDescription: c.shortDescription || '',
        longDescription: c.longDescription || '',
        imageUrl: c.imageUrl || '',
        accentColor: c.accentColor || undefined,
        order: c.order,
      };
    }
  } catch (error) {
    console.warn('Category by slug DB unavailable, using fallback mock data');
  }
  return mockCategories.find((c) => c.slug === slug) || null;
}

/**
 * Fetch all brands
 */
export async function getBrands(): Promise<Brand[]> {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: { country: true },
    });
    if (brands.length > 0) {
      return brands.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        countryId: b.countryId || undefined,
        countryName: b.country?.name || undefined,
        description: b.description || undefined,
        logoUrl: b.logoUrl || undefined,
      }));
    }
  } catch (error) {
    console.warn('Brands DB unavailable, using fallback mock data');
  }
  return mockBrands;
}

/**
 * Fetch all countries
 */
export async function getCountries(): Promise<Country[]> {
  try {
    const countries = await prisma.country.findMany({ orderBy: { name: 'asc' } });
    if (countries.length > 0) {
      return countries.map((c) => ({
        id: c.id,
        name: c.name,
        code: c.code,
        slug: c.slug,
        flagEmoji: c.flagEmoji || undefined,
      }));
    }
  } catch (error) {
    console.warn('Countries DB unavailable, using fallback mock data');
  }
  return mockCountries;
}

/**
 * Fetch all collections
 */
export async function getCollections(): Promise<Collection[]> {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { order: 'asc' },
      include: {
        products: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (collections.length > 0) {
      return collections.map((col) => ({
        id: col.id,
        slug: col.slug,
        title: col.title,
        description: col.description,
        badgeText: col.badgeText || undefined,
        coverImage: col.coverImage,
        productIds: col.products.map((p) => p.productId),
      }));
    }
  } catch (error) {
    console.warn('Collections DB unavailable, using fallback mock data');
  }
  return mockCollections;
}

/**
 * Fetch collection by slug
 */
export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    const col = await prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (col) {
      return {
        id: col.id,
        slug: col.slug,
        title: col.title,
        description: col.description,
        badgeText: col.badgeText || undefined,
        coverImage: col.coverImage,
        productIds: col.products.map((p) => p.productId),
      };
    }
  } catch (error) {
    console.warn('Collection by slug DB unavailable, using fallback mock data');
  }
  return mockCollections.find((c) => c.slug === slug) || null;
}

/**
 * Fetch stores
 */
export async function getStores(): Promise<StoreLocation[]> {
  try {
    const stores = await prisma.store.findMany({ orderBy: { isMain: 'desc' } });
    if (stores.length > 0) {
      return stores.map((s) => ({
        id: s.id,
        name: s.name,
        address: s.address,
        city: s.city,
        workingHours: s.workingHours,
        phone: s.phone,
        formattedPhone: s.formattedPhone,
        coordinates: {
          lat: Number(s.latitude),
          lng: Number(s.longitude),
        },
        photoUrl: s.photoUrl,
        isMain: s.isMain,
        description: s.description || undefined,
      }));
    }
  } catch (error) {
    console.warn('Stores DB unavailable, using fallback mock data');
  }
  return mockStores;
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

    if (product) {
      return mapPrismaProductToAppProduct(product);
    }
  } catch (error) {
    console.warn(`Product by slug [${slug}] DB unavailable, using fallback mock data`);
  }
  const product = mockProducts.find((p) => p.slug === slug);
  return product || null;
}

/**
 * Fetch popular products for home page ("Сейчас выбирают")
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

    if (products.length > 0) {
      return products.map(mapPrismaProductToAppProduct);
    }
  } catch (error) {
    console.warn('Popular products DB unavailable, using fallback mock data');
  }
  return mockProducts.filter((p) => p.isPopular).slice(0, limit);
}

/**
 * Fetch new arrival products
 */
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

    if (products.length > 0) {
      return products.map(mapPrismaProductToAppProduct);
    }
  } catch (error) {
    console.warn('New products DB unavailable, using fallback mock data');
  }
  return mockProducts.filter((p) => p.isNew).slice(0, limit);
}

/**
 * Fetch coffee products (all beans, drip, and sets)
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
    console.warn('Coffee products DB unavailable, using fallback mock data');
  }

  return mockProducts.filter(
    (p) =>
      p.category === 'single-origin' ||
      p.category === 'espresso-blends' ||
      p.category === 'drip-coffee' ||
      p.category === 'sets' ||
      p.category === 'coffee'
  );
}

/**
 * Fetch related products (same category or same brand)
 */
export async function getRelatedProducts(
  currentProductId: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    const current = await prisma.product.findUnique({
      where: { id: currentProductId },
    });

    if (current) {
      const related = await prisma.product.findMany({
        where: {
          id: { not: currentProductId },
          OR: [{ categoryId: current.categoryId }, { brandId: current.brandId }],
        },
        take: limit,
        include: {
          category: true,
          brand: true,
          country: true,
          coffeeSpecs: true,
        },
      });

      if (related.length > 0) {
        return related.map(mapPrismaProductToAppProduct);
      }
    }
  } catch (error) {
    console.warn('Related products DB unavailable, using fallback mock data');
  }

  const current = mockProducts.find((p) => p.id === currentProductId);
  if (!current) return [];

  return mockProducts
    .filter(
      (p) =>
        p.id !== currentProductId &&
        (p.category === current.category || p.brandId === current.brandId)
    )
    .slice(0, limit);
}

/**
 * Query products with multi-faceted filtering and search
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
        include: {
          category: true,
          brand: true,
          country: true,
          coffeeSpecs: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Return the actual database result (even if 0 products found)
    return {
      products: products.map(mapPrismaProductToAppProduct),
      total,
    };
  } catch (error) {
    console.warn('Filtered products DB query unavailable, using fallback mock data');
  }

  // Fallback to static mock filtering
  let result = [...mockProducts];

  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.brandName && p.brandName.toLowerCase().includes(q)) ||
        (p.countryName && p.countryName.toLowerCase().includes(q)) ||
        (p.coffeeSpecs?.flavorNotes &&
          p.coffeeSpecs.flavorNotes.some((n) => n.toLowerCase().includes(q))) ||
        (p.coffeeSpecs?.variety && p.coffeeSpecs.variety.toLowerCase().includes(q))
    );
  }

  if (filters.category && filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.brand && filters.brand !== 'all') {
    result = result.filter((p) => p.brandId === filters.brand || p.brandName === filters.brand);
  }

  if (filters.country && filters.country !== 'all') {
    result = result.filter(
      (p) => p.countryId === filters.country || p.countryName === filters.country
    );
  }

  if (filters.inStockOnly) {
    result = result.filter((p) => p.inStock);
  }

  if (filters.isNew) {
    result = result.filter((p) => p.isNew);
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.roastLevel && filters.roastLevel !== 'all') {
    result = result.filter((p) => p.coffeeSpecs?.roastLevel === filters.roastLevel);
  }

  if (filters.flavorNote && filters.flavorNote.trim()) {
    const fn = filters.flavorNote.toLowerCase().trim();
    result = result.filter((p) =>
      p.coffeeSpecs?.flavorNotes?.some((n) => n.toLowerCase().includes(fn))
    );
  }

  if (filters.sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'newest') {
    result.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } else {
    result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
  }

  return {
    products: result,
    total: result.length,
  };
}
