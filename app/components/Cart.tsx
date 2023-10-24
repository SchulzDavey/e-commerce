'use client';

import { useCartStore } from '@/store';

interface CartProps {}

const Cart = ({}) => {
  const cartStore = useCartStore();

  return (
    <div>
      <h1>Cart</h1>
    </div>
  );
};

export default Cart;
