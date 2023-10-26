'use client';

import { CartItem, useCartStore } from '@/store';
import { useState } from 'react';

const AddCart = ({ name, id, image, unit_amount, quantity }: CartItem) => {
  const cartStore = useCartStore();
  const [added, setAdded] = useState(false);

  const AddToCart = () => {
    cartStore.addProduct({
      name,
      id,
      image,
      unit_amount,
      quantity,
    });
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1000);
  };

  return (
    <>
      <button onClick={AddToCart} disabled={added} className="btn btn-primary">
        {added ? 'Adding to cart' : 'Add to cart'}
      </button>
    </>
  );
};

export default AddCart;
