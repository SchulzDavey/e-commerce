'use client';

import formatPrice from '@/util/PriceFormat';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [orders, setOrders] = useState<Array<any> | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/stripe/orders');
      setOrders(data);
    } catch (error: any) {
      console.log(error);
      setOrders(null);
    }
  };

  if (orders === null)
    return <div>You need to be logged in to view your orders.</div>;

  return (
    <div>
      <div className="font-medium">
        <h1>{orders.length === 0 ? 'No orders placed' : 'Your orders:'}</h1>
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="rounded-lg p-8 my-4 space-y-2 bg-base-200"
          >
            <h2 className="text-sm font-medium">Order reference: {order.id}</h2>
            <p className="text-sm">
              Time: {new Date(order.createdDate).toString()}
            </p>
            <p className="text-md py-2">
              Status:{' '}
              <span
                className={`${
                  order.status === 'complete' ? 'bg-teal-500' : 'bg-red-500'
                } text-white py-1 rounded-md px-2 mx-2 text-sm`}
              >
                {order.status}
              </span>
            </p>
            <p className="font-medium">Total: {formatPrice(order.amount)}</p>
            <div className="text-sm lg:flex items-center gap-4">
              {order.products.map((product: any) => (
                <div key={product.id} className="py-2 ">
                  <h2 className="py-2">{product.name}</h2>
                  <div className="flex items-center gap-4">
                    <Image
                      src={product.image}
                      width={36}
                      height={36}
                      alt={product.name}
                    />
                    <p>{formatPrice(product.unit_amount)}</p>
                    <p>{product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
