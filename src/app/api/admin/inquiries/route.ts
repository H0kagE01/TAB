import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const where: any = {};
  if (status && status !== 'all') {
    where.status = status;
  }

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      store: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json({ inquiries });
}
