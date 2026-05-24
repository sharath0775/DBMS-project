import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlist } from '../api/api';
import Loader from '../components/Loader';
import { fireToast } from '../components/Toast';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = () => {
    wishlist.list().then((response) => {
      const raw = response.data.data || [];
      // Normalize Sequelize includes: Product -> product
      const normalized = raw.map((item) => ({
        ...item,
        product: item.Product || item.product
      }));
      setItems(normalized);
    }).catch(() => setItems([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeItem = (productId) => {
    wishlist.remove(productId)
      .then(() => {
        fireToast('Removed from wishlist', 'success');
        loadWishlist();
      })
      .catch(() => fireToast('Unable to remove item', 'error'));
  };

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Wishlist</h1>
        {!items.length ? (
          <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
            Your wishlist is empty.
            <div className="mt-4">
              <Link to="/products" className="rounded-full bg-sky-600 px-5 py-3 text-white hover:bg-sky-700">Browse products</Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-[160px_1fr_120px]">
                <img src={item.product.image_url || `https://via.placeholder.com/160?text=${encodeURIComponent(item.product.name)}`} alt={item.product.name} className="h-32 w-full rounded-3xl object-cover" />
                <div>
                  <Link to={`/products/${item.product.id}`} className="text-lg font-semibold text-slate-900 dark:text-white hover:text-sky-600">{item.product.name}</Link>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.product.brand}</p>
                </div>
                <div className="flex flex-col items-start justify-between text-right sm:items-end">
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">₹{item.product.price}</span>
                  <button onClick={() => removeItem(item.product_id)} className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
