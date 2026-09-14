import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerComment, grindType, storeId, items } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Укажите ваше имя и номер телефона' },
        { status: 400 }
      );
    }

    const orderNumber = `TAV-${Math.floor(1000 + Math.random() * 9000)}`;

    let totalAmount = 0;
    const itemsData = [];

    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const itemPrice = Number(item.price) || 0;
        const itemQty = Number(item.quantity) || 1;
        totalAmount += itemPrice * itemQty;

        itemsData.push({
          productId: item.productId,
          productTitle: item.productTitle || 'Кофе ТАВ',
          price: itemPrice,
          quantity: itemQty,
          grindType: item.grindType || grindType || null,
        });
      }
    }

    const createdInquiry = await prisma.inquiry.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerComment: customerComment || null,
        grindType: grindType || null,
        storeId: storeId || null,
        totalAmount,
        status: 'NEW',
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, inquiry: createdInquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Не удалось отправить заявку. Попробуйте еще раз.' },
      { status: 500 }
    );
  }
}
