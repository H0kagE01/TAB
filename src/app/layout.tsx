import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { Outfit, Plus_Jakarta_Sans, Caveat } from 'next/font/google';
import './globals.css';
import { PublicLayoutShell } from '@/components/common/PublicLayoutShell';
import { getMainStore } from '@/lib/db/stores';
import { getSiteSettings } from '@/lib/db/settings';

const fontSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin', 'cyrillic-ext'],
  display: 'swap',
});

const fontDisplay = Outfit({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const fontScript = Caveat({
  variable: '--font-script',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tav-coffee.ru'),
  title: {
    default: 'ТАВ — Спешелти кофе свежей обжарки',
    template: '%s | ТАВ',
  },
  description:
    'Спешелти кофе свежей обжарки, моносорта, микролоты, авторские эспрессо-бленды, дрип-пакеты и аксессуары для заваривания. Бесплатный помол зерна под любой метод.',
  keywords: [
    'ТАВ',
    'спешелти кофе',
    'зерновой кофе',
    'свежая обжарка',
    'моносорта кофе',
    'микролоты',
    'дрип кофе',
    'дрип-пакеты',
    'Эфиопия Иргачефф',
    'Колумбия кофе',
    'кофе в зернах',
    'кофемолка',
    'Hario V60',
    'Майкоп кофе',
  ],
  authors: [{ name: 'ТАВ' }],
  creator: 'ТАВ',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://tav-coffee.ru',
    title: 'ТАВ — Спешелти кофе свежей обжарки',
    description:
      'Отборное зерно спешелти со всего мира, дрип-пакеты, аксессуары для фильтр-кофе и бесплатный помол.',
    siteName: 'ТАВ',
    images: [
      {
        url: '/images/logo.jpg',
        width: 1200,
        height: 1200,
        alt: 'ТАВ',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mainStore, siteSettings] = await Promise.all([
    getMainStore(),
    getSiteSettings(),
  ]);

  return (
    <html
      lang="ru"
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontScript.variable} dark`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-[#0E0A08] text-[#F3EFE9] selection:bg-[#B88B58] selection:text-white overflow-x-clip w-full relative">
        <PublicLayoutShell primaryStore={mainStore} siteSettings={siteSettings}>
          {children}
        </PublicLayoutShell>
      </body>
    </html>
  );
}

