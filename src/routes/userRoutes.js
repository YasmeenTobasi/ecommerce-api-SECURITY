const express = require('express');
const router = express.Router();
const { getUserById, getOrderById } = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticate');

// مسار جلب المستخدم بالـ ID (محمي بـ IDOR)
router.get('/users/:id', authenticateToken, getUserById);

// مسار جلب الطلب بالـ ID (محمي بـ IDOR)
router.get('/orders/:id', authenticateToken, getOrderById);

module.exports = router;