import type { CollectionConfig } from '@/types/payload';

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'slug'],
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
      label: 'Название страны',
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      label: 'Код ISO (2 символа, например: KR, JP, ET)',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL-слаг',
    },
    {
      name: 'flagEmoji',
      type: 'text',
      label: 'Флаг (эмодзи)',
    },
  ],
};
