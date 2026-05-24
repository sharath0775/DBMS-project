import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cart, products, reviews, wishlist } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import { fireToast } from '../components/Toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, title: '', comment: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    products.get(id)
      .then((response) => setProduct(response.data.data))
      .catch(() => fireToast('Product could not be loaded', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      fireToast('Please log in to add items to cart', 'error');
      navigate('/login');
      return;
    }
    cart.add({ product_id: product.id, quantity })
      .then(() => fireToast('Added to cart', 'success'))
      .catch((err) => {
        const msg = err?.response?.data?.error;
        if (msg) fireToast(msg, 'error');
        else fireToast('Could not add to cart', 'error');
      });
  };

  const handleAddToWishlist = () => {
    if (!user) {
      fireToast('Please log in to use the wishlist', 'error');
      navigate('/login');
      return;
    }
    wishlist.add({ product_id: product.id })
      .then(() => fireToast('Added to wishlist', 'success'))
      .catch((err) => {
        const msg = err?.response?.data?.error;
        if (msg) fireToast(msg, 'error');
        else fireToast('Could not add to wishlist', 'error');
      });
  };

  const handleBuyNow = () => {
    if (!user) {
      fireToast('Please log in to continue', 'error');
      navigate('/login');
      return;
    }
    cart.add({ product_id: product.id, quantity })
      .then(() => navigate('/checkout'))
      .catch((err) => {
        const msg = err?.response?.data?.error;
        if (msg) fireToast(msg, 'error');
        else fireToast('Could not proceed to checkout', 'error');
      });
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    if (!user) {
      fireToast('Please log in to submit a review', 'error');
      navigate('/login');
      return;
    }
    reviews.create({
      product_id: product.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment
    })
      .then(() => {
        fireToast('Thank you for your review', 'success');
        setReview({ rating: 5, title: '', comment: '' });
      })
      .catch((err) => {
        const msg = err?.response?.data?.error;
        if (msg) fireToast(msg, 'error');
        else fireToast('Unable to submit review', 'error');
      });
  };

  if (loading) return <Loader />;
  if (!product) return <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-700 dark:text-slate-300">Product not found.</div>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <img src={product.image_url || `https://via.placeholder.com/760x560?text=${encodeURIComponent(product.name)}`} alt={product.name} className="w-full rounded-3xl object-cover" />
          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{product.brand || 'NovaCart'}</span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">Rating {product.rating || 0}</span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{product.name}</h1>
            <p className="text-slate-600 dark:text-slate-400">{product.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-semibold text-slate-900 dark:text-white">₹{product.price}</span>
              {product.discount_percent > 0 && (
                <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">-{product.discount_percent}%</span>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-100 p-5 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
              <p className="text-sm">Stock</p>
              <p className="text-lg font-semibold">{product.stock} available</p>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <button onClick={handleAddToCart} className="w-full rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">Add to cart</button>
            <button onClick={handleAddToWishlist} className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-200">
              Add to wishlist
            </button>
            <button onClick={handleBuyNow} className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">Buy now</button>
          </div>
        </aside>
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_0.7fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Product details</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">{product.description}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Write a review</h2>
          <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Rating</label>
              <select
                value={review.rating}
                onChange={(e) => setReview((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {[5, 4, 3, 2, 1].map((value) => <option key={value}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
              <input
                type="text"
                value={review.title}
                onChange={(e) => setReview((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Comment</label>
              <textarea
                value={review.comment}
                onChange={(e) => setReview((prev) => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <button type="submit" className="rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">Submit review</button>
          </form>
        </article>
      </section>
    </section>
  );
}
