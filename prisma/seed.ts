import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { mockCategories } from '../src/lib/mock-data/categories';
import { mockCountries } from '../src/lib/mock-data/countries';
import { mockBrands } from '../src/lib/mock-data/brands';
import { mockStores } from '../src/lib/mock-data/stores';
import { mockCollections } from '../src/lib/mock-data/collections';
import { mockProducts } from '../src/lib/mock-data/products';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clear existing data in reverse order of foreign keys
  await prisma.inquiryItem.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.coffeeSpecs.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.country.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.pageBlock.deleteMany();
  await prisma.page.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 2. Seed Admin User
  const passwordHash = await bcrypt.hash('admin123456', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tav-coffee.ru',
      passwordHash,
      name: 'Администратор ТАВ',
      role: 'ADMIN',
    },
  });
  console.log(`👤 Created admin user: ${admin.email} (password: admin123456)`);

  // 3. Seed Categories
  for (const cat of mockCategories) {
    await prisma.category.create({
      data: {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        shortDescription: cat.shortDescription,
        longDescription: cat.longDescription,
        imageUrl: cat.imageUrl,
        accentColor: cat.accentColor,
        order: cat.order,
        isActive: true,
      },
    });
  }
  console.log(`📂 Seeded ${mockCategories.length} categories.`);

  // 4. Seed Countries
  for (const country of mockCountries) {
    await prisma.country.create({
      data: {
        id: country.id,
        code: country.code,
        name: country.name,
        slug: country.slug,
        flagEmoji: country.flagEmoji,
      },
    });
  }
  console.log(`🌍 Seeded ${mockCountries.length} countries.`);

  // 5. Seed Brands
  for (const brand of mockBrands) {
    await prisma.brand.create({
      data: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        countryId: brand.countryId || null,
      },
    });
  }
  console.log(`🏷️ Seeded ${mockBrands.length} brands.`);

  // 6. Seed Stores
  for (const store of mockStores) {
    await prisma.store.create({
      data: {
        id: store.id,
        name: store.name,
        city: store.city,
        address: store.address,
        phone: store.phone,
        formattedPhone: store.formattedPhone,
        workingHours: store.workingHours,
        latitude: store.coordinates.lat,
        longitude: store.coordinates.lng,
        photoUrl: store.photoUrl,
        isMain: store.isMain ?? false,
        description: store.description,
      },
    });
  }
  console.log(`📍 Seeded ${mockStores.length} stores.`);

  // 7. Seed Products & Coffee Specs
  for (let i = 0; i < mockProducts.length; i++) {
    const prod = mockProducts[i];
    
    // Map category string slug if id is not directly formatted
    let categoryId = prod.category;
    if (!categoryId.startsWith('cat-')) {
      const matchedCat = mockCategories.find((c) => c.slug === prod.category);
      if (matchedCat) categoryId = matchedCat.id;
    }

    const createdProduct = await prisma.product.create({
      data: {
        id: prod.id,
        slug: prod.slug,
        title: prod.title,
        categoryId,
        brandId: prod.brandId || null,
        countryId: prod.countryId || null,
        price: prod.price,
        inStock: prod.inStock,
        stockCount: prod.stockCount ?? 20,
        shortDescription: prod.shortDescription,
        description: prod.description,
        images: prod.images,
        isNew: prod.isNew ?? false,
        isPopular: prod.isPopular ?? false,
        isFeatured: prod.isFeatured ?? false,
        order: i + 1,
        publishedAt: new Date(prod.publishedAt),
      },
    });

    if (prod.coffeeSpecs) {
      await prisma.coffeeSpecs.create({
        data: {
          productId: createdProduct.id,
          variety: prod.coffeeSpecs.variety,
          roastLevel: prod.coffeeSpecs.roastLevel,
          processing: prod.coffeeSpecs.processing,
          altitude: prod.coffeeSpecs.altitude,
          qScore: prod.coffeeSpecs.qScore ?? null,
          flavorNotes: prod.coffeeSpecs.flavorNotes ? (prod.coffeeSpecs.flavorNotes as any) : [],
          recommendedBrew: prod.coffeeSpecs.recommendedBrew ? (prod.coffeeSpecs.recommendedBrew as any) : [],
          acidity: prod.coffeeSpecs.acidity ?? null,
          sweetness: prod.coffeeSpecs.sweetness ?? null,
          bitterness: prod.coffeeSpecs.bitterness ?? null,
          body: prod.coffeeSpecs.body ?? null,
          weightGrams: prod.coffeeSpecs.weight ?? 250,
          dripCount: prod.coffeeSpecs.count ?? null,
          recipe: prod.coffeeSpecs.recipe ? (prod.coffeeSpecs.recipe as any) : null,
        },
      });
    }
  }
  console.log(`☕ Seeded ${mockProducts.length} products with coffee specs.`);

  // 8. Seed Collections & Relationships
  for (let i = 0; i < mockCollections.length; i++) {
    const col = mockCollections[i];
    const createdCollection = await prisma.collection.create({
      data: {
        id: col.id,
        slug: col.slug,
        title: col.title,
        description: col.description,
        badgeText: col.badgeText,
        coverImage: col.coverImage,
        order: i + 1,
      },
    });

    for (let pIdx = 0; pIdx < col.productIds.length; pIdx++) {
      const pId = col.productIds[pIdx];
      // ensure product exists
      const pExists = mockProducts.some((p) => p.id === pId);
      if (pExists) {
        await prisma.collectionProduct.create({
          data: {
            collectionId: createdCollection.id,
            productId: pId,
            order: pIdx + 1,
          },
        });
      }
    }
  }
  console.log(`📦 Seeded ${mockCollections.length} collections with product links.`);

  // 9. Seed Global Site Settings
  await prisma.siteSetting.create({
    data: {
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
      footerText: 'Спешелти кофе свежей обжарки. Отборные микролоты с высокогорных плантаций Эфиопии, Колумбии, Кении и Гватемалы, дрип-пакеты в среде азота и бесплатный помол в Майкопе.',
      defaultSeo: {
        title: 'ТАВ — Спешелти кофе свежей обжарки | Майкоп',
        description: 'Отборное зерно со всего мира, свежая еженедельная обжарка, дрип-кофе и аксессуары для заваривания в Майкопе.',
      },
    },
  });
  console.log('⚙️ Seeded global site settings.');

  // 10. Seed Pages & Dynamic Blocks (Page Builder)
  
  // A. HOME PAGE
  const homePage = await prisma.page.create({
    data: {
      slug: 'home',
      title: 'Главная страница',
      seoTitle: 'ТАВ — Спешелти кофе свежей обжарки в Майкопе | Каталог и дрип-пакеты',
      seoDescription: 'Спешелти кофе свежей еженедельной обжарки от ТАВ: моносорта из Эфиопии, Колумбии, Кении, фирменные эспрессо-купажи и порционные дрип-пакеты в Майкопе.',
      isPublished: true,
    },
  });

  await prisma.pageBlock.createMany({
    data: [
      {
        pageId: homePage.id,
        blockType: 'hero',
        name: 'Первый экран (Hero)',
        order: 1,
        isActive: true,
        content: {
          badge: 'SPECIALTY COFFEE ROASTERS • МАЙКОП',
          headline: 'Спешелти кофе свежей обжарки',
          headlineAccent: 'в Майкопе',
          cursiveSubtitle: 'От терруара к совершенной чашке',
          description: 'Отборные микролоты со всего мира. Еженедельная обжарка, раскрывающая истинный профиль зерна, и бесплатный помол.',
          primaryButton: { label: 'Каталог кофе', href: '/catalog' },
          secondaryButton: { label: 'О бренде ТАВ', href: '/about' },
          metrics: [
            { value: '100%', label: 'Спешелти Арабика' },
            { value: '84–89+', label: 'Баллы SCA' },
            { value: '0 ₽', label: 'Помол в подарок' },
          ],
        },
      },
      {
        pageId: homePage.id,
        blockType: 'directions',
        name: 'Направления кофе ТАВ',
        order: 2,
        isActive: true,
        content: {
          badge: 'КОЛЛЕКЦИЯ ТАВ',
          title: 'Кофе для любого настроения и способа заваривания',
          subtitle: 'От сочных ягодных моносортов под воронку до плотных орехово-шоколадных эспрессо-смесей.',
        },
      },
      {
        pageId: homePage.id,
        blockType: 'featured_products_popular',
        name: 'Популярный спешелти кофе',
        order: 3,
        isActive: true,
        content: {
          badge: 'Выбор недели',
          title: 'Популярный спешелти кофе',
          subtitle: 'Сбалансированные эспрессо-купажи, яркие моносорта и порционный дрип-кофе, которые выбирают наши гости.',
          actionLabel: 'Смотреть весь каталог',
          actionHref: '/catalog',
          limit: 6,
        },
      },
      {
        pageId: homePage.id,
        blockType: 'featured_products_new',
        name: 'Новинки коллекции ТАВ',
        order: 4,
        isActive: true,
        content: {
          badge: 'Свежие микролоты',
          title: 'Новинки коллекции ТАВ',
          subtitle: 'Свежие поступления зерна нового урожая, лимитированная анаэробная ферментация и аксессуары для заваривания.',
          actionLabel: 'Все новинки кофе',
          actionHref: '/catalog?isNew=true',
          limit: 6,
        },
      },
      {
        pageId: homePage.id,
        blockType: 'collections_grid',
        name: 'Тематические подборки',
        order: 5,
        isActive: true,
        content: {
          badge: 'ПОДБОРКИ ТАВ',
          title: 'Кофе под ваш вкус и метод',
          subtitle: 'Специально сгруппированные наборы для фильтра, эспрессо и путешествий.',
        },
      },
      {
        pageId: homePage.id,
        blockType: 'about_snippet',
        name: 'О философии ТАВ',
        order: 6,
        isActive: true,
        content: {
          badge: 'ФИЛОСОФИЯ ТАВ',
          title: '«Мы обжариваем зерно так, чтобы раскрыть его природный характер»',
          description: 'Кофе — это сложная вкусовая палитра. Мы подбираем индивидуальный профиль обжарки для каждого мешка зеленого кофе, сохраняя баланс природной сладости, плотности и тонкой кислотности.',
          actionLabel: 'Узнать больше о нас',
          actionHref: '/about',
        },
      },
      {
        pageId: homePage.id,
        blockType: 'stores_section',
        name: 'Где нас найти (Локация и Карта)',
        order: 7,
        isActive: true,
        content: {
          badge: 'ПРОСТРАНСТВО ТАВ',
          title: 'Ждем вас на дегустацию в Майкопе',
          subtitle: 'Приходите вдохнуть ароматы свежей обжарки, выбрать зерно или забрать онлайн-заказ.',
        },
      },
    ],
  });

  // B. ABOUT PAGE
  const aboutPage = await prisma.page.create({
    data: {
      slug: 'about',
      title: 'О бренде ТАВ',
      seoTitle: 'О бренде ТАВ — Культура спешелти кофе в Майкопе',
      seoDescription: 'История и философия ТАВ: почему мы сосредоточились на спешелти кофе свежей обжарки, выборе редких микролотов и культуре заваривания в Майкопе.',
      isPublished: true,
    },
  });

  await prisma.pageBlock.createMany({
    data: [
      {
        pageId: aboutPage.id,
        blockType: 'hero',
        name: 'Hero «О бренде»',
        order: 1,
        isActive: true,
        content: {
          badge: 'ТАВ • SPECIALTY COFFEE ROASTERS',
          headline: '«Мы обжариваем зерно так, чтобы раскрыть его истинную природу»',
          description: 'ТАВ — это пространство, где кофе рассматривается как искусство. От тщательного отбора зеленого зерна на фермах до ювелирной калибровки профиля обжарки на ростере.',
          metrics: [
            { value: '100%', label: 'Спешелти Арабика' },
            { value: '84–89+', label: 'Баллы SCA' },
            { value: '0 ₽', label: 'Помол в подарок' },
          ],
        },
      },
      {
        pageId: aboutPage.id,
        blockType: 'philosophy',
        name: 'Философия обжарки',
        order: 2,
        isActive: true,
        content: {
          badge: 'ФИЛОСОФИЯ ОБЖАРКИ ТАВ',
          title: 'Чистый вкус зерна без компромиссов',
          description1: 'Кофе — это живая ягода, отражающая климат, почву и высоту произрастания. Мы не прячем дефекты сырья за сверхтёмной обжаркой, а подбираем профили, подчеркивающие природную сладость, сочную кислотность и букет дескрипторов.',
          description2: 'Каждый лот в коллекции ТАВ проходит многократные дегустации (каппинги) и получает подробный вкусовой паспорт с оценкой SCA.',
        },
      },
      {
        pageId: aboutPage.id,
        blockType: 'standards',
        name: '3 правила бренда ТАВ',
        order: 3,
        isActive: true,
        content: {
          badge: 'СТАНДАРТЫ КАЧЕСТВА ТАВ',
          title: '3 правила бренда ТАВ',
          subtitle: 'От строгого отбора зеленого сырья до упаковки и помола зерна в присутствии гостя.',
          rules: [
            {
              number: '01',
              badge: 'SCA 84–89+',
              title: 'Только 100% Спешелти зерно',
              description: 'Никакой коммерческой робусты и дефектного зерна. Мы работаем с лотами с прозрачным происхождением и подтвержденной историей фермы.',
            },
            {
              number: '02',
              badge: 'До 14 дней',
              title: 'Свежесть и контроль обжарки',
              description: 'Обжариваем небольшими партиями каждую неделю. Пакеты с односторонним дегазационным клапаном сохраняют сочные эфирные масла.',
            },
            {
              number: '03',
              badge: 'Бесплатно 0 ₽',
              title: 'Профессиональный помол',
              description: 'Мы бесплатно смолем зерно под ваш метод (турка, эспрессо, гейзер, воронка V60, френч-пресс) прямо при вас.',
            },
          ],
        },
      },
      {
        pageId: aboutPage.id,
        blockType: 'callout_banner',
        name: 'Баннер приглашения в кофейню',
        order: 4,
        isActive: true,
        content: {
          badge: 'ПРОСТРАНСТВО ТАВ В МАЙКОПЕ',
          title: 'Ждем вас на дегустацию свежего зерна',
          description: 'Приходите вдохнуть ароматы свежей обжарки, подобрать дрип-кофе и аксессуары или забрать онлайн-заказ.',
          buttonPrimary: { label: 'Контакты и адрес', href: '/contacts' },
          buttonSecondary: { label: 'Каталог кофе', href: '/catalog' },
        },
      },
    ],
  });

  // C. COFFEE PAGE
  const coffeePage = await prisma.page.create({
    data: {
      slug: 'coffee',
      title: 'Зерновой кофе & Дрипы',
      seoTitle: 'Зерновой кофе & Дрип-пакеты — Спешелти свежей обжарки | ТАВ',
      seoDescription: 'Отборный спешелти кофе со всего мира: Эфиопия, Колумбия, Кения, Коста-Рика, Бразилия, Гватемала. Светлая, средняя и тёмная обжарка, дрип-пакеты, бесплатный помол в ТАВ.',
      isPublished: true,
    },
  });

  await prisma.pageBlock.createMany({
    data: [
      {
        pageId: coffeePage.id,
        blockType: 'hero',
        name: 'Hero страницы Кофе',
        order: 1,
        isActive: true,
        content: {
          badge: '100% Specialty Arabica • Свежая обжарка ТАВ',
          headline: 'Коллекция спешелти кофе ТАВ',
          cursiveSubtitle: 'От цветочной Эфиопии до бархатной Бразилии',
          description: 'Микролоты отборного зерна со всего мира для ценителей чистого вкуса. Индивидуальные профили обжарки, раскрывающие уникальный терруар, и бесплатный помол в Майкопе.',
          metrics: [
            { value: 'до 14 дней', label: 'Свежая обжарка' },
            { value: 'Q 84–89+', label: 'SCA Грейдинг' },
            { value: '0 ₽', label: 'Помол в подарок' },
          ],
        },
      },
      {
        pageId: coffeePage.id,
        blockType: 'roast_guide',
        name: 'Гид по степеням обжарки',
        order: 2,
        isActive: true,
        content: {
          badge: 'ГИД ПО ОБЖАРКЕ ТАВ',
          title: 'Как выбрать идеальную обжарку',
          subtitle: 'Каждая степень обжарки создается для раскрытия определенных дескрипторов и методов заваривания.',
        },
      },
      {
        pageId: coffeePage.id,
        blockType: 'terroir_atlas',
        name: 'Атлас терруаров',
        order: 3,
        isActive: true,
        content: {
          badge: 'География микролотов',
          title: 'Мировые терруары в коллекции ТАВ',
          subtitle: 'Выберите регион происхождения, чтобы исследовать высоту произрастания, метод обработки и уникальный вкусовой букет кофейного зерна.',
        },
      },
      {
        pageId: coffeePage.id,
        blockType: 'grinding_station',
        name: 'Бесплатный помол зерна',
        order: 4,
        isActive: true,
        content: {
          badge: 'Сервис в Майкопе • ул. К.А. Васильева, 2/1',
          headline: 'Бесплатный помол зерна',
          headlineHighlight: 'под ваш способ заваривания',
          description:
            'При покупке любого сорта мы бесплатно смолем зерно прямо в магазине под ваш любимый девайс — от пудры для джезвы до френч-пресса.',
          feature1: {
            title: 'Жернова Fiorenzato',
            desc: 'Без перегрева и пыли.',
          },
          feature2: {
            title: 'Помол за 60 секунд',
            desc: 'Свежий помол при вас.',
          },
          methods: [
            {
              number: '01',
              title: 'Турка (Джезва)',
              subtitle: 'Экстра-тонкий (пыль)',
              fraction: '≈ 0.1 мм',
              desc: 'Помол в нежнейшую пудру для плотного напитка с густой бархатистой пенкой.',
              time: '2–3 мин',
            },
            {
              number: '02',
              title: 'Эспрессо',
              subtitle: 'Тонкий калиброванный',
              fraction: '≈ 0.3 мм',
              desc: 'Фракция под давление 9 бар рожковой или автоматической кофемашины.',
              time: '25–30 сек',
            },
            {
              number: '03',
              title: 'Гейзер (Moka)',
              subtitle: 'Средне-тонкий помол',
              fraction: '≈ 0.5 мм',
              desc: 'Размер песчинок тростникового сахара. Не забивает фильтр гейзера.',
              time: '3–4 мин',
            },
            {
              number: '04',
              title: 'Фильтр & V60',
              subtitle: 'Средний помол',
              fraction: '≈ 0.8 мм',
              desc: 'Для воронки V60, фильтр-кофеварок и кемекса. Раскрывает ягоды и цветы.',
              time: '3–3.5 мин',
            },
            {
              number: '05',
              title: 'Френч-пресс',
              subtitle: 'Крупный помол',
              fraction: '≈ 1.2 мм',
              desc: 'Крупные гранулы для долгого настаивания и Cold Brew без кофейной пыли.',
              time: '4–5 мин',
            },
          ],
        },
      },
      {
        pageId: coffeePage.id,
        blockType: 'coffee_collection',
        name: 'Кофейная коллекция ТАВ',
        order: 5,
        isActive: true,
        content: {
          badge: 'Свежая обжарка в наличии',
          title: 'Кофейная коллекция ТАВ',
          subtitle: '',
        },
      },
      {
        pageId: coffeePage.id,
        blockType: 'sensory_cycle',
        name: 'Стандарты свежести и сенсорный цикл',
        order: 6,
        isActive: true,
        content: {
          badge: 'Сенсорный контроль и стандарты',
          headline: 'Почему кофе ТАВ',
          headlineHighlight: 'раскрывается иначе',
          description:
            'Мы относимся к спешелти-кофе как к живому продукту: от строгого отбора мировых микролотов до контроля фаз созревания зерна после обжарки.',
          freshnessTitle: '«Золотое окно свежести»',
          freshnessBadge: 'Пик: 4–21 день',
          freshnessDesc:
            'Свой истинный букет, сочную сладость и плотную пенку crema арабика проявляет именно в «золотом окне» созревания.',
          phases: [
            {
              days: '1–3 день',
              title: 'Фаза активной дегазации',
              desc: 'Выход углекислого газа после ростера. Вкус зерна только начинает структурироваться.',
            },
            {
              days: '4–21 день',
              title: '✨ Пик вкусоароматики',
              desc: 'Максимум эфирных масел, сочная чистая кислотность и шелковистое тело в чашке.',
              highlight: true,
            },
            {
              days: '30+ дней',
              title: 'Медленное угасание',
              desc: 'Постепенное окисление тонких ягодных и цветочных дескрипторов.',
            },
          ],
          shelfBanner: {
            leftText: 'На полках в Майкопе:',
            rightText: 'Всегда свежая обжарка не старше 7–14 дней',
          },
          features: [
            {
              tag1: 'ТОП 10% УРОЖАЯ',
              tag2: '84+ SCA',
              title: '100% Specialty Arabica',
              desc: 'Ручной селекционный сбор ягод без дефектов. Прозрачное происхождение каждого микролота.',
            },
            {
              tag1: 'БАРЬЕРНАЯ ФОЛЬГА',
              tag2: 'WICOvalves',
              title: 'Клапан дегазации & Zip-Lock',
              desc: 'Трехслойный металлизированный барьер блокирует кислород, сохраняя 1000+ эфирных соединений.',
            },
            {
              tag1: 'В МАГАЗИНЕ',
              tag2: 'МАЙКОП',
              title: 'Помол в подарок на Васильева, 2/1',
              desc: 'Бесплатно смолем любую пачку на калиброванных жерновах под ваш девайс.',
            },
          ],
        },
      },
    ],
  });

  // D. CONTACTS PAGE
  const contactsPage = await prisma.page.create({
    data: {
      slug: 'contacts',
      title: 'Контакты и локация',
      seoTitle: 'Контакты и пространство в Майкопе | ТАВ',
      seoDescription: 'Адрес, телефон и режим работы флагманского пространства ТАВ в Майкопе: ул. К.А. Васильева, 2/1. Маршрут в Яндекс Картах и 2ГИС, связь с бариста в Telegram и WhatsApp.',
      isPublished: true,
    },
  });

  await prisma.pageBlock.createMany({
    data: [
      {
        pageId: contactsPage.id,
        blockType: 'hero',
        name: 'Hero Контактов',
        order: 1,
        isActive: true,
        content: {
          badge: 'МАЙКОП, УЛ. К.А. ВАСИЛЬЕВА, 2/1 • ПРОСТРАНСТВО ТАВ',
          headline: 'Контакты и',
          headlineHighlight: 'пространство ТАВ',
          cursiveSubtitle: 'Приходите за свежеобжаренным спешелти кофе и дегустацией',
          description:
            'Кофейное пространство в Майкопе: здесь можно вдохнуть ароматы свежих моносортов, подобрать дрип-пакеты в поездку, приобрести аксессуары Hario и бесплатно смолоть зерно под любой метод.',
          imageUrl: '/images/store-maykop-interior.jpg',
          highlights: [
            'Парковка перед входом',
            'Помол зерна 0 ₽',
            'Самовывоз 15 мин',
            'Pet-friendly',
          ],
        },
      },
      {
        pageId: contactsPage.id,
        blockType: 'boutique_showcase',
        name: 'Витрины и интерьер шоурума',
        order: 2,
        isActive: true,
        content: {
          badge: 'Локация в Майкопе',
          title: 'Витрины и интерьер концепт-стора',
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
        },
      },
      {
        pageId: contactsPage.id,
        blockType: 'map_section',
        name: 'Интерактивная карта и маршруты',
        order: 3,
        isActive: true,
        content: {
          badge: 'ИНТЕРАКТИВНАЯ КАРТА • МАЙКОП',
          title: 'Как добраться в концепт-стор',
          description:
            'Майкоп, ул. К.А. Васильева, 2/1 — бесплатная парковка перед входом, 330 м от остановки «Ул. 12-го Марта».',
          yandexMapUrl:
            'https://yandex.ru/map-widget/v1/?ll=40.046895%2C44.609943&z=17.2&pt=40.046895,44.609943,pm2rdm&mode=search&text=%D0%9C%D0%B0%D0%B9%D0%BA%D0%BE%D0%BF%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D1%8C%D0%B5%D0%B2%D0%B0%2C%202%2F1',
          yandexDirectUrl: 'https://yandex.ru/maps/-/CTDGNHK~',
          gisDirectUrl: 'https://2gis.ru/maykop/search/%D0%9C%D0%B0%D0%B9%D0%BA%D0%BE%D0%BF%20%D1%83%D0%BB.%20%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D1%8C%D0%B5%D0%B2%D0%B0%2C%202%2F1',
          transportTips: [
            {
              icon: 'car',
              title: 'На автомобиле',
              desc: 'Удобный заезд с ул. Васильева. Бесплатная автостоянка прямо перед крыльцом.',
            },
            {
              icon: 'bus',
              title: 'Общественным транспортом',
              desc: 'Остановка «Улица 12-го Марта» (маршрутки и автобусы) — 4 минуты пешком (330 м).',
            },
            {
              icon: 'walk',
              title: 'Пешком',
              desc: 'Уютный район, яркая вывеска с подсветкой и вход с уровня тротуара.',
            },
          ],
        },
      },
      {
        pageId: contactsPage.id,
        blockType: 'concierge_hub',
        name: 'Связь с залом и сервис в шоуруме',
        order: 4,
        isActive: true,
        content: {
          conciergeBadge: 'Персональный консьерж',
          conciergeTitle: 'Прямая связь с залом',
          conciergeDesc: 'Консультанты ответят в течение нескольких минут, снимут видео новинок и отложат товар.',
          telegramUrl: 'https://t.me/konfetnica_store',
          whatsappUrl: 'https://wa.me/79881637141',
          phone: '+7 (988) 163-71-41',
          email: 'info@konfetnica-store.ru',
          bottomNoteLeft: 'Ответ: 5–10 мин',
          bottomNoteRight: 'Без выходных',
          privilegesBadge: 'Сервис в концепт-сторе',
          privilegesTitle: 'Привилегии для гостей',
          privilegesDesc: 'Каждый визит в пространство ТАВ продуман для вашего максимального комфорта.',
          privileges: [
            {
              title: 'Помол 0 ₽',
              desc: 'Жернова Fiorenzato: под турку, эспрессо, фильтр.',
            },
            {
              title: 'Бронь 15 мин',
              desc: 'Соберем у кассы без очередей и предоплаты.',
            },
            {
              title: 'Боксы сладостей',
              desc: 'Подарочная упаковка моти, снеков и кофе.',
            },
            {
              title: 'Pet-friendly',
              desc: 'Всегда рады гостям с четвероногими друзьями.',
            },
          ],
        },
      },
      {
        pageId: contactsPage.id,
        blockType: 'concierge_terminal',
        name: 'Экспресс-подготовка заказа к визиту',
        order: 5,
        isActive: true,
        content: {
          badge: 'Экспресс-подготовка',
          title: 'Смолоть зерно или собрать дрип-сет к визиту?',
          subtitle: 'Выберите тему, укажите ваши пожелания, и мы подготовим заказ к вашему приезду в чате с консультантом.',
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
        },
      },
      {
        pageId: contactsPage.id,
        blockType: 'guest_faq',
        name: 'Справочник гостя (4 карточки)',
        order: 6,
        isActive: true,
        content: {
          badge: 'Справочник гостя',
          title: 'Перед вашим визитом',
          subtitle: 'Ответы на популярные вопросы о покупках, дегустациях и сервисе в магазине.',
          items: [
            {
              title: 'Дегустация ароматов кофе',
              desc: 'В зале открыты образцы зерен всех сортов свежей обжарки. Консультант расскажет о дескрипторах (шоколад, ягоды, тропики) и подберет сорт под ваш способ заваривания.',
            },
            {
              title: 'Свежесть обжарки и дата на пачке',
              desc: 'Мы обжариваем зерно еженедельно. На каждой пачке указана точная дата ростинга. Односторонний дегазационный клапан позволяет зерну дышать и сохранять весь букет эфирных масел.',
            },
            {
              title: 'Бесплатный профессиональный помол',
              desc: 'Перемалываем зерновой кофе прямо при вас на жерновой кофемолке совершенно бесплатно. Доступны любые степени помола: от джезвы и эспрессо до воронки V60 и френч-пресса.',
            },
            {
              title: 'Парковка и визиты с питомцами',
              desc: 'Перед входом в магазин оборудована бесплатная парковка для автомобилей. Кроме того, мы полностью pet-friendly пространство — всегда рады гостям с собаками.',
            },
          ],
        },
      },
      {
        pageId: contactsPage.id,
        blockType: 'wholesale_banner',
        name: 'Оптовые поставки и B2B баннер',
        order: 7,
        isActive: true,
        content: {
          badge: 'Оптовые поставки & HoReCa',
          title: 'Кофе ТАВ для вашей кофейни, ресторана или офиса',
          description:
            'Поставляем спешелти зерно свежей обжарки, настраиваем эспрессо-профили и обучаем персонал. Свяжитесь с нами для получения оптового каталога и образцов.',
          buttonLabel: 'Запросить B2B прайс',
          buttonHref: 'https://t.me/tav_coffee',
        },
      },
    ],
  });

  // E. PRIVACY POLICY PAGE
  const privacyPage = await prisma.page.create({
    data: {
      slug: 'privacy',
      title: 'Политика конфиденциальности',
      seoTitle: 'Политика конфиденциальности | ТАВ Specialty Coffee',
      seoDescription: 'Политика в отношении обработки персональных данных и защиты конфиденциальности пользователей сайта ТАВ.',
      isPublished: true,
    },
  });

  await prisma.pageBlock.createMany({
    data: [
      {
        pageId: privacyPage.id,
        blockType: 'rich_text',
        name: 'Текст политики конфиденциальности',
        order: 1,
        isActive: true,
        content: {
          title: 'Политика конфиденциальности',
          lastUpdated: '01 сентября 2026 года',
          sections: [
            {
              heading: '1. Общие положения',
              text: 'Настоящая Политика обработки персональных данных определяет порядок обработки и защиты информации о физических лицах, пользующихся услугами сайта ТАВ Coffee.',
            },
            {
              heading: '2. Сбор и использование информации',
              text: 'Мы собираем контактные данные (имя, номер телефона) исключительно для подтверждения и сборки заказов на самовывоз или дегустацию зерна.',
            },
            {
              heading: '3. Защита персональных данных',
              text: 'Мы принимаем все необходимые организационные и технические меры для защиты персональных данных пользователей от неправомерного или случайного доступа.',
            },
          ],
        },
      },
    ],
  });

  console.log('📄 Seeded all pages and interactive page blocks!');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
