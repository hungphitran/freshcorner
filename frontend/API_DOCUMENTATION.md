# Tài liệu API - Hệ thống LocGioGiaSi

## Tổng quan
API RESTful được xây dựng với Node.js, Express.js và MongoDB để quản lý cửa hàng bán phụ tùng ô tô trực tuyến.

**Base URL**: `http://localhost:3000/api`
**Authentication**: JWT Bearer Token (cho các endpoint quản trị)

---

## Endpoints Tổng quan

```
GET /api/                    # API documentation
GET /api/health             # Health check
```

---

## 1. Authentication & Admin Management
**Base Path**: `/api/admin`

### 1.1 Đăng nhập Admin
```http
POST /api/admin/login
```

**Request Body**:
```json
{
  "username": "string",    // Username hoặc email
  "password": "string"     // Mật khẩu
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "admin": {
    "_id": "admin_id",
    "username": "admin_username",
    "email": "admin@email.com",
    "lastLogin": "2025-07-11T00:00:00.000Z"
  }
}
```

### 1.2 Lấy thông tin Admin hiện tại
```http
GET /api/admin/profile
Authorization: Bearer {token}
```

### 1.3 Cập nhật thông tin Admin
```http
PUT /api/admin/profile
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "email": "new_email@example.com"
}
```

### 1.4 Đổi mật khẩu
```http
PUT /api/admin/change-password
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "currentPassword": "current_password",
  "newPassword": "new_password"
}
```

### 1.5 Quản lý Admin (Super Admin)
```http
GET /api/admin                    # Lấy danh sách admin
POST /api/admin                   # Tạo admin mới
PUT /api/admin/:id               # Cập nhật admin
DELETE /api/admin/:id            # Xóa admin
```

---

## 2. Brand Management
**Base Path**: `/api/brands`

### 2.1 Lấy danh sách hãng xe
```http
GET /api/brands
```

**Query Parameters**:
- `isActive`: `true|false` - Lọc theo trạng thái

**Response**:
```json
{
  "success": true,
  "brands": [
    {
      "_id": "brand_id",
      "name": "Toyota",
      "carModels": [
        {
          "_id": "model_id",
          "name": "Camry",
          "years": ["2020", "2021", "2022"],
          "isActive": true
        }
      ],
      "isActive": true
    }
  ]
}
```

### 2.2 Lấy thông tin hãng xe
```http
GET /api/brands/:id
```

### 2.3 Lấy danh sách dòng xe theo hãng
```http
GET /api/brands/:id/car-models
```

### 2.4 Tạo hãng xe mới (Admin)
```http
POST /api/brands
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "name": "Honda",
  "isActive": true
}
```

### 2.5 Cập nhật hãng xe (Admin)
```http
PUT /api/brands/:id
Authorization: Bearer {token}
```

### 2.6 Xóa hãng xe (Admin)
```http
DELETE /api/brands/:id
Authorization: Bearer {token}
```

### 2.7 Quản lý dòng xe (Admin)
```http
POST /api/brands/:brandId/car-models          # Thêm dòng xe
PUT /api/brands/:brandId/car-models/:modelId   # Cập nhật dòng xe
DELETE /api/brands/:brandId/car-models/:modelId # Xóa dòng xe
```

**Request Body (Car Model)**:
```json
{
  "name": "Civic",
  "years": ["2020", "2021", "2022", "2023"],
  "isActive": true
}
```

---

## 3. Product Management
**Base Path**: `/api/products`

### 3.1 Lấy danh sách sản phẩm
```http
GET /api/products
```

**Query Parameters**:
- `page`: Số trang (default: 1)
- `limit`: Số sản phẩm/trang (default: 10)
- `search`: Tìm kiếm theo tên, mô tả, tags
- `brand`: ID hãng xe
- `carModel`: Tên dòng xe
- `minPrice`: Giá tối thiểu
- `maxPrice`: Giá tối đa
- `isActive`: `true|false`

**Response**:
```json
{
  "success": true,
  "products": [
    {
      "_id": "product_id",
      "name": "LocGioGiaSi Toyota Camry",
      "code": "LG-TOY-CAM-001",
      "brand": {
        "_id": "brand_id",
        "name": "Toyota"
      },
      "compatibleModels": [
        {
          "carModelId": "model_id",
          "carModelName": "Camry",
          "years": ["2020", "2021"]
        }
      ],
      "price": 250000,
      "description": "LocGioGiaSi chất lượng cao...",
      "images": [
        {
          "public_id": "cloudinary_id",
          "url": "https://cloudinary.com/image.jpg",
          "width": 800,
          "height": 600,
          "alt": "LocGioGiaSi Toyota Camry"
        }
      ],
      "stock": 10,
      "specifications": {
        "material": "Giấy lọc cao cấp",
        "dimensions": "245 x 200 x 30mm"
      },
      "tags": ["locgiogiasi", "toyota", "camry"],
      "isActive": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3.2 Tìm sản phẩm theo mã code
```http
GET /api/products/search/:code
```

### 3.3 Lấy sản phẩm theo hãng xe
```http
GET /api/products/brand/:brand
```

### 3.4 Lấy sản phẩm theo dòng xe
```http
GET /api/products/car-model/:carModel
```

### 3.5 Lấy thông tin sản phẩm
```http
GET /api/products/:id
```

### 3.6 Lấy dòng xe tương thích theo hãng
```http
GET /api/products/brand/:brandId/car-models
```

### 3.7 Tạo sản phẩm mới (Admin)
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (FormData)**:
```
name: "LocGioGiaSi Honda Civic"
code: "LG-HON-CIV-001"
brand: "brand_object_id"
compatibleModels: JSON.stringify([{
  carModelId: "model_id",
  carModelName: "Civic",
  years: ["2020", "2021"]
}])
price: 280000
description: "Mô tả sản phẩm..."
stock: 15
specifications: JSON.stringify({
  "material": "Giấy lọc cao cấp",
  "dimensions": "250 x 200 x 35mm"
})
tags: JSON.stringify(["locgiogiasi", "honda", "civic"])
images: [File, File, ...] // Upload files
```

### 3.8 Cập nhật sản phẩm (Admin)
```http
PUT /api/products/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

### 3.9 Xóa sản phẩm (Admin)
```http
DELETE /api/products/:id
Authorization: Bearer {token}
```

### 3.10 Cập nhật trạng thái sản phẩm (Admin)
```http
PATCH /api/products/:id/status
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "isActive": false
}
```

---

## 4. Order Management
**Base Path**: `/api/orders`

### 4.1 Tạo đơn hàng
```http
POST /api/orders
```

**Request Body**:
```json
{
  "customer": {
    "name": "Nguyễn Văn A",
    "email": "customer@email.com",
    "phone": "0123456789",
    "address": "123 Đường ABC",
    "city": "TP.HCM",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé"
  },
  "items": [
    {
      "productId": "product_object_id",
      "quantity": 2
    }
  ],
  "notes": "Ghi chú đặc biệt"
}
```

**Response**:
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "orderNumber": "ORD-20250711-1234",
    "customer": { /* customer info */ },
    "items": [
      {
        "product": { /* populated product info */ },
        "quantity": 2,
        "price": 250000
      }
    ],
    "status": "not contacted",
    "totalAmount": 500000,
    "totalItems": 2,
    "orderDate": "2025-07-11T00:00:00.000Z"
  }
}
```

### 4.2 Tra cứu đơn hàng
```http
GET /api/orders/track/:orderNumber
```

### 4.3 Lấy danh sách đơn hàng (Admin)
```http
GET /api/orders
Authorization: Bearer {token}
```

**Query Parameters**:
- `page`: Số trang
- `limit`: Số đơn hàng/trang
- `status`: Trạng thái đơn hàng
- `startDate`: Ngày bắt đầu (YYYY-MM-DD)
- `endDate`: Ngày kết thúc (YYYY-MM-DD)

### 4.4 Lấy thông tin đơn hàng (Admin)
```http
GET /api/orders/:id
Authorization: Bearer {token}
```

### 4.5 Cập nhật trạng thái đơn hàng (Admin)
```http
PUT /api/orders/:id/status
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "status": "contacted"
}
```

### 4.6 Xóa đơn hàng (Admin)
```http
DELETE /api/orders/:id
Authorization: Bearer {token}
```

---

## 5. Blog Management
**Base Path**: `/api/blogs`

### 5.1 Lấy danh sách blog (Public)
```http
GET /api/blogs
```

**Query Parameters**:
- `page`: Số trang
- `limit`: Số bài/trang
- `category`: Danh mục
- `tag`: Tag
- `search`: Tìm kiếm

**Response**:
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "blog_id",
      "title": "Cách bảo dưỡng locgiogiasi ô tô",
      "slug": "cach-bao-duong-loc-gio-o-to",
      "content": "Nội dung bài viết...",
      "featuredImage": "https://cloudinary.com/blog-image.jpg",
      "author": "Admin",
      "category": "Bảo dưỡng",
      "tags": ["bảo dưỡng", "locgiogiasi"],
      "status": "published",
      "featured": false,
      "publishDate": "2025-07-11T00:00:00.000Z"
    }
  ]
}
```

### 5.2 Lấy blog nổi bật
```http
GET /api/blogs/featured
```

### 5.3 Lấy danh mục blog
```http
GET /api/blogs/categories
```

### 5.4 Lấy tags blog
```http
GET /api/blogs/tags
```

### 5.5 Lấy blog mới nhất
```http
GET /api/blogs/recent
```

**Query Parameters**:
- `limit`: Số lượng bài (default: 5)

### 5.6 Lấy blog theo slug
```http
GET /api/blogs/:slug
```

### 5.7 Quản lý blog (Admin)
```http
GET /api/blogs/admin/all       # Lấy tất cả blog (bao gồm draft)
GET /api/blogs/admin/:id       # Lấy blog theo ID
POST /api/blogs               # Tạo blog mới
PUT /api/blogs/:id            # Cập nhật blog
DELETE /api/blogs/:id         # Xóa blog
```

**Request Body (Tạo/Cập nhật blog)**:
```json
{
  "title": "Tiêu đề bài viết",
  "content": "Nội dung bài viết đầy đủ...",
  "author": "Tên tác giả",
  "category": "Danh mục",
  "tags": ["tag1", "tag2"],
  "featuredImage": "URL_ảnh_đại_diện",
  "status": "published",
  "featured": true
}
```

---

## 6. Contact Management
**Base Path**: `/api/contacts`

### 6.1 Gửi liên hệ
```http
POST /api/contacts
```

**Request Body**:
```json
{
  "name": "Nguyễn Văn B",
  "email": "contact@email.com",
  "phone": "0987654321",
  "subject": "Hỏi về sản phẩm",
  "message": "Tôi muốn hỏi về..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email đã được gửi thành công"
}
```

---

## 7. Settings Management
**Base Path**: `/api/settings`

### 7.1 Lấy cài đặt cửa hàng
```http
GET /api/settings
```

**Response**:
```json
{
  "success": true,
  "settings": {
    "_id": "settings_id",
    "storeName": "LocGioGiaSi",
    "address": "123 Đường XYZ, Quận ABC, TP.HCM",
    "phone": "0123456789",
    "email": "info@locgiogiasi.com",
    "logo": "https://cloudinary.com/logo.png"
  }
}
```

### 7.2 Cập nhật cài đặt (Admin)
```http
PUT /api/settings
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "storeName": "LocGioGiaSi",
  "address": "123 Đường XYZ mới",
  "phone": "0123456789",
  "email": "info@locgiogiasi.com",
  "logo": "https://cloudinary.com/new-logo.png"
}
```

---

## 8. Statistics Management
**Base Path**: `/api/statistics`

### 8.1 Thống kê dashboard (Admin)
```http
GET /api/statistics/dashboard
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalProducts": 150,
    "totalOrders": 45,
    "totalRevenue": 12500000,
    "totalCustomers": 38,
    "recentOrders": [ /* 5 đơn hàng gần nhất */ ],
    "topProducts": [ /* 5 sản phẩm bán chạy */ ]
  }
}
```

### 8.2 Thống kê sản phẩm (Admin)
```http
GET /api/statistics/products
Authorization: Bearer {token}
```

### 8.3 Thống kê đơn hàng (Admin)
```http
GET /api/statistics/orders
Authorization: Bearer {token}
```

### 8.4 Thống kê liên hệ (Admin)
```http
GET /api/statistics/contacts
Authorization: Bearer {token}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email không hợp lệ"
    }
  ]
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Authentication

### JWT Token
- Token được gửi trong header: `Authorization: Bearer {token}`
- Token có thời hạn (cấu hình trong .env)
- Token chứa thông tin admin ID và expiration

### Protected Routes
Tất cả routes có prefix `/admin` (trừ login) và các routes quản lý cần authentication:
- Product management (POST, PUT, DELETE)
- Order management (GET, PUT, DELETE)
- Blog management (POST, PUT, DELETE)
- Settings management (PUT)
- Statistics (tất cả)

---

## File Upload

### Supported Formats
- Images: JPG, JPEG, PNG, WebP
- Max file size: 10MB
- Multiple file upload support

### Cloudinary Integration
- Automatic image optimization
- Multiple size variants
- CDN delivery
- Public ID management

---

## Rate Limiting & Security

### CORS Configuration
- Configurable origins
- Credentials support
- Preflight handling

### Input Validation
- Express-validator for all inputs
- Mongoose schema validation
- File type validation
- Size limits

### Security Headers
- JSON size limits (10MB)
- URL encoding limits
- Error message sanitization

---

*Tài liệu này được cập nhật lần cuối: Tháng 7, 2025*
