import type { CollectionConfig } from '@/types/payload';

export const Stores: CollectionConfig = {
  slug: 'stores',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'address', 'phone', 'isMain'],
    group: 'Компания',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Название магазина',
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      label: 'Адрес',
    },
    {
      name: 'city',
      type: 'text',
      defaultValue: 'Майкоп',
      label: 'Город',
    },
    {
      name: 'workingHours',
      type: 'text',
      required: true,
      label: 'Режим работы (например: Ежедневно 09:00 – 21:00)',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Телефон',
    },
    {
      name: 'coordinates',
      type: 'group',
      label: 'Географические координаты',
      fields: [
        {
          name: 'lat',
          type: 'number',
          label: 'Широта (Latitude)',
        },
        {
          name: 'lng',
          type: 'number',
          label: 'Долгота (Longitude)',
        },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Фотография магазина',
    },
    {
      name: 'isMain',
      type: 'checkbox',
      defaultValue: false,
      label: 'Флагманский магазин',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Краткое описание точки',
    },
  ],
};
