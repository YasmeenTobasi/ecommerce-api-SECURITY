# E-commerce Backend API

مشروع Backend API آمن ومتقدم مصمم باستخدام Node.js, Express.js و PostgreSQL (على Neon)، يهدف المشروع إلى إدارة المنتجات، الفئات، وعمليات المصادقة (Auth) بكفاءة عالية مع تطبيق أعلى معايير الأمان وحماية البيانات.

## الميزات الرئيسية :
- **MVC Architecture:** فصل واضح للملفات والمسارات (Routes)، وحدات التحكم (Controllers)، وإدارة قاعدة البيانات (Config & Middleware).
- **قواعد البيانات السحابية:** الاتصال بقاعدة بيانات PostgreSQL على منصة Neon باستخدام الاستعلامات المبرمجة (Parameterized Queries) لحماية النظام من ثغرات حقن SQL.
- **الحماية المتقدمة (Helmet & CORS):** استخدام Helmet لتأمين الـ HTTP Headers وتفعيل سياسة CSP، مع إعداد CORS مقيد للنطاقات المسموحة فقط.
- **تحديد معدل الطلبات (Rate Limiting):** تطبيق حماية عامة للـ API، بالإضافة إلى حد صارم على مسار تسجيل الدخول (5 محاولات كحد أقصى) لمنع هجمات التخمين وإرجاع كود الاستجابة `429 Too Many Requests`.
- **إدارة وتسجيل الأخطاء الآمنة:** وسيط مركزي لمعالجة الأخطاء (Global Error Handler) يمنع تسرب تفاصيل الـ Stack Trace أو مسارات النظام للمستخدم.
- **التسجيل الأمني (Secure Logging):** توثيق الأحداث الأمنية (فشل تسجيل الدخول أو النجاح) مع تسجيل الطوابع الزمنية ومعرفات المستخدمين وتجنب تخزين أي كلمات مرور أو بيانات حساسة.
- **استجابة منظمة:** توفير ردود موحدة بصيغة JSON مع أكواد الحالة القياسية لـ HTTP (`200`, `201`, `400`, `401`, `404`, `409`, `429`, `500`).

## التقنيات المستخدمة :
- **Node.js:** بيئة التشغيل
- **Express.js:** الإطار البرمجي
- **PostgreSQL (Neon):** قاعدة البيانات السحابية
- **Bcryptjs & Jsonwebtoken:** لتشفير كلمات المرور وإدارة المصادقة عبر الـ JWT
- **Helmet & Express-Rate-Limit:** لحماية وتأمين التطبيق والتحكم بمعدل الطلبات
- **Dotenv & Nodemon:** لإدارة متغيرات البيئة ومتابعة التطوير المحلي

## هيكلية المشروع :
ecommerce-api/
│
├── src/
│   ├── config/
│   │   └── database.js      
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoriesController.js 
│   │   └── productsController.js     
│   ├── middleware/
│   │   └── errorHandler.js  
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoriesRoutes.js     
│   │   └── productsRoutes.js      
│   └── app.js             
│
├── .env                 
├── .env.example             
├── .gitignore             
├── package.json             
└── server.js                

## طريقة التثبيت والتشغيل :
1. استنساخ المستودع وتثبيت الحزم المطلوبة:
   ```bash
   git clone <your-repository-url>
   cd ecommerce-api
   npm install

   مسارات الـ API المتاحة :
1. المصادقة (Authentication)
POST /api/auth/register - تسجيل مستخدم جديد (مع تشفير كلمة المرور والتحقق من الحد الأدنى لطولها).

POST /api/auth/login - تسجيل الدخول (مع تفعيل Rate Limit وتوليد توكن JWT وتسجيل الأحداث أمنياً).

2. المنتجات (Products)
GET /api/products - جلب جميع المنتجات.

POST /api/products - إضافة منتج جديد (مع تطبيق آليات الحماية وإدخال النصوص).

3. الفئات (Categories)
GET /api/categories - جلب جميع الفئات.

POST /api/categories - إضافة فئة جديدة.

الاختبارات (Testing)
يمكنك استيراد ملف اختبارات Postman الموجود في المشروع (E-commerce API.json) إلى تطبيق Postman لفحص جميع المسارات، واختبار حالات الأمان مثل تجاوز معدل الطلبات (429) وفحص استجابات الأخطاء الآمنة.