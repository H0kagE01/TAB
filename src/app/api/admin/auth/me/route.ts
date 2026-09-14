import { NextResponse } from 'next/server';
import { getCurrentAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  return NextResponse.json({ user: session });
}
