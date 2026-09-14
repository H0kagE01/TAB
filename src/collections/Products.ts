import type { CollectionConfig } from '@/types/payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'brand', 'country', 'price', 'inStock'],
    group: 'Каталог',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название товара',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL-слаг',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Категория',
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      label: 'Бренд',
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      label: 'Страна происхождения',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Цена (₽)',
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
      label: 'В наличии',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Краткое описание (для карточки и сниппетов)',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Полное описание товара',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Изображения товара',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'isNew',
          type: 'checkbox',
          defaultValue: false,
          label: 'Новинка',
        },
        {
          name: 'isPopular',
          type: 'checkbox',
          defaultValue: false,
          label: 'Популярный товар',
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Рекомендуем (Хит)',
        },
      ],
    },

    // ==========================================
    // ХАРАКТЕРИСТИКИ ДЛЯ ЗЕРНОВОГО КОФЕ
    // ==========================================
    {
      name: 'coffeeSpecs',
      type: 'group',
      label: 'Характеристики кофе',
      admin: {
        description: 'Заполняется для товаров категории «Зерновой кофе»',
      },
      fields: [
        {
          name: 'variety',
          type: 'text',
          label: 'Сорт / тип зерна (например: 100% Арабика, Бленд)',
        },
        {
          name: 'roastLevel',
          type: 'select',
          options: [
            { label: 'Светлая (Light)', value: 'light' },
            { label: 'Средняя (Medium)', value: 'medium' },
            { label: 'Тёмная (Dark)', value: 'dark' },
          ],
          label: 'Степень обжарки',
        },
        {
          name: 'flavorNotes',
          type: 'text',
          label: 'Вкусовые ноты (через запятую, например: Бергамот, Жасмин, Персик)',
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Вес упаковки (в граммах, например: 250, 500, 1000)',
        },
      ],
    },

    // ==========================================
    // ХАРАКТЕРИСТИКИ ДЛЯ ЛАПШИ
    // ==========================================
    {
      name: 'noodlesSpecs',
      type: 'group',
      label: 'Характеристики лапши',
      admin: {
        description: 'Заполняется для товаров категории «Лапша»',
      },
      fields: [
        {
          name: 'taste',
          type: 'text',
          label: 'Вкусовой профиль (например: Кимчи, Острая курица, Сырный)',
        },
        {
          name: 'spiceLevel',
          type: 'select',
          options: [
            { label: '1 - Мягкий', value: '1' },
            { label: '2 - Пряный', value: '2' },
            { label: '3 - Острый (классика)', value: '3' },
            { label: '4 - Очень острый', value: '4' },
            { label: '5 - Экстремальный (2x Spicy)', value: '5' },
          ],
          label: 'Уровень остроты (1-5)',
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Вес (в граммах, например: 120, 140)',
        },
      ],
    },

    // ==========================================
    // ХАРАКТЕРИСТИКИ ДЛЯ СНЕКОВ И СЛАДОСТЕЙ
    // ==========================================
    {
      name: 'snacksSpecs',
      type: 'group',
      label: 'Характеристики снеков и сладостей',
      admin: {
        description: 'Заполняется для категорий «Снеки» и «Сладости»',
      },
      fields: [
        {
          name: 'taste',
          type: 'text',
          label: 'Вкус (например: Сливочное масло и мед, Зеленый чай маття)',
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Вес (в граммах)',
        },
        {
          name: 'features',
          type: 'text',
          label: 'Особенности (например: Тонкая рифленая нарезка, Хрустящая текстура)',
        },
      ],
    },
  ],
};
