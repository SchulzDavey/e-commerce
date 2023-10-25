'use client';

import order from '@/public/images/order.gif';
import { useCartStore } from '@/store';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const OrderConfirmedPage = () => {
  const cartStore = useCartStore();

  const orderButton = () => {
    setTimeout(() => {
      cartStore.setCheckout('cart');
      cartStore.toggleCart();
    });

    cartStore.setPaymentIntent('');
    cartStore.setClientSecret('');
    cartStore.clearCart();
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center my-12"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="p-12 rounded-md text-center">
        <h1 className="text-2xl font-medium">Your order has been placed!</h1>
        <h2 className="text-sm my-4">Check your email for the receipt.</h2>
        <Image src={order} className="py-8" alt="order image" />
      </div>
      <div className="flex items-center justify-center gap-8">
        <Link href={`/dashboard`}>
          <button onClick={orderButton} className="font-medium">
            Check your Order
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default OrderConfirmedPage;
