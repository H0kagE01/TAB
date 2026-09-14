import type { CollectionConfig } from '@/types/payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Администрирование',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя администратора',
    },
  ],
};
