import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Stage 2 blocks in PostgreSQL...');

  // 1. Fetch available products and countries
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, title: true, coffeeSpecs: { select: { roastLevel: true } } },
  });
  console.log(`Found ${products.length} products in DB.`);

  const countries = await prisma.country.findMany();
  console.log(`Found ${countries.length} countries in DB.`);

  const ethiopiaProd = products.find((p) => p.slug.includes('ethiopia') || p.title.includes('Ethiopia')) || products[0];
  const colombiaProd = products.find((p) => p.slug.includes('colombia') || p.title.includes('Colombia')) || products[1] || products[0];
  const brazilProd = products.find((p) => p.slug.includes('brazil') || p.title.includes('Brazil')) || products[2] || products[0];
  const guatemalaProd = products.find((p) => p.slug.includes('guatemala') || p.title.includes('Guatemala')) || products[3] || products[0];

  const ethiopiaCountry = countries.find((c) => c.code === 'ET' || c.name.includes('Эфиопия')) || countries[0];
  const colombiaCountry = countries.find((c) => c.code === 'CO' || c.name.includes('Колумбия')) || countries[1] || countries[0];
  const brazilCountry = countries.find((c) => c.code === 'BR' || c.name.includes('Бразилия')) || countries[2] || countries[0];
  const guatemalaCountry = countries.find((c) => c.code === 'GT' || c.name.includes('Гватемала')) || countries[3] || countries[0];

  // 2. Coffee Page Blocks
  const coffeePage = await prisma.page.findUnique({ where: { slug: 'coffee' } });
  if (coffeePage) {
    // 2.1. Roast Guide Block
    const existingRoastGuide = await prisma.pageBlock.findFirst({
      where: { pageId: coffeePage.id, blockType: 'roast_guide' },
    });

    const roastGuideContent = {
      badge: 'СПЕКТР ОБЖАРКИ ТАВ',
      title: 'Интерактивный гид по профилям обжарки',
      subtitle: 'Подберите кофе по характеру вкуса и вашему любимому методу приготовления',
      description: 'Мы разрабатываем индивидуальный температурный профиль для каждого микролота, чтобы подчеркнуть его сильные стороны.',
      profiles: [
        {
          levelKey: 'light',
          title: 'Светлая обжарка (Light)',
          badge: 'Для ценителей',
          subtitle: 'Цветы, бергамот и сочные спелые фрукты',
          description: 'Раскрывает истинный терруар и природную сочность кофейной ягоды. Деликатная фруктово-цветочная кислотность, легкость тела и чистейшее послевкусие жасмина и персика.',
          flavorNotes: ['Бергамот', 'Жасмин', 'Белый персик', 'Лайм'],
          recommendedBrew: 'V60 воронка, Кемекс, Аэропресс, Фильтр-кофеварка',
          acidity: 5,
          body: 2,
          sweetness: 4,
          bitterness: 1,
          recommendedProductId: ethiopiaProd?.id || null,
        },
        {
          levelKey: 'medium',
          title: 'Средняя обжарка (Medium)',
          badge: 'Хит & Баланс',
          subtitle: 'Карамель, молочный шоколад и баланс',
          description: 'Самый гармоничный и универсальный профиль. Умеренная сладкая кислотность красного яблока плавно перетекает в карамель, пралине и молочный шоколад.',
          flavorNotes: ['Молочный шоколад', 'Карамель', 'Красное яблоко', 'Фундук'],
          recommendedBrew: 'Гейзерная кофеварка (Moka), Автоматическая кофемашина, Чашка, Эспрессо',
          acidity: 3,
          body: 4,
          sweetness: 5,
          bitterness: 2,
          recommendedProductId: colombiaProd?.id || null,
        },
        {
          levelKey: 'dark',
          title: 'Тёмная обжарка (Dark Espresso)',
          badge: 'Классика',
          subtitle: 'Плотное тело, темный шоколад и какао',
          description: 'Густой, плотный и маслянистый эспрессо-профиль без лишней кислотности. Богатые ноты жареных орехов, горького шоколада, тростникового сахара и дымных пряностей.',
          flavorNotes: ['Тёмный шоколад', 'Жареный фундук', 'Патока', 'Какао'],
          recommendedBrew: 'Классический эспрессо, Капучино, Латте, Турка (Джезва)',
          acidity: 1,
          body: 5,
          sweetness: 3,
          bitterness: 4,
          recommendedProductId: brazilProd?.id || null,
        },
      ],
    };

    if (existingRoastGuide) {
      await prisma.pageBlock.update({
        where: { id: existingRoastGuide.id },
        data: {
          name: 'Гид по обжарке',
          content: roastGuideContent,
        },
      });
      console.log('  ✅ Updated block "roast_guide" on coffee page.');
    } else {
      await prisma.pageBlock.create({
        data: {
          pageId: coffeePage.id,
          blockType: 'roast_guide',
          name: 'Гид по обжарке',
          order: 2,
          isActive: true,
          content: roastGuideContent,
        },
      });
      console.log('  ✅ Created block "roast_guide" on coffee page.');
    }

    // 2.2. Terroir Atlas Block
    const existingTerroir = await prisma.pageBlock.findFirst({
      where: { pageId: coffeePage.id, blockType: 'terroir_atlas' },
    });

    const terroirAtlasContent = {
      badge: 'ГЕОГРАФИЯ И ТЕРРУАРЫ',
      title: 'Атлас терруаров спешелти зерна',
      subtitle: 'От высокогорных плантаций Восточной Африки до вулканических почв Анд',
      description: 'Каждый регион произрастания наделяет зерно неповторимым вкусовым профилем, сформированным высотой, климатом и микроклиматом фермы.',
      items: [
        {
          id: 'ethiopia-yirgacheffe',
          countryId: ethiopiaCountry?.id || 'country-et',
          region: 'Иргачиф (Yirgacheffe)',
          continent: 'Восточная Африка',
          altitude: '1900 – 2200 м',
          process: 'Мытая обработка (Washed)',
          sommelierNotes: 'Колыбель кофе и эталон высокогорной мытой арабики. Исключительно чистый, легкий и искрящийся напиток с благородным букетом белого жасмина, бергамота и спелого белого персика.',
          flavorNotes: ['Бергамот', 'Жасмин', 'Белый персик', 'Лайм'],
          imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=1200&auto=format&fit=crop',
          productId: ethiopiaProd?.id || null,
          order: 1,
          isActive: true,
        },
        {
          id: 'colombia-huila',
          countryId: colombiaCountry?.id || 'country-co',
          region: 'Уила (Huila)',
          continent: 'Южная Америка',
          altitude: '1600 – 1900 м',
          process: 'Мытая обработка (Washed)',
          sommelierNotes: 'Золотой стандарт мирового кофейного баланса. Богатая вулканическая почва Анд дарит сорту деликатную яблочную сочность, плавно переходящую в густой молочный шоколад и карамель.',
          flavorNotes: ['Молочный шоколад', 'Карамель', 'Красное яблоко', 'Фундук'],
          imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
          productId: colombiaProd?.id || null,
          order: 2,
          isActive: true,
        },
        {
          id: 'brazil-cerrado',
          countryId: brazilCountry?.id || 'country-br',
          region: 'Серрадо Минейро (Cerrado)',
          continent: 'Южная Америка',
          altitude: '900 – 1100 м',
          process: 'Натуральная сушка (Natural)',
          sommelierNotes: 'Канонический плотный эспрессо-профиль. Сушка кофейной ягоды прямо под жарким бразильским солнцем создает бархатистое ореховое тело с нотами темного шоколада, какао и патоки.',
          flavorNotes: ['Тёмный шоколад', 'Жареный фундук', 'Патока', 'Какао'],
          imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=1200&auto=format&fit=crop',
          productId: brazilProd?.id || null,
          order: 3,
          isActive: true,
        },
        {
          id: 'guatemala-antigua',
          countryId: guatemalaCountry?.id || 'country-gt',
          region: 'Антигуа (Antigua)',
          continent: 'Центральная Америка',
          altitude: '1500 – 1800 м',
          process: 'Мытая обработка (Washed)',
          sommelierNotes: 'Микролот с подножия трех действующих вулканов. Отличается сложным пряным букетом, в котором спелая сочная вишня гармонирует с кардамоном и благородным горьким какао.',
          flavorNotes: ['Спелая вишня', 'Кардамон', 'Темное какао', 'Цитрус'],
          imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop',
          productId: guatemalaProd?.id || null,
          order: 4,
          isActive: true,
        },
      ],
    };

    if (existingTerroir) {
      await prisma.pageBlock.update({
        where: { id: existingTerroir.id },
        data: {
          name: 'Атлас терруаров',
          content: terroirAtlasContent,
        },
      });
      console.log('  ✅ Updated block "terroir_atlas" on coffee page.');
    } else {
      await prisma.pageBlock.create({
        data: {
          pageId: coffeePage.id,
          blockType: 'terroir_atlas',
          name: 'Атлас терруаров',
          order: 3,
          isActive: true,
          content: terroirAtlasContent,
        },
      });
      console.log('  ✅ Created block "terroir_atlas" on coffee page.');
    }
  }

  // 3. Contacts Page Blocks
  const contactsPage = await prisma.page.findUnique({ where: { slug: 'contacts' } });
  if (contactsPage) {
    // 3.1. Boutique Showcase Block (Showroom)
    const existingShowcase = await prisma.pageBlock.findFirst({
      where: { pageId: contactsPage.id, blockType: 'boutique_showcase' },
    });

    const boutiqueShowcaseContent = {
      badge: 'ПРОСТРАНСТВО ТАВ',
      title: 'Интерьер и витрины концепт-стора',
      subtitle: 'Уютная кофейная локация в Майкопе',
      zones: [
        {
          id: 'facade',
          label: '🏛️ Фасад & Вход',
          title: 'Главный вход и парковка',
          desc: 'Удобный подъезд с улицы Васильева, бесплатная автостоянка прямо перед входом.',
          image: '/images/store-maykop.jpg',
          order: 1,
          isActive: true,
        },
        {
          id: 'interior',
          label: '☕ Зона спешелти кофе',
          title: 'Кофейная витрина и дегустация',
          desc: 'Коллекция свежеобжаренных зерен ТАВ, образцы ароматов и зона бесплатного жернового помола.',
          image: '/images/store-maykop-interior.jpg',
          order: 2,
          isActive: true,
        },
        {
          id: 'drip',
          label: '📦 Дрип-бар & Аксессуары',
          title: 'Дрип-пакеты и аксессуары Hario & Timemore',
          desc: 'Порционный кофе в индивидуальных саше с азотом, керамические воронки V60, ручные кофемолки и фильтры.',
          image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop',
          order: 3,
          isActive: true,
        },
      ],
    };

    if (existingShowcase) {
      await prisma.pageBlock.update({
        where: { id: existingShowcase.id },
        data: {
          name: 'Витрины и интерьер шоурума',
          content: boutiqueShowcaseContent,
        },
      });
      console.log('  ✅ Updated block "boutique_showcase" on contacts page.');
    } else {
      await prisma.pageBlock.create({
        data: {
          pageId: contactsPage.id,
          blockType: 'boutique_showcase',
          name: 'Витрины и интерьер шоурума',
          order: 2,
          isActive: true,
          content: boutiqueShowcaseContent,
        },
      });
      console.log('  ✅ Created block "boutique_showcase" on contacts page.');
    }

    // 3.2. Concierge Terminal Block (Inquiry Topics)
    const existingConcierge = await prisma.pageBlock.findFirst({
      where: { pageId: contactsPage.id, blockType: 'concierge_terminal' },
    });

    const conciergeTerminalContent = {
      badge: 'ЭКСПРЕСС-ПОДГОТОВКА',
      title: 'Смолоть зерно или собрать дрип-сет к визиту?',
      subtitle: 'Подготовим заказ к вашему приезду в чате с консультантом',
      description: 'Выберите тему, укажите ваши пожелания, и мы подготовим заказ к вашему приезду в чате с консультантом.',
      topics: [
        {
          id: 'coffee',
          label: '☕ Смолоть кофе',
          title: 'Подготовить и смолоть кофе к приезду',
          placeholder: 'Например: Смолоть 250г Эфиопии Иргачефф под фильтр V60 к 18:30...',
          iconKey: 'coffee',
          order: 1,
          isActive: true,
        },
        {
          id: 'drip',
          label: '📦 Дрип-боксы',
          title: 'Забронировать набор дрип-кофе',
          placeholder: 'Например: Отложить 2 коробки ТАВ Drip Box Mix 10 шт...',
          iconKey: 'drip',
          order: 2,
          isActive: true,
        },
        {
          id: 'b2b',
          label: '💼 Опт & HoReCa',
          title: 'Оптовые поставки спешелти кофе и B2B',
          placeholder: 'Например: Интересует оптовый прайс ТАВ и условия поставки зерна в кофейню / офис...',
          iconKey: 'b2b',
          order: 3,
          isActive: true,
        },
        {
          id: 'other',
          label: '❓ Вопрос бариста',
          title: 'Задать персональный вопрос по зерну и завариванию',
          placeholder: 'Напишите ваш вопрос по обжарке, помолу или способам заваривания...',
          iconKey: 'other',
          order: 4,
          isActive: true,
        },
      ],
    };

    if (existingConcierge) {
      await prisma.pageBlock.update({
        where: { id: existingConcierge.id },
        data: {
          name: 'Терминал быстрого заказа и тем',
          content: conciergeTerminalContent,
        },
      });
      console.log('  ✅ Updated block "concierge_terminal" on contacts page.');
    } else {
      await prisma.pageBlock.create({
        data: {
          pageId: contactsPage.id,
          blockType: 'concierge_terminal',
          name: 'Терминал быстрого заказа и тем',
          order: 3,
          isActive: true,
          content: conciergeTerminalContent,
        },
      });
      console.log('  ✅ Created block "concierge_terminal" on contacts page.');
    }
  }

  console.log('\nStage 2 Seeding completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
