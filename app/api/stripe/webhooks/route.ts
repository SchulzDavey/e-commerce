import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest, res: NextResponse) {
  const rawBody = await req.text();

  const sig = req.headers.get('stripe-signature') as string;

  if (!sig) {
    return NextResponse.json(
      { message: 'Missing the stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Webhook error' + error },
      { status: 400 }
    );
  }

  switch (event?.type) {
    case 'payment_intent.created':
      const paymentIntent = event.data.object;
      console.log('Payment intent was created');
      break;

    case 'charge.succeeded':
      const charge = event.data.object as Stripe.Charge;

      if (typeof charge.payment_intent === 'string') {
        const order = await prisma.order.update({
          where: { paymentIntentID: charge.payment_intent },
          data: { status: 'complete' },
        });
      }
      break;

    default:
      console.log('Unhandled event type: ' + event.type);
      break;
  }

  return NextResponse.json({ received: true });
}
