import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <Link to={`/products/${product.id}`} className="block overflow-hidden">
        <img
          src={product.image_url || `https://via.placeholder.com/420x320?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-3 p-5">
        <Link to={`/products/${product.id}`} className="text-sm font-semibold text-slate-900 hover:text-sky-600 dark:text-slate-100">
          {product.name}
        </Link>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">₹{product.price}</span>
            {product.discount_percent > 0 && (
              <span className="ml-2 text-sm text-rose-500">-{product.discount_percent}%</span>
            )}
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {product.brand || 'NovaCart'}
          </span>
        </div>
      </div>
    </article>
  );
}
