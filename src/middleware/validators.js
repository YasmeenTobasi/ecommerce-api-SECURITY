const { body, validationResult } = require('express-validator');
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required').isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
  body('stock_quantity').isInt({ min: 0 }).withMessage('Stock quantity must be a valid non-negative integer'),
  validate
];

const validateRegister = [
  body('email').isEmail().withMessage('Invalid email address format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate
];

module.exports = { validateProduct, validateRegister };