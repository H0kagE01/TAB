import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import { getStoreById, updateStore, deleteStore, setMainStore } from '@/lib/db/stores';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { id } = await params;
  const store = await getStoreById(id);
  if (!store) {
    return NextResponse.json({ error: 'Магазин не найден' }, { status: 404 });
  }

  return NextResponse.json({ store });
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

    const updated = await updateStore(id, {
      ...body,
      ...(body.latitude !== undefined && { latitude: Number(body.latitude) }),
      ...(body.longitude !== undefined && { longitude: Number(body.longitude) }),
    });

    revalidatePath('/');
    revalidatePath('/contacts');
    revalidatePath('/coffee');

    return NextResponse.json({ success: true, store: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка обновления магазина' }, { status: 400 });
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
    const updated = await setMainStore(id);

    revalidatePath('/');
    revalidatePath('/contacts');
    revalidatePath('/coffee');

    return NextResponse.json({ success: true, store: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка назначения главного магазина' }, { status: 400 });
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
    await deleteStore(id);

    revalidatePath('/');
    revalidatePath('/contacts');
    revalidatePath('/coffee');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка удаления магазина' }, { status: 400 });
  }
}
