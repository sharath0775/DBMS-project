const formatPrice = (price) => {
  return (price / 100).toFixed(2);
};

const calculateDiscount = (original, current) => {
  if (original <= 0) return 0;
  return Math.round(((original - current) / original) * 100);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const generateOrderNumber = (orderId) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `ORD${date}${String(orderId).padStart(6, '0')}`;
};

module.exports = {
  formatPrice,
  calculateDiscount,
  formatDate,
  formatDateTime,
  generateOrderNumber
};
