'use client';

import { useCartStore } from '@/store';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import CheckoutForm from './CheckoutForm';
import OrderAnimation from './OrderAnimation';

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
      {!cartStore.clientSecret && <OrderAnimation />}
      {cartStore.clientSecret && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={cartStore.clientSecret} />
          </Elements>
        </motion.div>
      )}
    </div>
  );
};

export default CheckoutPage;
