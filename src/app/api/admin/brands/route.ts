import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import { getAllBrandsForAdmin, createBrand } from '@/lib/db/brands';

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const brands = await getAllBrandsForAdmin();
    return NextResponse.json({ brands });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка загрузки брендов' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Название и slug обязательны' }, { status: 400 });
    }

    const brand = await createBrand(body);

    revalidatePath('/catalog');
    revalidatePath('/admin/products');

    return NextResponse.json({ success: true, brand });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка создания бренда' }, { status: 400 });
  }
}
