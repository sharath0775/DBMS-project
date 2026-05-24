const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.param, message: e.msg }))
    });
  }
  next();
};

module.exports = {
  handleValidationErrors,
  
  // Auth validators
  validateRegister: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().isLength({ min: 2, max: 100 }),
    handleValidationErrors
  ],

  validateLogin: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    handleValidationErrors
  ],

  // Product validators
  validateProductFilter: [
    body('category_id').optional().isInt(),
    body('minPrice').optional().isFloat({ min: 0 }),
    body('maxPrice').optional().isFloat({ min: 0 }),
    body('rating').optional().isInt({ min: 0, max: 5 }),
    handleValidationErrors
  ],

  // Cart validators
  validateCartItem: [
    body('product_id').isInt(),
    body('quantity').isInt({ min: 1, max: 100 }),
    handleValidationErrors
  ],

  // Order validators
  validateOrder: [
    body('delivery_address').trim().isLength({ min: 5 }),
    body('delivery_city').trim().isLength({ min: 2 }),
    body('delivery_state').trim().isLength({ min: 2 }),
    body('delivery_pincode').isLength({ min: 5, max: 10 }),
    body('phone_number').matches(/^[0-9]{10}$/),
    body('payment_method').isIn(['upi', 'card', 'debit_card', 'cod', 'wallet']),
    handleValidationErrors
  ]
};
