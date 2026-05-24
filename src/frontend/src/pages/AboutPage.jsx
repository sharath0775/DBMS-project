export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">About NovaCart</h1>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          NovaCart is a modern ecommerce experience built on React, Node.js, Express and MySQL. The platform includes product discovery, cart workflows, orders, wishlist, ratings and an admin dashboard.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-950">
            <h2 className="font-semibold text-slate-900 dark:text-white">Our vision</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">To deliver a premium online store with responsive design, powerful search and a modern checkout experience.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-950">
            <h2 className="font-semibold text-slate-900 dark:text-white">Built for sellers</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Admin management tools let merchants update products, inventory and order status in real time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
