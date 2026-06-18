# LocGioGiaSi Backend API

Backend API cho website chuyên bán lọc gió, lọc dầu và phụ tùng ô tô.

## 🚀 Tính năng chính

### 🔧 Quản lý sản phẩm
- ✅ CRUD sản phẩm lọc gió, lọc dầu, lọc nhiên liệu
- ✅ Quản lý thương hiệu xe và mẫu xe tương thích
- ✅ Bộ lọc theo hãng xe, dòng xe, năm sản xuất, giá
- ✅ Tìm kiếm theo tên, mã sản phẩm, mô tả
- ✅ Upload multiple hình ảnh lên Cloudinary
- ✅ Quản lý tồn kho và thông tin chi tiết sản phẩm

### 📝 Quản lý blog & nội dung
- ✅ CRUD bài viết và tin tức
- ✅ Phân loại theo category và tags
- ✅ Bài viết nổi bật (featured posts)
- ✅ Auto-generate SEO friendly slugs
- ✅ Rich text content support

### 🛒 Hệ thống đặt hàng
- ✅ Giỏ hàng session-based (không cần đăng ký)
- ✅ Tạo đơn hàng với thông tin khách hàng
- ✅ Quản lý trạng thái đơn hàng
- ✅ Gửi email thông báo
- ✅ Thống kê đơn hàng theo thời gian

### 👥 Hệ thống quản trị
- ✅ Đăng nhập admin với JWT
- ✅ Bảo mật password với bcrypt
- ✅ Middleware xác thực và phân quyền
- ✅ Quản lý tài khoản admin

### 📧 Liên hệ & hỗ trợ
- ✅ Form liên hệ từ khách hàng
- ✅ Gửi email tự động
- ✅ Quản lý tin nhắn liên hệ
- ✅ Cấu hình thông tin cửa hàng

### 📊 Thống kê & báo cáo
- ✅ Dashboard tổng quan
- ✅ Thống kê sản phẩm bán chạy
- ✅ Báo cáo đơn hàng theo thời gian
- ✅ Thống kê doanh thu

## 🛠️ Công nghệ sử dụng

- **Backend**: Node.js + Express.js
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Security**: bcrypt, helmet, cors
- **Validation**: express-validator
- **Development**: nodemon, dotenv

## ⚙️ Cài đặt

### Yêu cầu hệ thống
- Node.js (>= 16.0.0)
- MongoDB (>= 5.0.0)
- NPM hoặc Yarn

### 1. Clone repository
```bash
git clone <repository-url>
cd locgiogiasi-be
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
1. Sao chép file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

2. Cập nhật các thông tin cấu hình trong file `.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/locgiogiasi

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@locgiogiasi.com

# Server
PORT=3000
NODE_ENV=development

# Cloudinary Configuration (for image upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Default Account
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_EMAIL=admin@locgiogiasi.com
DEFAULT_ADMIN_PASSWORD=admin123456
```

### 4. Khởi tạo database với dữ liệu mẫu
```bash
# Khởi tạo tất cả dữ liệu mẫu (brands, products, blogs, settings)
npm run seed

# Hoặc khởi tạo từng loại riêng biệt:
npm run seed:brands     # Chỉ thương hiệu xe
npm run seed:products   # Chỉ sản phẩm
npm run seed:blogs      # Chỉ bài viết

# Xóa toàn bộ dữ liệu hiện tại
npm run seed:clear
```

### 5. Khởi chạy server
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📁 Cấu trúc dự án

```
locgiogiasi-be/
├── config/                 # Cấu hình hệ thống
│   ├── cloudinary.js       # Cấu hình Cloudinary
│   ├── database.js         # Kết nối MongoDB
│   └── email.js            # Cấu hình email
├── controller/             # Controllers xử lý logic
│   ├── admin.controller.js
│   ├── blog.controller.js
│   ├── brand.controller.js
│   ├── cart.controller.js
│   ├── contact.controller.js
│   ├── order.controller.js
│   ├── product.controller.js
│   ├── settings.controller.js
│   └── statistics.controller.js
├── docs/                   # Tài liệu
│   ├── api-documentation.md
│   └── database-schema.md
├── middleware/             # Middleware functions
│   ├── auth.middleware.js  # Xác thực JWT
│   ├── cart.middleware.js  # Middleware giỏ hàng
│   ├── error.middleware.js # Xử lý lỗi
│   ├── order.middleware.js # Middleware đơn hàng
│   └── upload.middleware.js # Upload files
├── models/                 # Database models
│   ├── admin.model.js
│   ├── blog.model.js
│   ├── brand.model.js
│   ├── cart.model.js
│   ├── contact.model.js
│   ├── order.model.js
│   ├── product.model.js
│   └── settings.model.js
├── routes/                 # API routes
│   ├── admin.routes.js
│   ├── blog.routes.js
│   ├── brand.routes.js
│   ├── cart.routes.js
│   ├── contact.routes.js
│   ├── order.routes.js
│   ├── product.routes.js
│   ├── settings.routes.js
│   ├── statistics.routes.js
│   └── index.js
├── uploads/                # Upload directories
│   ├── avatars/
│   ├── blogs/
│   ├── products/
│   └── temp/
├── utils/                  # Utility functions
│   ├── createDefaultAdmin.js
│   ├── createDirectories.js
│   ├── createTempDirectory.js
│   ├── helpers.js
│   ├── scheduleCleanup.js
│   └── validation.js
├── .env.example            # Ví dụ cấu hình môi trường
├── .gitignore
├── index.js                # Entry point
├── package.json
├── README.md
└── seedData.js             # Dữ liệu mẫu
```

## 🔌 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `GET /api/brands` - Danh sách thương hiệu
- `GET /api/blogs` - Danh sách bài viết
- `GET /api/settings` - Cài đặt website
- `POST /api/contacts` - Gửi liên hệ
- `POST /api/orders` - Tạo đơn hàng

### Admin Endpoints (Yêu cầu authentication)
- `POST /api/admin/login` - Đăng nhập admin
- `GET /api/admin/profile` - Thông tin admin
- `GET /api/statistics/*` - Các API thống kê
- All CRUD operations for: products, brands, blogs, orders, contacts, settings

### Cart Endpoints
- `GET /api/cart/:sessionId` - Xem giỏ hàng
- `POST /api/cart/add` - Thêm sản phẩm
- `PUT /api/cart/update` - Cập nhật số lượng
- `DELETE /api/cart/remove` - Xóa sản phẩm
- `DELETE /api/cart/clear/:sessionId` - Xóa giỏ hàng

Chi tiết đầy đủ API: [📖 API Documentation](./docs/api-documentation.md)

## 🗄️ Database Schema

### Collections chính:
- **admins**: Tài khoản quản trị
- **brands**: Thương hiệu xe và mẫu xe
- **products**: Sản phẩm (lọc gió, lọc dầu, etc.)
- **orders**: Đơn hàng từ khách hàng
- **carts**: Giỏ hàng session-based
- **blogs**: Bài viết và tin tức
- **contacts**: Liên hệ từ khách hàng
- **settings**: Cấu hình website

Chi tiết schema: [📊 Database Schema](./docs/database-schema.md)

## 🧪 Scripts NPM

```bash
# Development
npm run dev              # Chạy server với nodemon
npm run start            # Chạy server production

# Database
npm run seed             # Khởi tạo tất cả dữ liệu mẫu
npm run seed:brands      # Chỉ thương hiệu
npm run seed:products    # Chỉ sản phẩm  
npm run seed:blogs       # Chỉ bài viết
npm run seed:clear       # Xóa toàn bộ dữ liệu

# Maintenance
npm run create-admin     # Tạo tài khoản admin mặc định
npm run cleanup          # Dọn dẹp files tạm
```

## 🚀 Deployment

### 1. Chuẩn bị production
```bash
# Cập nhật biến môi trường
NODE_ENV=production
PORT=3000

# Sử dụng MongoDB Atlas hoặc server riêng
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/locgiogiasi

# Cấu hình Cloudinary production
CLOUDINARY_CLOUD_NAME=production-cloud-name
```

### 2. Deploy lên VPS/Server
```bash
# Clone code
git clone <repository-url>
cd locgiogiasi-be

# Cài đặt dependencies
npm install --production

# Khởi tạo dữ liệu
npm run seed

# Start với PM2
npm install -g pm2
pm2 start index.js --name "locgiogiasi-api"
pm2 startup
pm2 save
```

### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.locgiogiasi.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Maintenance

### Backup Database
```bash
# Backup toàn bộ database
mongodump --uri="mongodb://localhost:27017/locgiogiasi" --out=./backup/$(date +%Y%m%d)

# Restore database
mongorestore --uri="mongodb://localhost:27017/locgiogiasi" ./backup/20240115
```

### Cleanup Tasks
```bash
# Dọn dẹp files upload tạm
npm run cleanup

# Xóa cart sessions hết hạn (tự động chạy)
# Xóa order logs cũ hơn 1 năm
```

### Logs & Monitoring
```bash
# Xem logs PM2
pm2 logs locgiogiasi-api

# Monitor performance
pm2 monit
```

## 🐞 Troubleshooting

### Lỗi thường gặp:

#### 1. Không kết nối được MongoDB
```bash
# Kiểm tra MongoDB đang chạy
mongosh --eval "db.runCommand({connectionStatus:1})"

# Kiểm tra connection string
echo $MONGODB_URI
```

#### 2. Lỗi upload hình ảnh
```bash
# Kiểm tra cấu hình Cloudinary
curl -X GET "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/usage"
```

#### 3. Lỗi gửi email
```bash
# Kiểm tra email configuration
npm run test:email
```

#### 4. Lỗi JWT token
```bash
# Kiểm tra JWT secret
echo $JWT_SECRET
```

### Performance Issues:

#### 1. Database slow queries
```javascript
// Enable MongoDB profiling
db.setProfilingLevel(2, { slowms: 100 })

// Xem slow queries
db.system.profile.find().sort({ts: -1}).limit(5)
```

#### 2. Memory leaks
```bash
# Monitor memory usage
pm2 show locgiogiasi-api
```

## 🔐 Security

### Best Practices:
- ✅ Passwords được hash với bcrypt
- ✅ JWT tokens có thời gian hết hạn
- ✅ Input validation với express-validator  
- ✅ CORS configuration
- ✅ Rate limiting trên sensitive endpoints
- ✅ File upload security (type checking, size limits)
- ✅ NoSQL injection prevention
- ✅ XSS protection

### Security Headers:
```javascript
// Tự động apply bởi helmet middleware
Content-Security-Policy
X-Content-Type-Options
X-Frame-Options
X-XSS-Protection
```

## 🧪 Testing

### Manual Testing:
```bash
# Test API endpoints
curl -X GET http://localhost:3000/api/health

# Test authentication
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}'
```

### Load Testing:
```bash
# Sử dụng Apache Bench
ab -n 1000 -c 10 http://localhost:3000/api/products

# Hoặc sử dụng wrk
wrk -t12 -c400 -d30s http://localhost:3000/api/products
```

## 📝 Changelog

### Version 2.0.0 (Current)
- ✅ Cấu trúc lại models với validation tốt hơn
- ✅ Cập nhật seedData với dữ liệu phong phú
- ✅ Thêm middleware cập nhật timestamps
- ✅ Tối ưu hóa indexes database
- ✅ Cải thiện error handling
- ✅ Thêm API documentation chi tiết
- ✅ Thêm database schema documentation

### Version 1.0.0 
- ✅ Core API functionality
- ✅ Admin authentication
- ✅ Product, Brand, Order management
- ✅ Blog và Contact system
- ✅ File upload với Cloudinary
- ✅ Email notifications

## 🤝 Contributing

### Setup Development:
1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Submit Pull Request

### Code Standards:
- Sử dụng ES6+ syntax
- Tuân thủ ESLint rules
- Comment code cho logic phức tạp
- Write descriptive commit messages
- Update documentation

## 📞 Support

### Issues & Bugs:
- Tạo issue trên GitHub repository
- Cung cấp đầy đủ thông tin: OS, Node version, error logs

### Feature Requests:
- Mô tả chi tiết feature mong muốn
- Giải thích use case và lợi ích

### Contact:
- Email: developer@locgiogiasi.com
- GitHub Issues: [Repository Issues](./issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for LocGioGiaSi**
- Drop collection `carts`
- Loại bỏ reference đến cart trong orders
- Cập nhật cấu trúc database phù hợp với quy trình mới

**Dữ liệu mẫu bao gồm:**
- 6 hãng xe phổ biến: Toyota, Honda, Hyundai, Mazda, Kia, Ford
- Mỗi hãng có 5 dòng xe với các năm sản xuất
- 5 sản phẩm locgiogiasi mẫu với đầy đủ thông tin
- 2 blog posts mẫu
- Cấu hình website mặc định

⚠️ **Lưu ý**: Lệnh seed sẽ xóa toàn bộ dữ liệu cũ và tạo mới!

## Mô hình Database

Hệ thống sử dụng MongoDB với các collection chính sau:

### 📊 **Database Schema Diagram**

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     PRODUCTS    │       │     ORDERS      │       │      BLOGS      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ _id: ObjectId   │       │ _id: ObjectId   │       │ _id: ObjectId   │
│ name: String    │       │ orderNumber: String│     │ title: String   │
│ brand: String   │       │ customer: Object│       │ slug: String    │
│ model: String   │       │ items: [        │       │ content: String │
│ year: Number    │       │   product: ObjectId │ ◄─┤ excerpt: String │
│ price: Number   │       │   quantity: Number │     │ featuredImage: String│
│ description: String│     │   price: Number │       │ author: String  │
│ specifications: Obj│     │   totalPrice: Number│   │ category: String│
│ images: [String]│       │ ]               │       │ status: String  │
│ featured: Boolean│      │ totalAmount: Number│    │ status: String  │
│ status: String  │       │ status: String  │       │ featured: Boolean│
│ createdAt: Date │       │ paymentMethod: String│  │ publishDate: Date│
│ updatedAt: Date │       │ orderDate: Date │       │ createdAt: Date │
└─────────────────┘       └─────────────────┘       │ updatedAt: Date │
                                                    └─────────────────┘
                                                                      
┌─────────────────┐       ┌─────────────────┐                      
│     ADMINS      │       │    BRANDS       │                      
├─────────────────┤       ├─────────────────┤                      
│ _id: ObjectId   │       │ _id: ObjectId   │                      
│ username: String│       │ name: String    │                      
│ email: String   │       │ logo: String    │                      
│ password: String│       │ description: String│                   
│ lastLogin: Date │       │ isActive: Boolean│                     
│ createdAt: Date │       │ createdAt: Date │                      
│ updatedAt: Date │       │ updatedAt: Date │                      
│ createdAt: Date │                                                
│ updatedAt: Date │                                                
└─────────────────┘        
```

### 📋 **Collection Details**

#### **1. Products Collection**
```javascript
{
  _id: ObjectId,
  name: String,              // Tên sản phẩm
  code: String,              // Mã lọc (unique)
  brand: String,             // Hãng xe
  carModels: [String],       // Các dòng xe phù hợp
  year: Number,              // Năm sản xuất
  price: Number,             // Giá bán
  description: String,       // Mô tả
  images: [{
    public_id: String,       // Cloudinary public ID
    url: String,             // URL hình ảnh
    width: Number,           // Chiều rộng
    height: Number,          // Chiều cao
    alt: String              // Alt text
  }],
  stock: Number,             // Số lượng tồn kho
  category: String,          // Danh mục (default: 'LocGioGiaSi')
  origin: String,            // Xuất xứ
  material: String,          // Chất liệu
  dimensions: String,        // Kích thước
  warranty: String,          // Thời gian bảo hành
  isActive: Boolean,         // Trạng thái kích hoạt
  createdAt: Date,
  updatedAt: Date
}
```

#### **2. Orders Collection**
```javascript
{
  _id: ObjectId,
  orderNumber: String,       // Mã đơn hàng (ORD20250710XXXX)
  customer: {
    name: String,            // Tên khách hàng
    email: String,           // Email
    phone: String,           // Số điện thoại
    address: String,         // Địa chỉ
    city: String,            // Thành phố
    district: String,        // Quận/huyện
    ward: String            // Phường/xã
  },
  items: [{
    product: ObjectId,       // Tham chiếu đến Products
    quantity: Number,        // Số lượng đặt
    price: Number,           // Giá tại thời điểm đặt
    totalPrice: Number       // Tổng giá
  }],
  totalAmount: Number,       // Tổng tiền đơn hàng
  status: String,            // pending/confirmed/processing/completed/cancelled
  notes: String,             // Ghi chú của khách hàng
  paymentMethod: String,     // cash/bank_transfer
  orderDate: Date,           // Ngày đặt hàng
  updatedAt: Date
}
```

#### **3. Blogs Collection**
```javascript
{
  _id: ObjectId,
  title: String,             // Tiêu đề bài viết
  slug: String,              // URL-friendly version of title
  content: String,           // Nội dung HTML
  excerpt: String,           // Tóm tắt (≤ 500 ký tự)
  featuredImage: String,     // URL hình đại diện
  author: String,            // Tác giả
  category: String,          // Danh mục
  tags: [String],            // Tags
  status: String,            // draft/published/archived
  featured: Boolean,         // Bài viết nổi bật
  publishDate: Date,         // Ngày xuất bản
  createdAt: Date,
  updatedAt: Date
}
```

#### **4. Admins Collection**
```javascript
{
  _id: ObjectId,
  username: String,          // Tên đăng nhập (unique)
  email: String,             // Email (unique)
  password: String,          // Mật khẩu đã hash
  lastLogin: Date,           // Lần đăng nhập cuối
  createdAt: Date,
  updatedAt: Date
}
```

### 🔗 **Relationships (Mối quan hệ)**

1. **Products ↔ Orders**: Một sản phẩm có thể có trong nhiều đơn hàng
2. **Brands ↔ Products**: Một thương hiệu có thể có nhiều sản phẩm
3. **Admins → Blogs**: Admin tạo và quản lý blog posts

### 📈 **Indexes (Chỉ mục)**

```javascript
// Products
db.products.createIndex({ "name": "text", "description": "text", "tags": "text", "code": "text" })
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "brand": 1 })
db.products.createIndex({ "price": 1 })
db.products.createIndex({ "isActive": 1 })
db.products.createIndex({ "code": 1 })
db.products.createIndex({ "carModels": 1 })
db.products.createIndex({ "year": 1 })

// Orders
db.orders.createIndex({ "orderNumber": 1 })
db.orders.createIndex({ "customer.email": 1 })
db.orders.createIndex({ "orderDate": -1 })
db.orders.createIndex({ "status": 1 })

// Blogs
db.blogs.createIndex({ "slug": 1 })
db.blogs.createIndex({ "title": "text", "content": "text" })
db.blogs.createIndex({ "category": 1, "status": 1 })
db.blogs.createIndex({ "publishDate": -1 })

// Admins
db.admins.createIndex({ "username": 1 })
db.admins.createIndex({ "email": 1 })

// Brands
db.brands.createIndex({ "name": 1 })
db.brands.createIndex({ "isActive": 1 })
```

## API Endpoints

### Sản phẩm
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/search/:code` - Tìm kiếm theo mã lọc
- `GET /api/products/brand/:brand` - Lấy sản phẩm theo hãng xe
- `GET /api/products/car-model/:carModel` - Lấy sản phẩm theo dòng xe
- `POST /api/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)
- `PATCH /api/products/:id/status` - Cập nhật trạng thái sản phẩm (Admin)

### Đơn hàng
- `POST /api/orders/` - Tạo đơn hàng từ danh sách sản phẩm
- `GET /api/orders/track/:orderNumber` - Tra cứu đơn hàng bằng mã
- `GET /api/orders` - Lấy danh sách đơn hàng (Admin)
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng (Admin)
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin)
- `DELETE /api/orders/:id` - Xóa đơn hàng (Admin)

### Blog
- `GET /api/blogs` - Lấy danh sách blog
- `GET /api/blogs/:slug` - Lấy chi tiết blog
- `GET /api/blogs/featured` - Lấy blog nổi bật
- `POST /api/blogs` - Tạo blog mới (Admin)
- `PUT /api/blogs/:id` - Cập nhật blog (Admin)
- `DELETE /api/blogs/:id` - Xóa blog (Admin)

### Quản trị
- `POST /api/admin/login` - Đăng nhập admin
- `GET /api/admin/profile` - Lấy thông tin admin
- `PUT /api/admin/profile` - Cập nhật thông tin admin
- `PUT /api/admin/change-password` - Đổi mật khẩu

### Liên hệ
- `POST /api/contacts` - Gửi email liên hệ (không lưu database)

### Thống kê
- `GET /api/statistics/dashboard` - Thống kê dashboard tổng quan (Admin)
- `GET /api/statistics/products` - Thống kê sản phẩm (Admin)
- `GET /api/statistics/orders` - Thống kê đơn hàng và trạng thái liên hệ (Admin)
- `GET /api/statistics/contacts` - Thống kê liên hệ theo thời gian (Admin)

## Cấu trúc dự án

```
locgiogiasi-be/
├── config/
│   ├── database.js          # Cấu hình database
│   └── email.js             # Cấu hình email
├── controller/
│   ├── admin.controller.js
│   ├── blog.controller.js
│   ├── contact.controller.js
│   ├── order.controller.js
│   ├── product.controller.js
│   └── statistics.controller.js
├── middleware/
│   ├── auth.middleware.js   # Xác thực và phân quyền
│   ├── error.middleware.js  # Xử lý lỗi
│   ├── order.middleware.js  # Validation đơn hàng
│   └── upload.middleware.js # Upload file
├── models/
│   ├── admin.model.js
│   ├── blog.model.js
│   ├── brand.model.js
│   ├── order.model.js
│   ├── product.model.js
│   └── settings.model.js
├── routes/
│   ├── admin.routes.js
│   ├── blog.routes.js
│   ├── cart.routes.js
│   ├── contact.routes.js
│   ├── order.routes.js
│   ├── product.routes.js
│   ├── statistics.routes.js
│   └── index.js
├── utils/
│   ├── createDefaultAdmin.js
│   ├── createDirectories.js
│   ├── helpers.js
│   └── validation.js
├── uploads/                 # Thư mục lưu file upload
├── .env.example            # Template file môi trường
├── .gitignore
├── index.js                # File chính
├── package.json
└── README.md
```

## Tài khoản admin mặc định

Khi chạy lần đầu, hệ thống sẽ tự động tạo tài khoản admin:
- **Username**: admin
- **Password**: 123456
- **Email**: admin@locgiogiasi.com

⚠️ **Lưu ý**: Hãy đổi mật khẩu sau khi đăng nhập lần đầu!

## Tính năng bảo mật

- JWT Authentication
- Password hashing với bcrypt
- Input validation
- File upload security
- CORS configuration
- Rate limiting (recommended for production)

## Deployment

### Sử dụng PM2 (khuyến nghị)
```bash
npm install -g pm2
pm2 start index.js --name "locgiogiasi-api"
pm2 startup
pm2 save
```

### Sử dụng Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

## Đóng góp

1. Fork dự án
2. Tạo branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Liên hệ

- Email: info@locgiogiasi.com
- Phone: 0123.456.789

## Tài liệu chi tiết

### 📖 Documentation
- [📋 Data Model Specification](./docs/DATA_MODEL_SPECIFICATION.md) - Chi tiết về các model và trường dữ liệu
- [✅ Validation Rules](./docs/VALIDATION_RULES.md) - Quy tắc validate cho từng trường
- [🔌 API Usage Guide](./docs/API_USAGE_GUIDE.md) - Hướng dẫn sử dụng API endpoints
- [🛠️ Product API](./docs/PRODUCT_API.md) - Chi tiết API sản phẩm

### 🎯 Quick Links
- [Mô hình Database](#mô-hình-database) - Schema và relationships
- [API Endpoints](#api-endpoints) - Danh sách tất cả endpoints
- [Cấu trúc dự án](#cấu-trúc-dự-án) - Tổ chức file và folder
