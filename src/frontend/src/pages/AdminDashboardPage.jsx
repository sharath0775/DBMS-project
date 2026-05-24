import { useEffect, useState } from 'react';
import { admin } from '../api/api';
import Loader from '../components/Loader';
import { fireToast } from '../components/Toast';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin.dashboard()
      .then((response) => setStats(response.data.data))
      .catch(() => fireToast('Unable to load admin metrics', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Admin dashboard</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Track sales, inventory and customer activity from one place.</p>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { title: 'Products', value: stats?.products, color: 'bg-sky-600' },
          { title: 'Orders', value: stats?.orders, color: 'bg-emerald-600' },
          { title: 'Customers', value: stats?.customers, color: 'bg-violet-600' },
          { title: 'Revenue', value: `₹${stats?.revenue?.toFixed(2)}`, color: 'bg-amber-500' },
          { title: 'Inventory', value: stats?.inventory, color: 'bg-cyan-600' },
          { title: 'Successful payments', value: stats?.successfulPayments, color: 'bg-rose-600' }
        ].map((card) => (
          <div key={card.title} className="rounded-3xl p-6 shadow-soft dark:bg-slate-900 dark:border dark:border-slate-800">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{card.title}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{card.value ?? '—'}</p>
            <div className={`mt-4 h-1 rounded-full ${card.color}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
