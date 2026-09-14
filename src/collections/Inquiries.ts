import type { CollectionConfig } from '@/types/payload';

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'customerPhone', 'product', 'status', 'createdAt'],
    group: 'Заявки',
  },
  access: {
    create: () => true, // Allow website visitors to submit inquiries
    read: ({ req }) => Boolean(req.user), // Admin only
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
      label: 'Имя клиента',
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
      label: 'Телефон',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'Интересующий товар',
    },
    {
      name: 'preferredStore',
      type: 'relationship',
      relationTo: 'stores',
      label: 'Предпочтительный магазин',
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Комментарий / Вопрос',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В обработке', value: 'in-progress' },
        { label: 'Выполнена', value: 'completed' },
        { label: 'В архиве', value: 'archived' },
      ],
      label: 'Статус заявки',
    },
  ],
};
