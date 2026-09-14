import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { mockProducts } from '@/lib/mock-data/products';

export async function GET(req: NextRequest) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  try {
    const where: any = {};
    if (category && category !== 'all') {
      where.categoryId = category;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        category: true,
        brand: true,
        country: true,
        coffeeSpecs: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.warn('DB unavailable in GET /api/admin/products, using mock fallback');

    let filtered = [...mockProducts];
    if (category && category !== 'all') {
      filtered = filtered.filter(
        (p) => p.category === category || (p as any).categoryId === category
      );
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
      );
    }

    const mapped = filtered.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: p.price,
      oldPrice: p.oldPrice || null,
      inStock: p.inStock,
      stockCount: p.stockCount || 10,
      isNew: p.isNew || false,
      isPopular: p.isPopular || false,
      isFeatured: p.isFeatured || false,
      images: p.images || [],
      shortDescription: p.shortDescription || null,
      description: p.description || '',
      category: {
        id: p.category,
        name: p.categoryName || p.category,
        slug: p.category,
      },
      brand: null,
      country: null,
      coffeeSpecs: p.coffeeSpecs || null,
    }));

    return NextResponse.json({ products: mapped });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      categoryId,
      brandId,
      countryId,
      price,
      oldPrice,
      inStock,
      stockCount,
      shortDescription,
      description,
      images,
      isNew,
      isPopular,
      isFeatured,
      coffeeSpecs,
    } = body;

    if (!title || !slug || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: 'Заполните обязательные поля (название, slug, категория, цена)' },
        { status: 400 }
      );
    }

    const created = await prisma.product.create({
      data: {
        title,
        slug,
        categoryId,
        brandId: brandId || null,
        countryId: countryId || null,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        inStock: inStock ?? true,
        stockCount: Number(stockCount) || 0,
        shortDescription: shortDescription || null,
        description: description || '',
        images: Array.isArray(images)
          ? images.filter((img) => typeof img === 'string' && img.trim().length > 0)
          : [],
        isNew: !!isNew,
        isPopular: !!isPopular,
        isFeatured: !!isFeatured,
      },
    });

    if (coffeeSpecs) {
      await prisma.coffeeSpecs.create({
        data: {
          productId: created.id,
          variety: coffeeSpecs.variety || null,
          roastLevel: coffeeSpecs.roastLevel || null,
          processing: coffeeSpecs.processing || null,
          altitude: coffeeSpecs.altitude || null,
          qScore: coffeeSpecs.qScore ? Number(coffeeSpecs.qScore) : null,
          flavorNotes: Array.isArray(coffeeSpecs.flavorNotes) ? coffeeSpecs.flavorNotes : [],
          recommendedBrew: Array.isArray(coffeeSpecs.recommendedBrew) ? coffeeSpecs.recommendedBrew : [],
          acidity: coffeeSpecs.acidity ? Number(coffeeSpecs.acidity) : null,
          sweetness: coffeeSpecs.sweetness ? Number(coffeeSpecs.sweetness) : null,
          bitterness: coffeeSpecs.bitterness ? Number(coffeeSpecs.bitterness) : null,
          body: coffeeSpecs.body ? Number(coffeeSpecs.body) : null,
          weightGrams: coffeeSpecs.weightGrams ? Number(coffeeSpecs.weightGrams) : null,
          dripCount: coffeeSpecs.dripCount ? Number(coffeeSpecs.dripCount) : null,
          recipe: coffeeSpecs.recipe ? coffeeSpecs.recipe : null,
        },
      });
    }

    revalidatePath('/catalog');
    revalidatePath('/coffee');
    revalidatePath('/');

    return NextResponse.json({ success: true, product: created });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Товар с таким slug уже существует' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Ошибка сохранения товара' }, { status: 500 });
  }
}
