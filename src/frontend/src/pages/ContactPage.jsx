export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Contact us</h1>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Have questions? Our support team is happy to help with product recommendations, order updates, and returns.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-950">
            <h2 className="font-semibold text-slate-900 dark:text-white">Customer service</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">help@novacart.com</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">+91 98765 43210</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-950">
            <h2 className="font-semibold text-slate-900 dark:text-white">Office</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">123 Commerce Avenue, Bangalore, India</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Mon - Fri, 9:00 AM - 7:00 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
}
