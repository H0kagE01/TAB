import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import { getAllStoresForAdmin, createStore } from '@/lib/db/stores';

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const stores = await getAllStoresForAdmin();
    return NextResponse.json({ stores });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка загрузки магазинов' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.address || !body.phone || !body.workingHours) {
      return NextResponse.json({ error: 'Название, адрес, телефон и часы работы обязательны' }, { status: 400 });
    }

    const store = await createStore({
      ...body,
      latitude: Number(body.latitude) || 44.6087,
      longitude: Number(body.longitude) || 40.1006,
    });

    revalidatePath('/');
    revalidatePath('/contacts');
    revalidatePath('/coffee');

    return NextResponse.json({ success: true, store });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка создания магазина' }, { status: 400 });
  }
}
