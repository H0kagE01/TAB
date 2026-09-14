import type { CollectionConfig } from '@/types/payload';

export const Collections: CollectionConfig = {
  slug: 'collections',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'badgeText'],
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
      label: 'Название подборки',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL-слаг',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание подборки',
    },
    {
      name: 'badgeText',
      type: 'text',
      label: 'Текст бейджа (например: Знакомство, Острота 4–5)',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка подборки',
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Товары в подборке',
    },
  ],
};
