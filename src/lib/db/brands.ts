import prisma from '@/lib/prisma';

export interface AdminBrandItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  countryId: string | null;
  country: {
    id: string;
    name: string;
    code: string;
    flagEmoji: string | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    products: number;
  };
}

export interface CreateBrandInput {
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  countryId?: string | null;
}

export interface UpdateBrandInput {
  name?: string;
  slug?: string;
  description?: string | null;
  logoUrl?: string | null;
  countryId?: string | null;
}

import { mockBrands } from '@/lib/mock-data/brands';
import { mockProducts } from '@/lib/mock-data/products';
import { mockCountries } from '@/lib/mock-data/countries';

/**
 * Fetch all brands with country and product counts for Admin Panel
 */
export async function getAllBrandsForAdmin(): Promise<AdminBrandItem[]> {
  try {
    return await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        country: {
          select: {
            id: true,
            name: true,
            code: true,
            flagEmoji: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });
  } catch (error) {
    console.warn('DB unavailable in getAllBrandsForAdmin, using mock fallback');
    return mockBrands.map((b) => {
      const country = mockCountries.find((c) => c.id === b.countryId);
      const pCount = mockProducts.filter((p) => p.brandId === b.id).length;
      return {
        id: b.id,
        name: b.name,
        slug: b.slug,
        description: b.description || null,
        logoUrl: b.logoUrl || null,
        countryId: b.countryId || null,
        country: country
          ? {
              id: country.id,
              name: country.name,
              code: country.code,
              flagEmoji: country.flagEmoji || null,
            }
          : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          products: pCount,
        },
      };
    });
  }
}

/**
 * Fetch single brand by ID
 */
export async function getBrandById(id: string) {
  try {
    return await prisma.brand.findUnique({
      where: { id },
      include: {
        country: true,
        _count: {
          select: { products: true },
        },
      },
    });
  } catch (error) {
    console.warn('DB unavailable in getBrandById, using mock fallback');
    const b = mockBrands.find((x) => x.id === id || x.slug === id);
    if (!b) return null;
    const country = mockCountries.find((c) => c.id === b.countryId);
    const pCount = mockProducts.filter((p) => p.brandId === b.id).length;
    return {
      ...b,
      country,
      _count: { products: pCount },
    };
  }
}

/**
 * Create a new Brand
 */
export async function createBrand(data: CreateBrandInput) {
  const existing = await prisma.brand.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    throw new Error(`Бренд со slug "${data.slug}" уже существует`);
  }

  return prisma.brand.create({
    data: {
      name: data.name.trim(),
      slug: data.slug.trim(),
      description: data.description?.trim() || null,
      logoUrl: data.logoUrl?.trim() || null,
      countryId: data.countryId || null,
    },
    include: {
      country: true,
      _count: { select: { products: true } },
    },
  });
}

/**
 * Update an existing Brand
 */
export async function updateBrand(id: string, data: UpdateBrandInput) {
  if (data.slug) {
    const existing = await prisma.brand.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (existing) {
      throw new Error(`Бренд со slug "${data.slug}" уже используется`);
    }
  }

  return prisma.brand.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.slug !== undefined && { slug: data.slug.trim() }),
      ...(data.description !== undefined && { description: data.description?.trim() || null }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl?.trim() || null }),
      ...(data.countryId !== undefined && { countryId: data.countryId || null }),
    },
    include: {
      country: true,
      _count: { select: { products: true } },
    },
  });
}

/**
 * Delete Brand (Prisma schema has onDelete: SetNull for Product.brandId)
 */
export async function deleteBrand(id: string) {
  const brand = await prisma.brand.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true } },
    },
  });

  if (!brand) throw new Error('Бренд не найден');

  return prisma.brand.delete({
    where: { id },
  });
}
