import { NextResponse } from 'next/server';
import { getCurrentAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const [categories, brands, countries, stores, collections] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.country.findMany({ orderBy: { name: 'asc' } }),
    prisma.store.findMany({ orderBy: { isMain: 'desc' } }),
    prisma.collection.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return NextResponse.json({
    categories,
    brands,
    countries,
    stores,
    collections,
  });
}
