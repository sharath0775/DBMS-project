import { useEffect, useState } from 'react';
import { admin, products } from '../api/api';
import Loader from '../components/Loader';
import { fireToast } from '../components/Toast';

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '', brand: '', image_url: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    admin.products().then((res) => setItems(res.data.data.products || [])).catch(() => setItems([]));
  };

  useEffect(() => {
    Promise.all([loadProducts(), products.categories()])
      .then(([_, resCategories]) => setCategories(resCategories.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await admin.createProduct({ ...form, price: Number(form.price), stock: Number(form.stock), category_id: Number(form.category_id) });
      fireToast('Product created', 'success');
      setForm({ name: '', description: '', price: '', stock: '', category_id: '', brand: '', image_url: '' });
      loadProducts();
    } catch (error) {
      fireToast('Create failed', 'error');
    }
  };

  const startEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      brand: product.brand,
      image_url: product.image_url
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await admin.updateProduct(editing, { ...form, price: Number(form.price), stock: Number(form.stock), category_id: Number(form.category_id) });
      fireToast('Product updated', 'success');
      setEditing(null);
      setForm({ name: '', description: '', price: '', stock: '', category_id: '', brand: '', image_url: '' });
      loadProducts();
    } catch (error) {
      fireToast('Update failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await admin.deleteProduct(id);
      fireToast('Product deleted', 'success');
      loadProducts();
    } catch (error) {
      fireToast('Delete failed', 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Admin product manager</h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Create, update or remove product listings.</p>
          </div>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">{item.name}</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.brand} — ₹{item.price}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => startEdit(item)} className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{editing ? 'Edit product' : 'Add product'}</h2>
          <form onSubmit={editing ? handleUpdate : handleCreate} className="mt-6 space-y-4">
            <input placeholder="Name" value={form.name} onChange={handleChange('name')} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            <textarea placeholder="Description" value={form.description} onChange={handleChange('description')} rows={3} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input placeholder="Price" type="number" value={form.price} onChange={handleChange('price')} className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <input placeholder="Stock" type="number" value={form.stock} onChange={handleChange('stock')} className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </div>
            <select value={form.category_id} onChange={handleChange('category_id')} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
              <option value="">Choose category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <input placeholder="Brand" value={form.brand} onChange={handleChange('brand')} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            <input placeholder="Image URL" value={form.image_url} onChange={handleChange('image_url')} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">{editing ? 'Update product' : 'Create product'}</button>
          </form>
        </aside>
      </div>
    </section>
  );
}
