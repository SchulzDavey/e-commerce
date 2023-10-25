import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import authOptions from '../../auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { CartItem } from '@/store';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const totalOrderAmount = (items: CartItem[]) => {
  return items.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const userSession = await getServerSession(authOptions);

  if (!userSession?.user) {
    return NextResponse.json({ message: 'Not logged in' }, { status: 403 });
  }

  const { items, payment_intent_id } = req.body;

  const orderData = {
    // @ts-ignore
    user: { connect: { id: userSession.user?.id } },
    amount: totalOrderAmount(items),
    currency: 'usd',
    status: 'pending',
    paymentIntentID: payment_intent_id,
    products: {
      create: items.map((item: CartItem) => ({
        name: item.name,
        description: item.description,
        unit_amount: item.unit_amount,
        quantity: item.quantity,
      })),
    },
  };

  return NextResponse.json({ userSession });
}
