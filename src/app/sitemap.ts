import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

// The sitemap reads live catalog data, so do not require database access at build time.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tav-coffee.ru';

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/catalog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/coffee`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contacts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Category pages — from DB
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/catalog/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Product pages — from DB
  const products = await prisma.product.findMany({
    select: { slug: true, publishedAt: true, updatedAt: true },
    orderBy: { order: 'asc' },
  });
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
