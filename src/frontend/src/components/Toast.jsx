import { useEffect, useState } from 'react';

let toastTimer = null;

function showToast(message = '', type = 'info') {
  const event = new CustomEvent('novacart-toast', { detail: { message, type } });
  window.dispatchEvent(event);
}

export function fireToast(message, type = 'success') {
  showToast(message, type);
}

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (event) => {
      setToast(event.detail);
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => setToast(null), 3500);
    };

    window.addEventListener('novacart-toast', handleToast);
    return () => window.removeEventListener('novacart-toast', handleToast);
  }, []);

  if (!toast) return null;

  const color = toast.type === 'error' ? 'bg-rose-500' : toast.type === 'warning' ? 'bg-amber-500' : 'bg-sky-600';

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded-2xl px-5 py-4 text-white shadow-2xl shadow-slate-900/10 animate-fade-in-up">
      <div className={`${color} rounded-2xl px-4 py-3 text-sm font-medium`}>{toast.message}</div>
    </div>
  );
}
