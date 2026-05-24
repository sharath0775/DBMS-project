import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, cart, orders, payments } from '../api/api';
import Loader from '../components/Loader';
import { fireToast } from '../components/Toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({ delivery_address: '', delivery_city: '', delivery_state: '', delivery_pincode: '', phone_number: '', payment_method: 'cod' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [upiPayment, setUpiPayment] = useState(null);
  const [showUPIPopup, setShowUPIPopup] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [paymentDone, setPaymentDone] = useState(false);
  const timerRef = useRef(null);
  const placeOrderRef = useRef(null);

  const loadCart = () => cart.list().then((res) => {
    const data = res.data.data || {};
    const rawItems = data.items || [];
    const normalized = rawItems.map((item) => ({
      ...item,
      product: item.Product || item.product
    }));
    setCartItems(normalized);
  }).catch(() => setCartItems([]));

  useEffect(() => {
    Promise.all([loadCart(), auth.getMe()])
      .then(([_, res]) => {
        setUserData(res.data.data);
        setForm((prev) => ({
          ...prev,
          phone_number: res.data.data?.phone || prev.phone_number,
          delivery_city: res.data.data?.city || prev.delivery_city,
          delivery_state: res.data.data?.state || prev.delivery_state,
          delivery_pincode: res.data.data?.pincode || prev.delivery_pincode,
          delivery_address: res.data.data?.address || prev.delivery_address
        }));
      })
      .catch(() => fireToast('Please log in to continue', 'error'))
      .finally(() => setLoading(false));
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.quantity * Number(item.product.price), 0);

  const handleChange = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const placeOrder = async () => {
    try {
      setSubmitting(true);
      await orders.create({ ...form, payment_method: 'upi' });
      setPaymentDone(true);
      fireToast('Payment successful! Order placed.', 'success');
      setTimeout(() => {
        setShowUPIPopup(false);
        navigate('/orders');
      }, 2000);
    } catch (error) {
      fireToast(error?.response?.data?.error || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Keep ref updated so the timer always calls the latest version
  placeOrderRef.current = placeOrder;

  // Start 10-second countdown when UPI popup opens
  useEffect(() => {
    if (showUPIPopup) {
      setCountdown(10);
      setPaymentDone(false);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Use ref to call the latest placeOrder with current form state
            placeOrderRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showUPIPopup]);

  const handleUPIPayment = async () => {
    try {
      setSubmitting(true);
      const res = await payments.generateUPIQR({ amount: total, order_id: `ORD-${Date.now()}` });
      const paymentData = res.data.data;
      setUpiPayment(paymentData);
      setShowUPIPopup(true);

      // Open PhonePe in a new tab
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const paymentUrl = isMobile
        ? (paymentData.phonePeLink || paymentData.upiLink)
        : (paymentData.phonePeWebLink || paymentData.upiLink);
      window.open(paymentUrl, '_blank');
    } catch (err) {
      fireToast(err?.response?.data?.error || 'Could not initiate UPI payment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.delivery_address || !form.delivery_city || !form.delivery_state || !form.delivery_pincode || !form.phone_number) {
      fireToast('Please complete the shipping details', 'warning');
      return;
    }

    if (form.payment_method === 'upi') {
      await handleUPIPayment();
      return;
    }

    setSubmitting(true);
    try {
      await orders.create({ ...form, payment_method: form.payment_method });
      fireToast('Order placed successfully', 'success');
      navigate('/orders');
    } catch (error) {
      fireToast(error?.response?.data?.error || 'Checkout failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  // Countdown circle progress (circumference for r=45 => ~283)
  const circumference = 2 * Math.PI * 45;
  const progress = ((10 - countdown) / 10) * circumference;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* UPI Payment QR Popup */}
      {showUPIPopup && upiPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            {paymentDone ? (
              /* Payment Success */
              <div className="py-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <svg className="h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-5 text-2xl font-bold text-emerald-700 dark:text-emerald-400">Payment Successful!</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">₹{total.toFixed(2)} paid via UPI</p>
                <p className="mt-1 text-xs text-slate-400">Redirecting to orders...</p>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Scan & Pay</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Open PhonePe / GPay / any UPI app and scan</p>

                {/* QR Code */}
                <div className="relative mx-auto mt-5 flex w-56 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white p-2 dark:border-slate-700">
                  <img src={upiPayment.qrCode} alt="UPI QR Code" className="h-48 w-48" />
                </div>

                {/* Amount */}
                <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">₹{total.toFixed(2)}</p>
                <p className="mt-1 text-xs text-slate-400">UPI ID: novacart@ybl</p>

                {/* Countdown Timer */}
                <div className="mt-5 flex items-center justify-center gap-3">
                  <svg className="h-14 w-14 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" className="dark:stroke-slate-700" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke={countdown <= 3 ? '#ef4444' : '#8b5cf6'} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{countdown}s</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Auto-confirming payment</p>
                  </div>
                </div>

                {/* Listening pulse */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-500"></span>
                  </span>
                  <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Listening for payment...</span>
                </div>

                {/* Action buttons */}
                <button
                  onClick={placeOrder}
                  disabled={submitting}
                  className="mt-5 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? 'Placing order...' : "I've completed the payment"}
                </button>

                <button
                  onClick={() => {
                    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                    const url = isMobile ? (upiPayment.phonePeLink || upiPayment.upiLink) : (upiPayment.phonePeWebLink || upiPayment.upiLink);
                    window.open(url, '_blank');
                  }}
                  className="mt-2 w-full rounded-full border-2 border-violet-200 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-950/30"
                >
                  Open PhonePe
                </button>

                <button
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setShowUPIPopup(false); }}
                  className="mt-2 text-sm font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Checkout</h1>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Delivery address</label>
              <textarea value={form.delivery_address} onChange={handleChange('delivery_address')} rows={4} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" value={form.delivery_city} onChange={handleChange('delivery_city')} placeholder="City" className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <input type="text" value={form.delivery_state} onChange={handleChange('delivery_state')} placeholder="State" className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" value={form.delivery_pincode} onChange={handleChange('delivery_pincode')} placeholder="Pin code" className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <input type="tel" value={form.phone_number} onChange={handleChange('phone_number')} placeholder="Phone number" className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </div>
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Payment method</h2>
              <div className="space-y-3">
                <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${form.payment_method === 'cod' ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input type="radio" name="payment" value="cod" checked={form.payment_method === 'cod'} onChange={handleChange('payment_method')} className="h-4 w-4 text-sky-600" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Cash on Delivery</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Pay when your order arrives</p>
                  </div>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${form.payment_method === 'card' ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input type="radio" name="payment" value="card" checked={form.payment_method === 'card'} onChange={handleChange('payment_method')} className="h-4 w-4 text-sky-600" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Card Payment</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Credit / Debit card</p>
                  </div>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${form.payment_method === 'upi' ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input type="radio" name="payment" value="upi" checked={form.payment_method === 'upi'} onChange={handleChange('payment_method')} className="h-4 w-4 text-violet-600" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">UPI — PhonePe / GPay / Paytm</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Redirects to your UPI app to pay</p>
                  </div>
                </label>
              </div>
            </div>
            <button type="submit" disabled={submitting} className={`w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${form.payment_method === 'upi' ? 'bg-violet-600 hover:bg-violet-700' : 'bg-sky-600 hover:bg-sky-700'}`}>
              {submitting ? 'Processing...' : form.payment_method === 'upi' ? `Pay ₹${total.toFixed(2)} via UPI` : `Place order - ₹${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Order summary</h2>
            <div className="mt-5 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{item.product.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.quantity} × ₹{item.product.price}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">₹{(item.quantity * Number(item.product.price)).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>₹0.00</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
