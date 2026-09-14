import prisma from '@/lib/prisma';
import { Collection } from '@/types';
import { mockCollections } from '@/lib/mock-data/collections';

export interface AdminCollectionProductItem {
  id: string;
  order: number;
  productId: string;
  product: {
    id: string;
    title: string;
    slug: string;
    price: any;
    inStock: boolean;
    images: any;
  };
}

export interface AdminCollectionItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  badgeText: string | null;
  coverImage: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  products: AdminCollectionProductItem[];
}

export interface CreateCollectionInput {
  slug: string;
  title: string;
  description: string;
  badgeText?: string | null;
  coverImage: string;
  order?: number;
  productIds?: string[];
}

export interface UpdateCollectionInput {
  slug?: string;
  title?: string;
  description?: string;
  badgeText?: string | null;
  coverImage?: string;
  order?: number;
  productIds?: string[];
}

/**
 * Fetch all collections for Public Site (from PostgreSQL DB)
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

import { mockProducts } from '@/lib/mock-data/products';

/**
 * Fetch all collections for Admin Panel
 */
export async function getAllCollectionsForAdmin(): Promise<AdminCollectionItem[]> {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { order: 'asc' },
      include: {
        products: {
          orderBy: { order: 'asc' },
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                inStock: true,
                images: true,
              },
            },
          },
        },
      },
    });

    return collections.map((col) => ({
      id: col.id,
      slug: col.slug,
      title: col.title,
      description: col.description,
      badgeText: col.badgeText,
      coverImage: col.coverImage,
      order: col.order,
      createdAt: col.createdAt,
      updatedAt: col.updatedAt,
      products: col.products.map((p) => ({
        id: p.id,
        order: p.order,
        productId: p.productId,
        product: {
          id: p.product.id,
          title: p.product.title,
          slug: p.product.slug,
          price: Number(p.product.price),
          inStock: p.product.inStock,
          images: p.product.images,
        },
      })),
    }));
  } catch (error) {
    console.warn('DB unavailable in getAllCollectionsForAdmin, using mock fallback');
    return mockCollections.map((col, idx) => {
      const colProducts = (col.productIds || [])
        .map((pId, pIdx) => {
          const prod = mockProducts.find((p) => p.id === pId);
          if (!prod) return null;
          return {
            id: `cp-${col.id}-${prod.id}`,
            order: pIdx + 1,
            productId: prod.id,
            product: {
              id: prod.id,
              title: prod.title,
              slug: prod.slug,
              price: prod.price,
              inStock: prod.inStock,
              images: prod.images,
            },
          };
        })
        .filter(Boolean) as AdminCollectionProductItem[];

      return {
        id: col.id,
        slug: col.slug,
        title: col.title,
        description: col.description,
        badgeText: col.badgeText || null,
        coverImage: col.coverImage,
        order: idx + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: colProducts,
      };
    });
  }
}

/**
 * Fetch single collection by ID
 */
export async function getCollectionById(id: string) {
  try {
    const col = await prisma.collection.findUnique({
      where: { id },
      include: {
        products: {
          orderBy: { order: 'asc' },
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                inStock: true,
                images: true,
              },
            },
          },
        },
      },
    });
    if (!col) return null;
    return {
      ...col,
      products: col.products.map((p) => ({
        ...p,
        product: {
          ...p.product,
          price: Number(p.product.price),
        },
      })),
    };
  } catch (error) {
    console.warn('DB unavailable in getCollectionById, using mock fallback');
    const col = mockCollections.find((c) => c.id === id || c.slug === id);
    if (!col) return null;
    const colProducts = (col.productIds || [])
      .map((pId, pIdx) => {
        const prod = mockProducts.find((p) => p.id === pId);
        if (!prod) return null;
        return {
          id: `cp-${col.id}-${prod.id}`,
          order: pIdx + 1,
          productId: prod.id,
          product: {
            ...prod,
            price: Number(prod.price),
          },
        };
      })
      .filter(Boolean);

    return {
      ...col,
      products: colProducts,
    };
  }
}

/**
 * Create a new Collection and link products
 */
export async function createCollection(data: CreateCollectionInput) {
  const existing = await prisma.collection.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    throw new Error(`Подборка со slug "${data.slug}" уже существует`);
  }

  const productIds = data.productIds || [];

  return prisma.$transaction(async (tx) => {
    const created = await tx.collection.create({
      data: {
        slug: data.slug.trim(),
        title: data.title.trim(),
        description: data.description.trim(),
        badgeText: data.badgeText?.trim() || null,
        coverImage: data.coverImage.trim(),
        order: data.order ?? 0,
      },
    });

    if (productIds.length > 0) {
      await tx.collectionProduct.createMany({
        data: productIds.map((prodId, idx) => ({
          collectionId: created.id,
          productId: prodId,
          order: idx + 1,
        })),
      });
    }

    return tx.collection.findUnique({
      where: { id: created.id },
      include: {
        products: {
          orderBy: { order: 'asc' },
          include: { product: true },
        },
      },
    });
  });
}

/**
 * Update an existing Collection and its products
 */
export async function updateCollection(id: string, data: UpdateCollectionInput) {
  if (data.slug) {
    const existing = await prisma.collection.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (existing) {
      throw new Error(`Подборка со slug "${data.slug}" уже используется`);
    }
  }

  return prisma.$transaction(async (tx) => {
    await tx.collection.update({
      where: { id },
      data: {
        ...(data.slug !== undefined && { slug: data.slug.trim() }),
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.badgeText !== undefined && { badgeText: data.badgeText?.trim() || null }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage.trim() }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });

    // If productIds array is provided, replace collection products
    if (data.productIds !== undefined) {
      await tx.collectionProduct.deleteMany({
        where: { collectionId: id },
      });

      if (data.productIds.length > 0) {
        await tx.collectionProduct.createMany({
          data: data.productIds.map((prodId, idx) => ({
            collectionId: id,
            productId: prodId,
            order: idx + 1,
          })),
        });
      }
    }

    return tx.collection.findUnique({
      where: { id },
      include: {
        products: {
          orderBy: { order: 'asc' },
          include: { product: true },
        },
      },
    });
  });
}

/**
 * Delete Collection
 */
export async function deleteCollection(id: string) {
  const col = await prisma.collection.findUnique({
    where: { id },
  });
  if (!col) throw new Error('Подборка не найдена');

  return prisma.collection.delete({
    where: { id },
  });
}
