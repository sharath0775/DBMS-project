import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../api/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([products.trending(8), products.bestSellers(8)])
      .then(([trendingResponse, bestResponse]) => {
        setTrending(trendingResponse.data.data || []);
        setBestSellers(bestResponse.data.data || []);
        setFeatured([...trendingResponse.data.data.slice(0, 3), ...bestResponse.data.data.slice(0, 1)]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 rounded-3xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 p-10 text-white shadow-xl">
        <div className="max-w-2xl">
          <span className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-1 text-sm uppercase tracking-[0.24em] text-sky-100">
            Premium shopping
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">NovaCart — modern ecommerce made simple.</h1>
          <p className="mt-5 text-lg leading-8 text-sky-100/90">
            Discover top brands, smart filters, secure checkout and a polished user experience for desktop and mobile.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100">
              Explore products
            </Link>
            <Link to="/contact" className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Contact support
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Featured collections</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Browse trending categories and discover curated discounts across products you’ll love.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link to="/products?category_id=1" className="rounded-3xl border border-slate-200 p-6 transition hover:border-sky-500 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">Electronics</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Smartphones, laptops, audio and more.</p>
            </Link>
            <Link to="/products?category_id=2" className="rounded-3xl border border-slate-200 p-6 transition hover:border-sky-500 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">Fashion</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Trendy apparel and accessories.</p>
            </Link>
            <Link to="/products?category_id=3" className="rounded-3xl border border-slate-200 p-6 transition hover:border-sky-500 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">Home & Kitchen</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Premium home essentials and gifts.</p>
            </Link>
            <Link to="/products?category_id=5" className="rounded-3xl border border-slate-200 p-6 transition hover:border-sky-500 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">Sports</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Fitness gear and outdoor favorites.</p>
            </Link>
          </div>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Special offers</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Seasonal offers, hot deals and BOGO promotions across categories.</p>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white">Flash sale</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Up to 35% off selected electronics and fashion brands.</p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white">Fast delivery</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Express shipping available on premium orders.</p>
            </div>
          </div>
        </article>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Trending products</h2>
          <Link to="/products" className="text-sm font-semibold text-sky-600 hover:text-sky-700">View all</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Best sellers</h2>
          <Link to="/products" className="text-sm font-semibold text-sky-600 hover:text-sky-700">Shop now</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="rounded-3xl bg-slate-950 p-10 text-white">
        <h2 className="text-3xl font-semibold">Loved by shoppers, built for sellers</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
          NovaCart combines responsive product discovery, smart checkout flows, wishlists, orders, reviews and modern admin tools in one place.
        </p>
      </section>
    </section>
  );
}
