const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit"); 
const app = express(); 

const productsRoutes = require("./routes/productsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes"); 
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require('./routes/userRoutes');
const errorHandler = require("./middleware/errorHandler");

app.use(helmet());

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});
app.use('/api/', globalLimiter);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message: { 
    success: false, 
    message: 'Too many login attempts, please try again later.' 
  }
});
app.use('/api/auth/login', loginLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-commerce API is running"
  });
});

app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes); 
app.use("/api/auth", authRoutes); 
app.use('/api', userRoutes); 

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

app.use(errorHandler);

module.exports = app;