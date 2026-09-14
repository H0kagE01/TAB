import { StoreLocation } from '@/types';

export const mockStores: StoreLocation[] = [
  {
    id: 'store-maykop',
    name: 'ТАВ в Майкопе',
    address: 'ул. К.А. Васильева, 2/1',
    city: 'Майкоп',
    workingHours: 'Пн–Пт: 08:30 – 20:30, Сб–Вс: 10:00 – 18:00',
    phone: '+7 (988) 163-71-41',
    formattedPhone: '+79881637141',
    coordinates: {
      lat: 44.609699,
      lng: 40.046678,
    },
    photoUrl: '/images/store-maykop.jpg',
    isMain: true,
    description: 'Флагманское пространство ТАВ: свежеобжаренный спешелти кофе, кофейная лаборатория, дрип-пакеты, профессиональные аксессуары и бесплатный помол зерна под любой метод заваривания.',
  },
];
