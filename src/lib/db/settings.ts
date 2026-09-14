import prisma from '@/lib/prisma';

export interface SiteSettingsData {
  id: string;
  siteName: string;
  siteTagline: string | null;
  logoUrl: string | null;
  mainPhone: string | null;
  telegramUrl: string | null;
  whatsappUrl: string | null;
  email: string | null;
  headerMenu: Array<{ href: string; label: string }>;
  footerText: string | null;
  defaultSeo: {
    title?: string;
    description?: string;
    keywords?: string;
  } | null;
}

const DEFAULT_SETTINGS: SiteSettingsData = {
  id: 'global',
  siteName: 'ТАВ',
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
  footerText:
    'Спешелти кофе свежей обжарки. Отборные микролоты с высокогорных плантаций Эфиопии, Колумбии, Кении и Гватемалы, дрип-пакеты в среде азота и бесплатный помол в Майкопе.',
  defaultSeo: {
    title: 'ТАВ — Спешелти кофе свежей обжарки',
    description: 'Отборный спешелти кофе со всего мира в Майкопе.',
  },
};

/**
 * Fetch global site settings from DB
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          id: DEFAULT_SETTINGS.id,
          siteName: DEFAULT_SETTINGS.siteName,
          siteTagline: DEFAULT_SETTINGS.siteTagline || undefined,
          logoUrl: DEFAULT_SETTINGS.logoUrl || undefined,
          mainPhone: DEFAULT_SETTINGS.mainPhone || undefined,
          telegramUrl: DEFAULT_SETTINGS.telegramUrl || undefined,
          whatsappUrl: DEFAULT_SETTINGS.whatsappUrl || undefined,
          email: DEFAULT_SETTINGS.email || undefined,
          headerMenu: DEFAULT_SETTINGS.headerMenu,
          footerText: DEFAULT_SETTINGS.footerText || undefined,
          defaultSeo: (DEFAULT_SETTINGS.defaultSeo as any) || undefined,
        },
      });
    }

    return {
      id: settings.id,
      siteName: settings.siteName || DEFAULT_SETTINGS.siteName,
      siteTagline: settings.siteTagline,
      logoUrl: settings.logoUrl || DEFAULT_SETTINGS.logoUrl,
      mainPhone: settings.mainPhone || DEFAULT_SETTINGS.mainPhone,
      telegramUrl: settings.telegramUrl || DEFAULT_SETTINGS.telegramUrl,
      whatsappUrl: settings.whatsappUrl || DEFAULT_SETTINGS.whatsappUrl,
      email: settings.email || DEFAULT_SETTINGS.email,
      headerMenu: Array.isArray(settings.headerMenu) && (settings.headerMenu as any[]).length > 0
        ? (settings.headerMenu as any)
        : DEFAULT_SETTINGS.headerMenu,
      footerText: settings.footerText || DEFAULT_SETTINGS.footerText,
      defaultSeo: (settings.defaultSeo as any) || DEFAULT_SETTINGS.defaultSeo,
    };
  } catch (error) {
    console.warn('Site settings DB unavailable, using fallback settings');
    return DEFAULT_SETTINGS;
  }
}
