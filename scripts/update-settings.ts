import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateDb() {
  try {
    // 1. Update site setting name to 'ТАВ'
    await prisma.siteSetting.upsert({
      where: { id: 'global' },
      update: {
        siteName: 'ТАВ',
      },
      create: {
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
        footerText: 'Спешелти кофе свежей обжарки в Майкопе.',
      },
    });
    console.log('✅ Updated SiteSetting siteName to ТАВ');

    // 2. Update roast_guide block content
    const coffeePage = await prisma.page.findUnique({
      where: { slug: 'coffee' },
      include: { blocks: true },
    });

    if (coffeePage) {
      const roastBlock = coffeePage.blocks.find((b) => b.blockType === 'roast_guide');
      if (roastBlock) {
        const defaultProfiles = [
          {
            levelKey: 'light',
            title: 'Светлая обжарка (Light)',
            badge: 'Для ценителей',
            subtitle: 'Цветы, бергамот и сочные спелые фрукты',
            description: 'Раскрывает истинный терруар и природную сочность кофейной ягоды.',
            flavorNotes: ['Бергамот', 'Жасмин', 'Белый персик', 'Лайм'],
            recommendedBrew: 'V60 воронка, Кемекс, Аэропресс, Фильтр-кофеварка',
            acidity: 5,
            body: 2,
            sweetness: 4,
            bitterness: 1,
            recommendedProductId: null,
          },
          {
            levelKey: 'medium',
            title: 'Средняя обжарка (Medium)',
            badge: 'Хит & Баланс',
            subtitle: 'Карамель, молочный шоколад и баланс',
            description: 'Самый гармоничный и универсальный профиль.',
            flavorNotes: ['Молочный шоколад', 'Карамель', 'Красное яблоко', 'Фундук'],
            recommendedBrew: 'Гейзерная кофеварка (Moka), Автоматическая кофемашина, Эспрессо',
            acidity: 3,
            body: 4,
            sweetness: 5,
            bitterness: 2,
            recommendedProductId: null,
          },
          {
            levelKey: 'dark',
            title: 'Тёмная обжарка (Dark Espresso)',
            badge: 'Классика',
            subtitle: 'Плотное тело, темный шоколад и какао',
            description: 'Густой, плотный и маслянистый эспрессо-профиль без лишней кислотности.',
            flavorNotes: ['Тёмный шоколад', 'Жареный фундук', 'Патока', 'Какао'],
            recommendedBrew: 'Классический эспрессо, Капучино, Латте, Турка (Джезва)',
            acidity: 1,
            body: 5,
            sweetness: 3,
            bitterness: 4,
            recommendedProductId: null,
          },
        ];

        const existingContent = (roastBlock.content as any) || {};
        await prisma.pageBlock.update({
          where: { id: roastBlock.id },
          data: {
            content: {
              ...existingContent,
              badge: existingContent.badge || 'ГИД ПО ОБЖАРКЕ ТАВ',
              title: existingContent.title || 'Как выбрать идеальную обжарку',
              subtitle:
                existingContent.subtitle ||
                'Каждая степень обжарки создается для раскрытия определенных дескрипторов и методов заваривания.',
              profiles: defaultProfiles,
            },
          },
        });
        console.log('✅ Updated roast_guide block profiles in DB');
      }
    }
  } catch (err) {
    console.error('Error updating DB:', err);
  } finally {
    await prisma.$disconnect();
  }
}

updateDb();
