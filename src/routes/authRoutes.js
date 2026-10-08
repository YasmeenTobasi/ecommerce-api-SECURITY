const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticate'); // استيراد حارس المسارات

// مسار التسجيل: /api/auth/register
router.post('/register', register);

// مسار تسجيل الدخول: /api/auth/login
router.post('/login', login);

// مسار محمي للتجربة (Profile): /api/auth/profile
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "This is protected data",
    user: req.user // بيانات المستخدم المستخرجة من التوكن
  });
});

module.exports = router;