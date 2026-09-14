import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import { getBrandById, updateBrand, deleteBrand } from '@/lib/db/brands';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { id } = await params;
  const brand = await getBrandById(id);
  if (!brand) {
    return NextResponse.json({ error: 'Бренд не найден' }, { status: 404 });
  }

  return NextResponse.json({ brand });
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

    const updated = await updateBrand(id, body);

    revalidatePath('/catalog');
    revalidatePath('/admin/products');

    return NextResponse.json({ success: true, brand: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка обновления бренда' }, { status: 400 });
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

  try {
    const { id } = await params;
    await deleteBrand(id);

    revalidatePath('/catalog');
    revalidatePath('/admin/products');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка удаления бренда' }, { status: 400 });
  }
}
