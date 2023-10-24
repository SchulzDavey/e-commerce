import { ProductType } from '@/types/ProductType';
import formatPrice from '@/util/PriceFormat';
import Image from 'next/image';
import AddCart from './AddCart';

export interface ProductDetailsPageProps {
  id: string;
  name: string;
  image: string;
  unit_amount: number | null;
  quantity?: number | 1;
  description: string | null;
  features: string;
}

const ProductDetailsPage = async ({
  searchParams,
}: {
  searchParams: ProductDetailsPageProps;
}) => {
  return (
    <div className="flex justify-between gap-24 p-12 text-gray-700">
      <Image
        src={searchParams.image}
        alt={searchParams.name}
        width={800}
        height={800}
        className="w-full h-96 object-cover rounded-lg"
      />
      <div className="font-medium text-gray-700">
        <h1 className="text-2xl  py-2">{searchParams.name}</h1>
        <p className="py-2">{searchParams.description}</p>
        <p className="py-2">{searchParams.features}</p>
        <div className="flex gap-2">
          <p className="font-bold text-teal-700">
            {formatPrice(searchParams.unit_amount!)}
          </p>
        </div>
        <AddCart {...searchParams} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
