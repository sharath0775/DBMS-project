import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fireToast } from '../components/Toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '', city: user?.city || '', state: user?.state || '', pincode: user?.pincode || '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      fireToast('Profile saved', 'success');
    } catch (error) {
      fireToast(error?.response?.data?.error || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Your profile</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              Name
              <input value={form.name} onChange={handleChange('name')} className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              Email
              <input value={user?.email} disabled className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              Phone
              <input value={form.phone} onChange={handleChange('phone')} className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              Pincode
              <input value={form.pincode} onChange={handleChange('pincode')} className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </label>
          </div>
          <label className="block text-sm text-slate-700 dark:text-slate-300">
            Address
            <textarea value={form.address} onChange={handleChange('address')} rows={3} className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={form.city} onChange={handleChange('city')} placeholder="City" className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            <input value={form.state} onChange={handleChange('state')} placeholder="State" className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
          </div>
          <button type="submit" disabled={saving} className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70">
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </div>
    </section>
  );
}
