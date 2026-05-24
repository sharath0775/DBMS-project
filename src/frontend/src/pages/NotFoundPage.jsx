import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white">404</h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Page not found.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700">
        Back to home
      </Link>
    </section>
  );
}
