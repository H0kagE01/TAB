import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import { getPageWithBlocks, updatePageInfo } from '@/lib/db/pages';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { slug } = await params;
  const page = await getPageWithBlocks(slug, true); // true = include inactive blocks

  if (!page) {
    return NextResponse.json({ error: 'Страница не найдена' }, { status: 404 });
  }

  return NextResponse.json({ page });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json();

  const existingPage = await getPageWithBlocks(slug, true);
  if (!existingPage) {
    return NextResponse.json({ error: 'Страница не найдена' }, { status: 404 });
  }

  const updated = await updatePageInfo(existingPage.id, {
    title: body.title,
    seoTitle: body.seoTitle,
    seoDescription: body.seoDescription,
    seoKeywords: body.seoKeywords,
    ogImage: body.ogImage,
    isPublished: body.isPublished,
  });

  // Revalidate public page
  const publicPath = slug === 'home' ? '/' : `/${slug}`;
  revalidatePath(publicPath);

  return NextResponse.json({ success: true, page: updated });
}
