import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import { updatePageBlock, deletePageBlock } from '@/lib/db/pages';
import { validateBlockContent } from '@/lib/types/page-blocks';
import prisma from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.content) {
    const existingBlock = await prisma.pageBlock.findUnique({
      where: { id },
      select: { blockType: true },
    });
    if (existingBlock) {
      const validation = validateBlockContent(existingBlock.blockType, body.content);
      if (!validation.success) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }
  }

  const updated = await updatePageBlock(id, {
    name: body.name,
    isActive: body.isActive,
    order: body.order,
    content: body.content,
  });

  // Revalidate public page
  const page = await prisma.page.findUnique({
    where: { id: updated.pageId },
    select: { slug: true },
  });

  if (page) {
    const publicPath = page.slug === 'home' ? '/' : `/${page.slug}`;
    revalidatePath(publicPath);
  }

  return NextResponse.json({ success: true, block: updated });
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
  const deleted = await deletePageBlock(id);

  const page = await prisma.page.findUnique({
    where: { id: deleted.pageId },
    select: { slug: true },
  });

  if (page) {
    const publicPath = page.slug === 'home' ? '/' : `/${page.slug}`;
    revalidatePath(publicPath);
  }

  return NextResponse.json({ success: true });
}
