import { ProductType } from '@/types/ProductType';
import formatPrice from '@/util/PriceFormat';
import Image from 'next/image';
import { FC } from 'react';

const Product = ({ name, image, price }: ProductType) => {
  return (
    <div>
      <Image src={image} alt={name} width={400} height={400} />
      <h1>{name}</h1>
      <p>{formatPrice(price!)}</p>
    </div>
  );
};

export default Product;
