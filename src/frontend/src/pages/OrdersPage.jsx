import { useEffect, useState } from 'react';
import { orders } from '../api/api';
import Loader from '../components/Loader';
import { fireToast } from '../components/Toast';

export default function OrdersPage() {
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orders.list()
      .then((response) => setOrdersList(response.data.data.orders || []))
      .catch(() => fireToast('Could not load orders', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Order history</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Track your recent orders and view delivery status.</p>
      </div>
      <div className="mt-8 space-y-6">
        {ordersList.length ? ordersList.map((order) => (
          <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Order {order.order_number}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-900/70 dark:text-sky-300">{order.status}</span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Total</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">₹{order.total_amount}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Shipping</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">{order.delivery_option}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Phone</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">{order.phone_number}</div>
              </div>
            </div>
          </div>
        )) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">No orders have been placed yet.</div>
        )}
      </div>
    </section>
  );
}
