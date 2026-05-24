module.exports = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Pricing
  TAX_RATE: parseFloat(process.env.TAX_RATE) || 0.18,
  SHIPPING_COST_STANDARD: 0,
  SHIPPING_COST_EXPRESS: 50,

  // Cart
  MAX_CART_ITEMS: parseInt(process.env.MAX_CART_ITEMS) || 100,
  MIN_ORDER_AMOUNT: 0,

  // Order Status
  ORDER_STATUSES: {
    ORDERED: 'ordered',
    PACKED: 'packed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  },

  // User Roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },

  // Response Messages
  MESSAGES: {
    SUCCESS: 'Operation successful',
    ERROR: 'An error occurred',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    BAD_REQUEST: 'Bad request',
    CONFLICT: 'Resource already exists',
    SERVER_ERROR: 'Internal server error'
  },

  // Constraints
  PASSWORD_MIN_LENGTH: 6,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PRODUCT_NAME_MAX_LENGTH: 255,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 5000,
  REVIEW_COMMENT_MAX_LENGTH: 1000
};
