const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct
} = require("../controllers/productsController");

const { validateProduct } = require("../middleware/validators");
const authenticateToken = require("../middleware/authenticate"); // استيراد المصادقة
const authorize = require("../middleware/authorize"); // استيراد الصلاحيات

const router = express.Router();

// 1. المسارات المتاحة للجميع (أو للعملاء والزوار): عرض المنتجات
router.get("/", getProducts);
router.get("/:id", getProductById);

// 2. المسارات المحمية: مخصصة للـ Admin فقط (إضافة، تعديل، تعطيل)
router.post("/", authenticateToken, authorize('admin'), validateProduct, createProduct);
router.put("/:id", authenticateToken, authorize('admin'), validateProduct, updateProduct);
router.patch("/:id/deactivate", authenticateToken, authorize('admin'), deactivateProduct);

module.exports = router;