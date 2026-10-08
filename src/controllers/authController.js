const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';
const securityLog = (eventType, identifier, details) => {
  const timestamp = new Date().toISOString();
  console.log(`[SECURITY LOG] [${timestamp}] [Event: ${eventType}] [User: ${identifier || 'N/A'}]`, details);
};

// دالة تسجيل حساب جديد (Register)
async function register(req, res, next) {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // التحقق من الحد الأدنى لطول كلمة المرور
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (full_name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, full_name, email, created_at
    `;
    const values = [full_name || 'User', email, hashedPassword];
    
    const result = await pool.query(query, values);

    // تسجيل الحدث الأمني بنجاح التسجيل (بدون كلمة المرور)
    securityLog('USER_REGISTERED', email, { userId: result.rows[0].id });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0]
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
   
      securityLog('FAILED_LOGIN_ATTEMPT', email, { reason: 'User not found' });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

   
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
    
      securityLog('FAILED_LOGIN_ATTEMPT', email, { reason: 'Incorrect password', userId: user.id });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // توليد الـ JWT Token مع تضمين الـ role بداخله
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

   
    securityLog('SUCCESSFUL_LOGIN', email, { userId: user.id, role: user.role });


    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: token,
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login
};