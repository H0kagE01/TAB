import { NextResponse } from 'next/server';
import { getCurrentAdminSession } from '@/lib/auth';
import { getAllPages } from '@/lib/db/pages';

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const pages = await getAllPages();
  return NextResponse.json({ pages });
}
