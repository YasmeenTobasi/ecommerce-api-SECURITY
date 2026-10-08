const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // استخراج التوكن من "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is missing"
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    req.user = user; // تخزين بيانات المستخدم داخل الـ request
    next();
  });
}

module.exports = authenticateToken;