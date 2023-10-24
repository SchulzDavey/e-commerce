import Image from 'next/image';
import { FC } from 'react';

interface ProductProps {
  name: string;
  image: string;
  price: string;
}

const Product: FC<ProductProps> = ({ name, image, price }) => {
  return (
    <div>
      <Image src={image} alt={name} width={400} height={400} />
      <h1>{name}</h1>
      <p>{price}</p>
    </div>
  );
};

export default Product;
