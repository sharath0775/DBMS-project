import { useEffect, useState } from 'react';
import { admin } from '../api/api';
import Loader from '../components/Loader';
import { fireToast } from '../components/Toast';

const statusOptions = ['ordered', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    admin.orders().then((res) => setOrders(res.data.data.orders || [])).catch(() => fireToast('Unable to load orders', 'error'));
  };

  useEffect(() => {
    loadOrders();
    setLoading(false);
  }, []);

  const handleStatusChange = (orderId, status) => {
    admin.updateOrderStatus(orderId, status)
      .then(() => {
        fireToast('Status updated', 'success');
        loadOrders();
      })
      .catch(() => fireToast('Failed to update status', 'error'));
  };

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Manage orders</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Update order statuses and review recent order activity.</p>
      </div>
      <div className="mt-8 space-y-6">
        {orders.length ? orders.map((order) => (
          <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Order {order.order_number}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total ₹{order.total_amount}</p>
              </div>
              <div className="space-y-2 text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">Customer ID {order.user_id}</p>
                <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
          </div>
        )) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">No orders available.</div>
        )}
      </div>
    </section>
  );
}
