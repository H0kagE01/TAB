/**
 * Seed default content fields into PageBlocks that are missing required keys.
 * Run: npx ts-node --project tsconfig.json -e "require('./scripts/seed-block-content.ts')"
 * Or add to package.json scripts and run via tsx.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BLOCK_DEFAULTS: Record<string, Record<string, any>> = {
  directions: {
    badge: 'КОЛЛЕКЦИЯ ТАВ',
    headline: 'Кофе для любого настроения',
    headlineHighlight: 'и способа заваривания',
    description: 'От сочных ягодных моносортов под воронку до плотных орехово-шоколадных эспрессо-смесей.',
  },
  collections_grid: {
    badge: 'Тематические сеты',
    title: 'Интересные подборки',
    description: 'Специально подобранные комбинации для легкого старта, кулинарных открытий и подарков.',
  },
  about_snippet: {
    badge: 'Философия ТАВ',
    headline: 'Культура спешелти',
    headlineHighlight: 'и чистота вкуса',
    quote: '«Для ТАВ кофе — это не просто утренний ритуал. Это результат труда фермеров, чистота высокогорного терруара и ювелирная точность обжарки.»',
    description: 'Мы отбираем зеленый кофе только категории Specialty с оценкой SCA от 84 до 89+ баллов. Обжариваем небольшими партиями каждую неделю, чтобы в вашей чашке всегда раскрывался пик аромата и сочности.',
    ctaLabel: 'Узнать больше о ТАВ',
    ctaHref: '/about',
  },
  stores_section: {
    badge: 'Ждём вас в гости',
    headline: 'Пространство ТАВ',
    headlineHighlight: 'в Майкопе',
    description: 'Приходите за выбором свежеобжаренного зерна, дегустацией ароматов моносортов, подбором дрип-пакетов и профессиональным помолом.',
  },
  featured_products_popular: {
    badge: 'Выбор недели',
    title: 'Популярный спешелти кофе',
    subtitle: 'Сбалансированные эспрессо-купажи, яркие моносорта и порционный дрип-кофе, которые выбирают наши гости.',
    actionLabel: 'Смотреть весь каталог',
    actionHref: '/catalog',
  },
  featured_products_new: {
    badge: 'Свежие микролоты',
    title: 'Новинки коллекции ТАВ',
    subtitle: 'Свежие поступления зерна нового урожая, лимитированная анаэробная ферментация и аксессуары для заваривания.',
    actionLabel: 'Все новинки кофе',
    actionHref: '/catalog?isNew=true',
  },
};

async function main() {
  const blocks = await prisma.pageBlock.findMany({
    where: { blockType: { in: Object.keys(BLOCK_DEFAULTS) } },
  });

  console.log(`Found ${blocks.length} blocks to check.`);

  for (const block of blocks) {
    const defaults = BLOCK_DEFAULTS[block.blockType];
    if (!defaults) continue;

    const currentContent = (block.content as Record<string, any>) || {};
    let updated = false;
    const newContent = { ...currentContent };

    for (const [key, defaultValue] of Object.entries(defaults)) {
      if (newContent[key] === undefined || newContent[key] === null || newContent[key] === '') {
        newContent[key] = defaultValue;
        updated = true;
        console.log(`  [${block.blockType}] Setting missing key: ${key}`);
      }
    }

    if (updated) {
      await prisma.pageBlock.update({
        where: { id: block.id },
        data: { content: newContent },
      });
      console.log(`  ✅ Updated block ${block.id} (${block.blockType})`);
    } else {
      console.log(`  ⏭️  Block ${block.id} (${block.blockType}) already has all keys.`);
    }
  }

  console.log('\nDone!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
