import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fireToast } from './Toast';
import { useState } from 'react';

const links = [
  { label: 'Products', path: '/products' },
  { label: 'Orders', path: '/orders' },
  { label: 'Wishlist', path: '/wishlist' },
  { label: 'Contact', path: '/contact' }
];

function toggleTheme() {
  const html = document.documentElement;
  html.classList.toggle('dark');
  window.localStorage.setItem('novacart_theme', html.classList.contains('dark') ? 'dark' : 'light');
}

function initializeTheme() {
  const saved = window.localStorage.getItem('novacart_theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  }
}

initializeTheme();

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
      fireToast('Enter a search term first', 'warning');
      return;
    }
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold text-slate-900 hover:text-sky-600 dark:text-white">
          NovaCart
        </Link>
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, brands or categories"
            className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <button type="submit" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
            Search
          </button>
        </form>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              toggleTheme();
              fireToast('Theme updated', 'info');
            }}
            className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Theme
          </button>
          <Link to="/cart" className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
            Cart
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Hi, {user.name}</span>
              <button
                onClick={() => {
                  logout();
                  fireToast('Logged out successfully', 'success');
                  navigate('/');
                }}
                className="rounded-full bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
      <nav className="border-t border-slate-200 bg-slate-50/95 px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 text-slate-600 dark:text-slate-300">
          {links.map((link) => (
            <Link key={link.path} to={link.path} className="transition hover:text-sky-600">
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" className="font-semibold text-sky-700 dark:text-sky-400">
              Admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
