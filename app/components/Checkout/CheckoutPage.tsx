'use client';

import { useCartStore } from '@/store';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPage = () => {
  const cartStore = useCartStore();

  const options: StripeElementsOptions = {
    clientSecret: cartStore.clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating',
    },
  };

  return (
    <div>
      {cartStore.clientSecret && (
        <div>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={cartStore.clientSecret} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
