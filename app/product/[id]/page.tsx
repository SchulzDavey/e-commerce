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
    <div className="flex flex-col 2xl:flex-row items-center justify-between gap-24">
      <Image
        src={searchParams.image}
        alt={searchParams.name}
        width={600}
        height={600}
        className="w-full h-96 object-cover rounded-lg"
      />
      <div className="font-medium">
        <h1 className="text-2xl  py-2">{searchParams.name}</h1>
        <p className="py-1">{searchParams.description}</p>
        <p className="py-1">{searchParams.features}</p>
        <div className="flex gap-1 mb-3">
          <p className="font-bold text-primary">
            {formatPrice(searchParams.unit_amount!)}
          </p>
        </div>
        <AddCart {...searchParams} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
