import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { products } from '../api/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const [loading, setLoading] = useState(true);
  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category_id: query.get('category_id') || '', search: query.get('search') || '', sort: query.get('sort') || '', minPrice: query.get('minPrice') || '', maxPrice: query.get('maxPrice') || '' });

  const fetchProducts = () => {
    setLoading(true);
    products.list({
      category_id: filters.category_id,
      search: filters.search,
      sort: filters.sort,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      limit: 24
    })
      // The backend returns `{ message: "...", data: { products: [...] } }`. Axios wraps this in `response.data`.
      .then((response) => setProductsList(response.data.data.products || []))
      .catch(() => setProductsList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    products.categories().then((res) => setCategories(res.data.data || [])).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate({ search: params.toString() }, { replace: true });
    fetchProducts();
  }, [filters]);

  const handleInput = (field) => (event) => setFilters((prev) => ({ ...prev, [field]: event.target.value }));

  const productCount = productsList.length;

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Product catalogue</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Filter by category, price and sort options to find the perfect product.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Search</h2>
            <input
              value={filters.search}
              onChange={handleInput('search')}
              placeholder="Search products"
              className="mt-4 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Category</h2>
            <select
              value={filters.category_id}
              onChange={handleInput('category_id')}
              className="mt-4 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Price range</h2>
            <div className="mt-4 space-y-3">
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={handleInput('minPrice')}
                placeholder="Min"
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={handleInput('maxPrice')}
                placeholder="Max"
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Sort by</h2>
            <select
              value={filters.sort}
              onChange={handleInput('sort')}
              className="mt-4 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="">Recommended</option>
              <option value="price_asc">Price low to high</option>
              <option value="price_desc">Price high to low</option>
              <option value="rating_desc">Top rated</option>
            </select>
          </div>
        </aside>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-400">Showing {productCount} products for your search and filters.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsList.length ? productsList.map((product) => <ProductCard key={product.id} product={product} />) : <p className="text-slate-600 dark:text-slate-400">No products matched your search.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
