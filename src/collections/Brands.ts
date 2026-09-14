import type { CollectionConfig } from '@/types/payload';

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'slug'],
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
      label: 'Название бренда',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL-слаг',
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      label: 'Страна происхождения',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание бренда',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Логотип бренда',
    },
  ],
};
