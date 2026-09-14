import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { getMainStore } from '@/lib/db/stores';

import { getPageWithBlocks } from '@/lib/db/pages';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageWithBlocks('privacy');
  return {
    title: page?.seoTitle || 'Политика обработки персональных данных | ТАВ',
    description: page?.seoDescription || 'Политика в отношении обработки персональных данных клиентов ТАВ в Майкопе.',
    keywords: page?.seoKeywords || undefined,
  };
}

export default async function PrivacyPage() {
  const store = await getMainStore();

  return (
    <div className="min-h-screen bg-[#0E0A08] text-[#F3EFE9] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#D9A76A] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Вернуться на главную</span>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A76A]/15 border border-[#D9A76A]/30 text-xs font-bold text-[#D9A76A]">
            <ShieldCheck className="h-4 w-4 text-[#D9A76A]" />
            <span>152-ФЗ РФ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
            Политика обработки персональных данных
          </h1>

          <p className="text-sm text-[#8E8276]">
            Редакция действует с 1 января 2026 года • ТАВ, г. Майкоп
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-[#C4B9AD] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#D9A76A]" />
              <span>1. Общие положения</span>
            </h2>
            <p>
              Настоящая Политика обработки персональных данных (далее — «Политика») определяет порядок сбора, хранения, защиты и обработки персональной информации пользователей сайта ТАВ (г. Майкоп, ул. К.А. Васильева, 2/1).
            </p>
            <p>
              Использование сайта и отправка форм онлайн-заказа означает согласие Пользователя с настоящей Политикой и указанными в ней условиями обработки персональных данных.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#D9A76A]" />
              <span>2. Состав собираемых персональных данных</span>
            </h2>
            <p>
              Мы обрабатываем только минимально необходимый объем данных для подтверждения наличия товара и бронирования заказа:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-white">
              <li>Имя (для обращения при выдаче заказа в пространстве ТАВ);</li>
              <li>Номер контактного телефона (для отправки уведомления о готовности заказа);</li>
              <li>Комментарии и пожелания к заказу (например, метод помола зерна).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>3. Цели обработки персональных данных</span>
            </h2>
            <p>
              Персональные данные используются исключительно для:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-white">
              <li>Формирования предварительного заказа и резервирования позиций;</li>
              <li>Связи с клиентом по телефону в случае необходимости уточнения параметров помола;</li>
              <li>Улучшения качества обслуживания и информирования о статусе самовывоза.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-serif">
              4. Защита и передача третьим лицам
            </h2>
            <p>
              ТАВ обязуется не передавать полученные персональные данные третьим лицам, за исключением случаев, предусмотренных действующим законодательством Российской Федерации.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-serif">
              5. Контакты
            </h2>
            <p>
              По любым вопросам, касающимся обработки и удаления ваших персональных данных, вы можете обратиться к нам по адресу: <strong>г. Майкоп, ул. К.А. Васильева, 2/1</strong> или по телефону <strong>{store.phone}</strong>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
