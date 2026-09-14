import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  let settings = await prisma.siteSetting.findUnique({
    where: { id: 'global' },
  });

  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {
        id: 'global',
        siteName: 'ТАВ Coffee Roasters',
        siteTagline: 'Спешелти кофе свежей обжарки',
        logoUrl: '/images/logo.jpg',
        mainPhone: '+7 (988) 163-71-41',
        telegramUrl: 'https://t.me/tav_coffee',
        whatsappUrl: 'https://wa.me/79881637141',
        email: 'info@tav-coffee.ru',
        headerMenu: [
          { href: '/catalog', label: 'Каталог' },
          { href: '/coffee', label: 'Зерновой кофе' },
          { href: '/about', label: 'О нас' },
          { href: '/contacts', label: 'Контакты' },
        ],
        footerText: 'Спешелти кофе свежей обжарки в Майкопе.',
      },
    });
  }

  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const body = await req.json();

  const updated = await prisma.siteSetting.upsert({
    where: { id: 'global' },
    create: {
      id: 'global',
      siteName: body.siteName,
      siteTagline: body.siteTagline,
      logoUrl: body.logoUrl,
      mainPhone: body.mainPhone,
      telegramUrl: body.telegramUrl,
      whatsappUrl: body.whatsappUrl,
      email: body.email,
      headerMenu: body.headerMenu,
      footerText: body.footerText,
      defaultSeo: body.defaultSeo,
    },
    update: {
      siteName: body.siteName,
      siteTagline: body.siteTagline,
      logoUrl: body.logoUrl,
      mainPhone: body.mainPhone,
      telegramUrl: body.telegramUrl,
      whatsappUrl: body.whatsappUrl,
      email: body.email,
      headerMenu: body.headerMenu,
      footerText: body.footerText,
      defaultSeo: body.defaultSeo,
    },
  });

  revalidatePath('/', 'layout');

  return NextResponse.json({ success: true, settings: updated });
}
