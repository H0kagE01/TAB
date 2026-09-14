import { Brand } from '@/types';

export const mockBrands: Brand[] = [
  {
    id: 'br-tav-origin',
    name: 'ТАВ Single Origin',
    slug: 'tav-single-origin',
    description: 'Коллекция моносортов и микролотов спешелти-арабики свежей обжарки.',
  },
  {
    id: 'br-tav-signature',
    name: 'ТАВ Signature Roasts',
    slug: 'tav-signature-roasts',
    description: 'Авторские эспрессо-купажи с плотным телом, шелковистой крема и балансом.',
  },
  {
    id: 'br-tav-drip',
    name: 'ТАВ Drip Coffee Lab',
    slug: 'tav-drip-coffee-lab',
    description: 'Порционный кофе в дрип-пакетах с азотным наполнением для сохранения аромата.',
  },
  {
    id: 'br-hario',
    name: 'Hario',
    slug: 'hario',
    countryId: 'cnt-jp',
    countryName: 'Япония',
    description: 'Легендарное японское оборудование для альтернативного заваривания (V60).',
  },
  {
    id: 'br-timemore',
    name: 'Timemore',
    slug: 'timemore',
    description: 'Прецизионные ручные кофемолки со стальными жерновами и бариста-аксессуары.',
  },
];
