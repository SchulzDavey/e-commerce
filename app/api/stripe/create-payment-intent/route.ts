import Stripe from 'stripe';
import authOptions from '../../auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { CartItem } from '@/store';
import prisma from '@/prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const totalOrderAmount = (items: CartItem[]) => {
  return items.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);
};

export async function POST(req: NextRequest, res: NextResponse) {
  const userSession = await getServerSession(authOptions);

  if (!userSession?.user) {
    return NextResponse.json({ message: 'Not logged in' }, { status: 403 });
  }

  const { items, payment_intent_id } = await req.json();
  const total = totalOrderAmount(items);

  const orderData = {
    // @ts-ignore
    user: { connect: { id: userSession.user?.id } },
    amount: total,
    currency: 'usd',
    status: 'pending',
    paymentIntentID: payment_intent_id,
    products: {
      create: items.map((item: CartItem) => ({
        name: item.name,
        description: item.description || '',
        unit_amount: Number(item.unit_amount),
        image: item.image,
        quantity: item.quantity,
      })),
    },
  };

  if (payment_intent_id) {
    const currentIntent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

    if (currentIntent) {
      const updateIntent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: totalOrderAmount(items) }
      );

      const existingOrder = await prisma.order.findFirst({
        where: { paymentIntentID: updateIntent.id },
        include: { products: true },
      });

      if (!existingOrder) {
        return NextResponse.json(
          { message: 'Invalid Payment Intent' },
          { status: 400 }
        );
      }
      const updatedOrder = await prisma.order.update({
        where: { id: existingOrder?.id },
        data: {
          amount: totalOrderAmount(items),
          products: {
            deleteMany: {},
            create: items.map((item: CartItem) => ({
              name: item.name,
              description: item.description || '',
              unit_amount: Number(item.unit_amount),
              image: item.image,
              quantity: item.quantity,
            })),
          },
        },
      });
      return NextResponse.json({ currentIntent: updateIntent });
    }
  } else {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalOrderAmount(items),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    orderData.paymentIntentID = paymentIntent.id;
    const newOrder = await prisma.order.create({
      data: orderData,
    });

    return NextResponse.json({ paymentIntent }, { status: 200 });
  }
}
