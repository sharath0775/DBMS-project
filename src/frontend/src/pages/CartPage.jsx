import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cart } from '../api/api';
import Loader from '../components/Loader';
import { fireToast } from '../components/Toast';

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = () => {
    setLoading(true);
    cart.list().then((response) => {
      const data = response.data.data || {};
      const rawItems = data.items || [];
      // Normalize Sequelize includes: Product -> product
      const normalized = rawItems.map((item) => ({
        ...item,
        product: item.Product || item.product
      }));
      setItems(normalized);
    }).catch(() => setItems([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = (itemId, quantity) => {
    cart.update(itemId, { quantity })
      .then(() => {
        fireToast('Cart updated', 'success');
        loadCart();
      })
      .catch(() => fireToast('Failed to update cart', 'error'));
  };

  const removeItem = (itemId) => {
    cart.remove(itemId)
      .then(() => {
        fireToast('Item removed', 'success');
        loadCart();
      })
      .catch(() => fireToast('Could not remove item', 'error'));
  };

  const total = items.reduce((sum, item) => sum + item.quantity * Number(item.product.price), 0);

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Your cart</h1>
        {!items.length ? (
          <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
            <p>Your cart is empty.</p>
            <Link to="/products" className="mt-4 inline-flex rounded-full bg-sky-600 px-5 py-3 text-white hover:bg-sky-700">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-[120px_1fr_160px]">
                  <img src={item.product.image_url || `https://via.placeholder.com/120?text=${encodeURIComponent(item.product.name)}`} alt={item.product.name} className="h-28 w-full rounded-3xl object-cover" />
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{item.product.name}</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.product.brand}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">₹{item.product.price} × {item.quantity}</p>
                  </div>
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="rounded-full border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">-</button>
                      <span className="w-10 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-full border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-sm font-semibold text-rose-600 hover:text-rose-700">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                  <p className="text-3xl font-semibold text-slate-900 dark:text-white">₹{total.toFixed(2)}</p>
                </div>
                <button onClick={() => navigate('/checkout')} className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
