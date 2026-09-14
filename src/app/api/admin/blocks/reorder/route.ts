import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import { reorderPageBlocks } from '@/lib/db/pages';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { updates, pageSlug } = await req.json();

  if (!Array.isArray(updates)) {
    return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  }

  await reorderPageBlocks(updates);

  if (pageSlug) {
    const publicPath = pageSlug === 'home' ? '/' : `/${pageSlug}`;
    revalidatePath(publicPath);
  }

  return NextResponse.json({ success: true });
}
