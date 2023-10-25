'use client';

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCartStore } from '@/store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout = () => {
  const router = useRouter();
  const cartStore = useCartStore();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartStore.cart,
        payment_intent_id: cartStore.paymentIntent,
      }),
    })
      .then((res) => {
        if (res.status === 403) {
          return router.push('/api/auth/signin');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  }, []);

  return <div>Checkout</div>;
};

export default Checkout;
