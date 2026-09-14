import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import { getAllCollectionsForAdmin, createCollection } from '@/lib/db/collections';

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const collections = await getAllCollectionsForAdmin();
    return NextResponse.json({ collections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка загрузки подборок' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.slug || !body.description || !body.coverImage) {
      return NextResponse.json(
        { error: 'Заголовок, slug, описание и обложка обязательны' },
        { status: 400 }
      );
    }

    const collection = await createCollection(body);

    revalidatePath('/');
    revalidatePath('/catalog');

    return NextResponse.json({ success: true, collection });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка создания подборки' }, { status: 400 });
  }
}
