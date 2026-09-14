import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import { createPageBlock } from '@/lib/db/pages';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { pageId, blockType, name, order, content } = await req.json();

  if (!pageId || !blockType || !name) {
    return NextResponse.json(
      { error: 'Заполните обязательные поля' },
      { status: 400 }
    );
  }

  const created = await createPageBlock({
    pageId,
    blockType,
    name,
    order: order || 0,
    content: content || {},
  });

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    select: { slug: true },
  });

  if (page) {
    const publicPath = page.slug === 'home' ? '/' : `/${page.slug}`;
    revalidatePath(publicPath);
  }

  return NextResponse.json({ success: true, block: created });
}
