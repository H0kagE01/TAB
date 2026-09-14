import prisma from '@/lib/prisma';
import { Category } from '@/types';

export interface AdminCategoryItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  longDescription: string | null;
  imageUrl: string | null;
  accentColor: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    products: number;
  };
}

export interface CreateCategoryInput {
  slug: string;
  name: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  imageUrl?: string | null;
  accentColor?: string | null;
  order?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  slug?: string;
  name?: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  imageUrl?: string | null;
  accentColor?: string | null;
  order?: number;
  isActive?: boolean;
}

import { mockCategories } from '@/lib/mock-data/categories';
import { mockProducts } from '@/lib/mock-data/products';

/**
 * Fetch all categories with product counts for Admin Panel
 */
export async function getAllCategoriesForAdmin(): Promise<AdminCategoryItem[]> {
  try {
    return await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  } catch (error) {
    console.warn('DB unavailable in getAllCategoriesForAdmin, using mock fallback');
    return mockCategories.map((c) => {
      const pCount = mockProducts.filter(
        (p) => p.category === c.slug || p.category === c.id
      ).length;
      return {
        id: c.id,
        slug: c.slug,
        name: c.name,
        shortDescription: c.shortDescription || null,
        longDescription: c.longDescription || null,
        imageUrl: c.imageUrl || null,
        accentColor: c.accentColor || null,
        order: c.order,
        isActive: true,
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
 * Fetch single category by ID
 */
export async function getCategoryById(id: string) {
  try {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  } catch (error) {
    console.warn('DB unavailable in getCategoryById, using mock fallback');
    const cat = mockCategories.find((c) => c.id === id || c.slug === id);
    if (!cat) return null;
    const pCount = mockProducts.filter(
      (p) => p.category === cat.slug || p.category === cat.id
    ).length;
    return {
      ...cat,
      _count: { products: pCount },
    };
  }
}

/**
 * Create a new Category
 */
export async function createCategory(data: CreateCategoryInput) {
  const existing = await prisma.category.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    throw new Error(`Категория с slug "${data.slug}" уже существует`);
  }

  return prisma.category.create({
    data: {
      slug: data.slug.trim(),
      name: data.name.trim(),
      shortDescription: data.shortDescription?.trim() || null,
      longDescription: data.longDescription?.trim() || null,
      imageUrl: data.imageUrl?.trim() || null,
      accentColor: data.accentColor?.trim() || '#D9A76A',
      order: data.order ?? 0,
      isActive: data.isActive ?? true,
    },
  });
}

/**
 * Update an existing Category
 */
export async function updateCategory(id: string, data: UpdateCategoryInput) {
  if (data.slug) {
    const existing = await prisma.category.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (existing) {
      throw new Error(`Категория со slug "${data.slug}" уже используется`);
    }
  }

  return prisma.category.update({
    where: { id },
    data: {
      ...(data.slug !== undefined && { slug: data.slug.trim() }),
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription?.trim() || null }),
      ...(data.longDescription !== undefined && { longDescription: data.longDescription?.trim() || null }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl?.trim() || null }),
      ...(data.accentColor !== undefined && { accentColor: data.accentColor?.trim() || null }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

/**
 * Safe Delete Category (only if no products attached)
 */
export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    throw new Error('Категория не найдена');
  }

  if (category._count.products > 0) {
    throw new Error(
      `Невозможно удалить категорию "${category.name}", так как к ней привязано ${category._count.products} товаров. Сначала переместите товары или деактивируйте категорию.`
    );
  }

  return prisma.category.delete({
    where: { id },
  });
}

/**
 * Toggle category isActive status
 */
export async function toggleCategoryActive(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!category) throw new Error('Категория не найдена');

  return prisma.category.update({
    where: { id },
    data: { isActive: !category.isActive },
  });
}
