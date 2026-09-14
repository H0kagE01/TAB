import React from 'react';
import prisma from '@/lib/prisma';
import { InquiriesManagerClient } from '@/components/admin/InquiriesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  let plainInquiries: any[] = [];

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        store: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    plainInquiries = inquiries.map((inq) => ({
      id: inq.id,
      orderNumber: inq.orderNumber,
      customerName: inq.customerName,
      customerPhone: inq.customerPhone,
      customerComment: inq.customerComment,
      grindType: inq.grindType,
      storeName: inq.store?.name || 'Пространство ТАВ',
      status: inq.status,
      totalAmount: Number(inq.totalAmount),
      createdAt: inq.createdAt.toISOString(),
      items: inq.items.map((item) => ({
        id: item.id,
        productTitle: item.productTitle,
        price: Number(item.price),
        quantity: item.quantity,
        grindType: item.grindType,
        images: Array.isArray(item.product?.images) ? (item.product.images as string[]) : [],
      })),
    }));
  } catch (err) {
    console.warn('DB unavailable in AdminInquiriesPage, using mock inquiries:', err);
    plainInquiries = [
      {
        id: 'inq-demo-1',
        orderNumber: 'TAV-1001',
        customerName: 'Алексей Смирнов',
        customerPhone: '+7 (900) 123-45-67',
        customerComment: 'Помол под воронку V60, заберу около 16:00',
        grindType: 'filter',
        storeName: 'Пространство ТАВ в Майкопе',
        status: 'NEW',
        totalAmount: 2150,
        createdAt: new Date().toISOString(),
        items: [
          {
            id: 'item-demo-1',
            productTitle: 'Эфиопия Иргачеффе Натс',
            price: 1150,
            quantity: 1,
            grindType: 'filter',
            images: ['/images/products/ethiopia.jpg'],
          },
          {
            id: 'item-demo-2',
            productTitle: 'Дрип-бокс «Мировые терруары» (10 шт)',
            price: 1000,
            quantity: 1,
            grindType: 'drip',
            images: ['/images/products/drip-box.jpg'],
          },
        ],
      },
    ];
  }

  return <InquiriesManagerClient initialInquiries={plainInquiries} />;
}
