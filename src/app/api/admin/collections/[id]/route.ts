import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import { getCollectionById, updateCollection, deleteCollection } from '@/lib/db/collections';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { id } = await params;
  const collection = await getCollectionById(id);
  if (!collection) {
    return NextResponse.json({ error: 'Подборка не найдена' }, { status: 404 });
  }

  return NextResponse.json({ collection });
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

    const updated = await updateCollection(id, body);

    revalidatePath('/');
    revalidatePath('/catalog');

    return NextResponse.json({ success: true, collection: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка обновления подборки' }, { status: 400 });
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
    await deleteCollection(id);

    revalidatePath('/');
    revalidatePath('/catalog');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка удаления подборки' }, { status: 400 });
  }
}
