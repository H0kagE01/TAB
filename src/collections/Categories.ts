import type { CollectionConfig } from '@/types/payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    group: 'Каталог',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Название категории',
    },
    {
      name: 'slug',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Моносорта & Микролоты', value: 'single-origin' },
        { label: 'Эспрессо-бленды', value: 'espresso-blends' },
        { label: 'Дрип-пакеты', value: 'drip-coffee' },
        { label: 'Дегустационные сеты', value: 'sets' },
        { label: 'Аксессуары & V60', value: 'accessories' },
      ],
      label: 'Системный идентификатор (slug)',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Короткое описание для карточек',
    },
    {
      name: 'longDescription',
      type: 'textarea',
      label: 'Полное описание для страницы категории',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка категории',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Порядок отображения',
    },
  ],
};
