/**
 * Ensure all site pages exist in the DB pages table.
 * Run: npx tsx scripts/seed-pages.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PAGES = [
  {
    slug: 'home',
    title: 'Главная страница',
    seoTitle: 'ТАВ — Спешелти кофе свежей обжарки в Майкопе | Каталог и дрип-пакеты',
    seoDescription: 'Спешелти кофе свежей еженедельной обжарки от ТАВ: моносорта из Эфиопии, Колумбии, Кении, фирменные эспрессо-купажи и порционные дрип-пакеты в Майкопе.',
  },
  {
    slug: 'catalog',
    title: 'Каталог кофе',
    seoTitle: 'Каталог спешелти кофе | ТАВ',
    seoDescription: 'Полная коллекция кофе ТАВ: моносорта, микролоты свежей обжарки, эспрессо-бленды, дрип-пакеты и профессиональные аксессуары Hario и Timemore.',
  },
  {
    slug: 'coffee',
    title: 'Зерновой кофе',
    seoTitle: 'Зерновой кофе & Дрип-пакеты — Спешелти свежей обжарки | ТАВ',
    seoDescription: 'Отборный спешелти кофе со всего мира: Эфиопия, Колумбия, Кения, Коста-Рика, Бразилия, Гватемала. Светлая, средняя и тёмная обжарка, дрип-пакеты, бесплатный помол в ТАВ.',
  },
  {
    slug: 'about',
    title: 'О бренде ТАВ',
    seoTitle: 'О бренде ТАВ — Культура спешелти кофе в Майкопе',
    seoDescription: 'История и философия ТАВ: почему мы сосредоточились на спешелти кофе свежей обжарки, выборе редких микролотов и культуре заваривания в Майкопе.',
  },
  {
    slug: 'contacts',
    title: 'Контакты',
    seoTitle: 'Контакты и пространство в Майкопе | ТАВ',
    seoDescription: 'Адрес, телефон и режим работы флагманского пространства ТАВ в Майкопе: ул. К.А. Васильева, 2/1.',
  },
  {
    slug: 'privacy',
    title: 'Политика конфиденциальности',
    seoTitle: 'Политика конфиденциальности | ТАВ',
    seoDescription: 'Политика конфиденциальности ТАВ Coffee.',
  },
];

async function main() {
  console.log('Seeding pages...');

  for (const pageData of PAGES) {
    const existing = await prisma.page.findUnique({ where: { slug: pageData.slug } });

    if (existing) {
      console.log(`  ⏭️  Page "${pageData.slug}" already exists.`);
    } else {
      await prisma.page.create({
        data: {
          slug: pageData.slug,
          title: pageData.title,
          seoTitle: pageData.seoTitle,
          seoDescription: pageData.seoDescription,
          isPublished: true,
        },
      });
      console.log(`  ✅ Created page "${pageData.slug}"`);
    }
  }

  console.log('\nDone!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
