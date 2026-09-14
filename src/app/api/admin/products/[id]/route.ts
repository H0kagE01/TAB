import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { mockProducts } from '@/lib/mock-data/products';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        country: true,
        coffeeSpecs: true,
      },
    });

    if (product) {
      return NextResponse.json({ product });
    }
  } catch (error) {
    console.warn('DB unavailable in GET /api/admin/products/[id], using mock fallback');
  }

  const mock = mockProducts.find((p) => p.id === id || p.slug === id);
  if (!mock) {
    return NextResponse.json({ error: 'Товар не найден' }, { status: 404 });
  }

  return NextResponse.json({
    product: {
      ...mock,
      category: {
        id: mock.category,
        name: mock.categoryName || mock.category,
        slug: mock.category,
      },
      brand: null,
      country: null,
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const { id } = await params;
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

    try {
      const updated = await prisma.product.update({
        where: { id },
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
        await prisma.coffeeSpecs.upsert({
          where: { productId: id },
          create: {
            productId: id,
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
          update: {
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
      revalidatePath(`/product/${slug}`);
      revalidatePath('/');

      return NextResponse.json({ success: true, product: updated });
    } catch (dbErr) {
      console.warn('DB unavailable in PUT /api/admin/products/[id], updating mock state');
      const prod = mockProducts.find((p) => p.id === id);
      if (prod) {
        Object.assign(prod, {
          title,
          slug,
          price: Number(price),
          oldPrice: oldPrice ? Number(oldPrice) : null,
          inStock: inStock ?? true,
          stockCount: Number(stockCount) || 0,
          shortDescription: shortDescription || null,
          description: description || '',
          images: Array.isArray(images) ? images : [],
          isNew: !!isNew,
          isPopular: !!isPopular,
          isFeatured: !!isFeatured,
          coffeeSpecs: coffeeSpecs || prod.coffeeSpecs,
        });
      }
      return NextResponse.json({
        success: true,
        product: prod || { id, title, price },
      });
    }
  } catch (error) {
    console.warn('Error updating product');
    return NextResponse.json({ error: 'Ошибка обновления товара' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    // Only update fields that are explicitly provided
    const updateData: Record<string, any> = {};
    if (body.inStock !== undefined) updateData.inStock = body.inStock;
    if (body.isNew !== undefined) updateData.isNew = body.isNew;
    if (body.isPopular !== undefined) updateData.isPopular = body.isPopular;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.stockCount !== undefined) updateData.stockCount = Number(body.stockCount);
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.order !== undefined) updateData.order = Number(body.order);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Нет данных для обновления' }, { status: 400 });
    }

    try {
      const updated = await prisma.product.update({
        where: { id },
        data: updateData,
      });

      revalidatePath('/catalog');
      revalidatePath('/coffee');
      revalidatePath('/');

      return NextResponse.json({ success: true, product: updated });
    } catch (dbErr) {
      console.warn('DB unavailable in PATCH /api/admin/products/[id], updating mock state');
      const prod = mockProducts.find((p) => p.id === id);
      if (prod) {
        Object.assign(prod, updateData);
      }
      return NextResponse.json({
        success: true,
        product: prod ? { ...prod, ...updateData } : { id, ...updateData },
      });
    }
  } catch (error) {
    console.warn('Error patching product');
    return NextResponse.json({ error: 'Ошибка обновления товара' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
  } catch (dbErr) {
    console.warn('DB unavailable in DELETE /api/admin/products/[id]');
    const idx = mockProducts.findIndex((p) => p.id === id);
    if (idx !== -1) mockProducts.splice(idx, 1);
  }

  revalidatePath('/catalog');
  revalidatePath('/coffee');
  revalidatePath('/');

  return NextResponse.json({ success: true });
}

