import { Collection } from '@/types';

export const mockCollections: Collection[] = [
  {
    id: 'col-filter-brew',
    slug: 'filter-brew',
    title: 'Для фильтра и воронки V60',
    description: 'Яркие ягодно-цветочные моносорта светлой обжарки с чистым телом и выразительной сладостью спелых фруктов.',
    badgeText: 'Светлая обжарка • Pour Over',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    productIds: ['prod-coffee-1', 'prod-coffee-4', 'prod-coffee-5'],
  },
  {
    id: 'col-espresso-lovers',
    slug: 'espresso-lovers',
    title: 'Плотный шоколадный эспрессо',
    description: 'Сорта и фирменные смеси средней и тёмной обжарки с плотным телом, нотами какао, орехов и густой бархатной пенкой.',
    badgeText: 'Эспрессо & Мока • Без лишней кислоты',
    coverImage: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=800&auto=format&fit=crop',
    productIds: ['prod-coffee-2', 'prod-coffee-3', 'prod-coffee-6'],
  },
  {
    id: 'col-drip-discovery',
    slug: 'drip-discovery',
    title: 'Дрипы в дорогу и офис',
    description: 'Порционный спешелти кофе в индивидуальных фильтрах с азотной средой. Заваривайте идеальную чашку за 2 минуты в любых условиях.',
    badgeText: '100% Спешелти • Без кофеварки',
    coverImage: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop',
    productIds: ['prod-drip-1', 'prod-drip-2', 'prod-drip-3'],
  },
  {
    id: 'col-rare-microlots',
    slug: 'rare-microlots',
    title: 'Редкие микролоты и анаэробика',
    description: 'Экспериментальные ферментации, лоты с высоких высот и премиальные разновидности с комплексным многослойным букетом.',
    badgeText: 'Q-Score 88+ • Лимитированный тираж',
    coverImage: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop',
    productIds: ['prod-coffee-7', 'prod-coffee-8', 'prod-set-1'],
  },
];
