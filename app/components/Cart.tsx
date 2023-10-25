'use client';

import { useCartStore } from '@/store';
import formatPrice from '@/util/PriceFormat';
import Image from 'next/image';
import { IoAddCircle, IoRemoveCircle } from 'react-icons/io5';
import cart from '@/public/images/cart.png';
import { AnimatePresence, motion } from 'framer-motion';
import Checkout from './CheckoutPage';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import OrderConfirmed from './OrderConfirmed';

const Cart = () => {
  const router = useRouter();
  const cartStore = useCartStore();

  const totalPrice = cartStore.cart.reduce(
    (acc, item) => acc + item.unit_amount! * item.quantity!,
    0
  );

  const onCheckout = async () => {
    try {
      const data = {
        items: cartStore.cart,
        payment_intent_id: cartStore.paymentIntent,
      };

      await axios
        .post('/api/stripe/create-payment-intent', data)
        .then((response) => {
          if (response.status === 403) {
            router.push('/api/auth/signin');
          }
          return response;
        })
        .then((data) => {
          const { data: stripeData } = data;

          const sessionData = stripeData.paymentIntent
            ? stripeData.paymentIntent
            : stripeData.currentIntent;

          cartStore.setClientSecret(sessionData.client_secret);
          cartStore.setPaymentIntent(sessionData.id);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => cartStore.toggleCart()}
      className="fixed w-full h-screen left-0 top-0 bg-black/25"
    >
      <motion.div
        layout
        onClick={(e) => e.stopPropagation()}
        className="bg-white absolute right-0 top-0 h-screen p-12 overflow-y-scroll text-gray-700 w-full lg:w-2/5"
      >
        {cartStore.onCheckout === 'cart' && (
          <button
            onClick={() => cartStore.toggleCart()}
            className="text-sm font-bold pb-12"
          >
            Back to store
          </button>
        )}
        {cartStore.onCheckout === 'checkout' && (
          <button
            onClick={() => cartStore.setCheckout('cart')}
            className="text-sm font-bold pb-12"
          >
            Check your cart
          </button>
        )}
        {cartStore.onCheckout === 'cart' && (
          <>
            {cartStore.cart.map((item) => (
              <motion.div layout key={item.id} className="flex py-4 gap-4">
                <Image
                  className="rounded-md h-24 object-cover"
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={120}
                />
                <div>
                  <h2>{item.name}</h2>
                  <div className="flex gap-2">
                    <h2>Quantity: {item.quantity}</h2>
                    <button
                      onClick={() =>
                        cartStore.removeProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          unit_amount: item.unit_amount,
                          quantity: item.quantity,
                        })
                      }
                    >
                      <IoRemoveCircle />
                    </button>
                    <button
                      onClick={() =>
                        cartStore.addProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          unit_amount: item.unit_amount,
                          quantity: item.quantity,
                        })
                      }
                    >
                      <IoAddCircle />
                    </button>
                  </div>

                  <p className="text-sm">{formatPrice(item.unit_amount!)}</p>
                </div>
              </motion.div>
            ))}
          </>
        )}
        {cartStore.cart.length > 0 && cartStore.onCheckout === 'cart' ? (
          <motion.div layout>
            <p>Total: {formatPrice(totalPrice)}</p>
            <button
              onClick={() => {
                cartStore.setCheckout('checkout');
                onCheckout();
              }}
              className="py-2 mt-4 bg-teal-700 w-full rounded-md text-white"
            >
              Checkout
            </button>
          </motion.div>
        ) : null}
        {cartStore.onCheckout === 'checkout' && <Checkout />}
        {cartStore.onCheckout === 'success' && <OrderConfirmed />}
        <AnimatePresence>
          {!cartStore.cart.length && cartStore.onCheckout === 'cart' && (
            <motion.div
              animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}
              initial={{ scale: 0, rotateZ: -10, opacity: 0 }}
              exit={{ scale: 0, rotateZ: -10, opacity: 0 }}
              className="flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-75"
            >
              <h1>Your cart is empty..</h1>
              <Image src={cart} alt="empty cart" width={200} height={200} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Cart;
