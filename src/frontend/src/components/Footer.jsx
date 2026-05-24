import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:px-8 lg:grid-cols-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">NovaCart</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
            A modern full-stack shopping experience with product discovery, carts, orders, reviews and an admin dashboard.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Explore</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li><Link to="/products" className="hover:text-sky-600">Products</Link></li>
            <li><Link to="/about" className="hover:text-sky-600">About</Link></li>
            <li><Link to="/contact" className="hover:text-sky-600">Contact</Link></li>
            <li><Link to="/wishlist" className="hover:text-sky-600">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Support</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li>help@novacart.com</li>
            <li>+91 98765 43210</li>
            <li>Mon - Fri, 9am - 8pm</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © {new Date().getFullYear()} NovaCart. Built for modern ecommerce.
      </div>
    </footer>
  );
}
