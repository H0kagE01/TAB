import { NextResponse } from 'next/server';
import { getStores } from '@/lib/db/stores';

export async function GET() {
  try {
    const stores = await getStores();
    return NextResponse.json({ stores });
  } catch (error) {
    console.warn('Error fetching stores');
    return NextResponse.json({ stores: [] });
  }
}
