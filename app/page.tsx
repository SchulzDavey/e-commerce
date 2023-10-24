import Stripe from 'stripe';
import Product from './components/Product';

const getProducts = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  });

  const products = await stripe.products.list();

  const productWithPrices = await Promise.all(
    products.data.map(async (product) => {
      const prices = await stripe.prices.list({
        product: product.id,
      });
      return {
        id: product.id,
        name: product.name,
        price: prices.data[0].unit_amount,
        image: product.images[0],
        currency: prices.data[0].currency,
      };
    })
  );

  return productWithPrices;
};

const Home = async () => {
  const products = await getProducts();

  return (
    <main className="grid grid-cols-fluid gap-12">
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </main>
  );
};

export default Home;
