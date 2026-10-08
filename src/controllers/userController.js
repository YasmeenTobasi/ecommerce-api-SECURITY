const pool = require('../config/database');

// جلب بيانات مستخدم محدد بالـ ID مع حماية IDOR
async function getUserById(req, res, next) {
  try {
    const requestedId = req.params.id;

    // الشرط الأمني (منع IDOR): السماح فقط إذا كان نفس المستخدم أو Admin
    if (req.user.id != requestedId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to access this user data"
      });
    }

    const result = await pool.query('SELECT id, full_name, email, role, created_at FROM users WHERE id = $1', [requestedId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// جلب طلب محدد بالـ ID مع حماية IDOR
async function getOrderById(req, res, next) {
  try {
    const orderId = req.params.id;

    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orderResult.rows[0];

    // الشرط الأمني (منع IDOR): مقارنة user_id مع req.user.id أو السماح للأدمن
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to view this order"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserById,
  getOrderById
};