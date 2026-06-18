# Tài liệu API - LocGioGiaSi Backend

## Tổng quan

API RESTful cho hệ thống quản lý cửa hàng lọc gió ô tô LocGioGiaSi. API được xây dựng với Node.js, Express.js và MongoDB, cung cấp các endpoint cho frontend, admin panel và mobile app.

**Base URL:** `http://localhost:3000/api`

**API Version:** 1.1.0

**Cập nhật gần nhất:** 2025-07-30

### Thay đổi gần nhất (v1.1.0):
- ✅ **Flexible Customer Info**: Email không còn bắt buộc cho orders và contacts
- ✅ **Smart Email Handling**: Chỉ gửi email xác nhận khi email hợp lệ
- ✅ **Simplified Validation**: Order chỉ cần tên + SĐT, contact chỉ cần tên + SĐT
- ✅ **Address Optional**: Địa chỉ và thành phố không còn bắt buộc
- ✅ **Error Reduction**: Loại bỏ lỗi "Invalid email format" khi email trống
- ✅ **Phone-First Design**: Tối ưu cho đặt hàng qua điện thoại

### Thay đổi trước (v1.0.1):
- ✅ **Product Sorting**: Thêm chức năng sắp xếp sản phẩm theo nhiều tiêu chí

### Tính năng chính:
- ✅ **Product Management**: Quản lý sản phẩm lọc gió với upload hình ảnh
- ✅ **Flexible Order Processing**: Đặt hàng đơn giản với chỉ tên + SĐT, email automation thông minh
- ✅ **Brand & Car Models**: Quản lý hãng xe và dòng xe tương thích
- ✅ **Blog System**: Hệ thống blog với quản lý nội dung
- ✅ **Simple Contact Form**: Form liên hệ linh hoạt với email notification thông minh
- ✅ **Admin Authentication**: JWT-based authentication
- ✅ **Statistics Dashboard**: Thống kê và báo cáo chi tiết
- ✅ **File Upload**: Cloudinary integration cho hình ảnh
- ✅ **Settings Management**: Cài đặt thông tin cửa hàng

### Công nghệ sử dụng:
- **Backend**: Node.js, Express.js
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Token)
- **File Storage**: Cloudinary
- **Email**: Nodemailer (Gmail SMTP)
- **Validation**: Express-validator
- **Upload**: Multer

## Authentication

### JWT Token Authentication

Hệ thống sử dụng JWT (JSON Web Token) để xác thực admin.

**Header format:**
```
Authorization: Bearer <jwt_token>
```

**Token expiry:** 7 days (configurable via `JWT_EXPIRES_IN`)

### Protected Routes
Các route admin yêu cầu authentication:
- Tất cả `/admin/*` routes (trừ login)
- POST, PUT, DELETE operations trên products, blogs, brands
- Statistics endpoints

## API Endpoints

### 1. Admin Management (`/api/admin`)

#### POST `/api/admin/login`
**Mục đích:** Đăng nhập admin

**Request Body:**
```json
{
  "username": "admin",  // username hoặc email
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "username": "admin",
      "email": "admin@example.com"
    }
  }
}
```

#### GET `/api/admin/profile` 🔒
**Mục đích:** Lấy thông tin profile admin hiện tại

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64a7b8c9d1e2f3g4h5i6j7k8",
    "username": "admin", 
    "email": "admin@example.com",
    "lastLogin": "2024-07-12T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT `/api/admin/profile` 🔒
**Mục đích:** Cập nhật thông tin profile

**Request Body:**
```json
{
  "email": "newemail@example.com"
}
```

#### PUT `/api/admin/change-password` 🔒
**Mục đích:** Đổi mật khẩu admin

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### GET `/api/admin` 🔒
**Mục đích:** Lấy danh sách tất cả admin (super admin)

#### POST `/api/admin` 🔒
**Mục đích:** Tạo admin mới (super admin)

**Request Body:**
```json
{
  "username": "newadmin",
  "email": "newadmin@example.com", 
  "password": "password123"
}
```

### 2. Product Management (`/api/products`)

#### GET `/api/products`
**Mục đích:** Lấy danh sách sản phẩm (public)

**Query Parameters:**
- `page` (number): Trang hiện tại (default: 1)
- `limit` (number): Số sản phẩm mỗi trang (default: 12)
- `search` (string): Tìm kiếm theo tên, mã, mô tả
- `brand` (string): Filter theo brand (ObjectId hoặc tên)
- `minPrice` (number): Giá tối thiểu
- `maxPrice` (number): Giá tối đa
- `year` (string): Năm sản xuất
- `carModel` (string): Dòng xe
- `sortBy` (string): Trường sắp xếp (default: 'createdAt')
  - Giá trị hợp lệ: `createdAt`, `updatedAt`, `name`, `price`, `code`
- `sortOrder` (string): Thứ tự sắp xếp (default: 'desc')
  - Giá trị hợp lệ: `asc`, `desc`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "name": "Lọc gió Toyota Camry",
      "code": "TY001",
      "brand": {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k9",
        "name": "Toyota"
      },
      "price": 450000,
      "description": "Lọc gió chính hãng cho Toyota Camry",
      "images": [
        {
          "public_id": "products/sample1",
          "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/products/sample1.jpg",
          "alt": "Lọc gió Toyota Camry"
        }
      ],
      "compatibleModels": [
        {
          "carModelId": "64a7b8c9d1e2f3g4h5i6j7k0",
          "carModelName": "Camry",
          "years": ["2018", "2019", "2020"]
        }
      ],
      "stock": 50,
      "origin": "Japan",
      "isActive": true,
      "createdAt": "2024-07-14T10:30:00.000Z",
      "updatedAt": "2024-07-14T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 150,
    "pages": 13
  }
}
```

**Lưu ý về sắp xếp:**
- Mặc định sản phẩm được sắp xếp theo `createdAt` (mới nhất trước)
- Có thể sắp xếp theo nhiều trường khác nhau: tên, giá, mã sản phẩm, ngày tạo/cập nhật
- Nếu tham số `sortBy` hoặc `sortOrder` không hợp lệ, hệ thống sẽ sử dụng giá trị mặc định
```

#### GET `/api/products/:id`
**Mục đích:** Lấy chi tiết sản phẩm

#### GET `/api/products/search/:code`
**Mục đích:** Tìm sản phẩm theo mã

#### GET `/api/products/brand/:brand`
**Mục đích:** Lấy sản phẩm theo hãng

#### GET `/api/products/brand/:brandId/car-models`
**Mục đích:** Lấy danh sách dòng xe tương thích của hãng xe (cho dropdown khi tạo sản phẩm)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k0",
      "name": "Camry",
      "years": ["2018", "2019", "2020", "2021"],
      "isActive": true
    },
    {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k1", 
      "name": "Corolla",
      "years": ["2019", "2020", "2021", "2022"],
      "isActive": true
    }
  ]
}
```

#### POST `/api/products` 🔒
**Mục đích:** Tạo sản phẩm mới

**Content-Type:** `multipart/form-data`

**Request Body:**
```json
{
  "name": "Lọc gió Toyota Camry",
  "code": "TY001",
  "brand": "64a7b8c9d1e2f3g4h5i6j7k9",
  "compatibleModels": "[{\"carModelId\":\"64a7b8c9d1e2f3g4h5i6j7k0\",\"carModelName\":\"Camry\",\"years\":[\"2018\",\"2019\"]}]",
  "price": 450000,
  "description": "Lọc gió chính hãng",
  "stock": 50,
  "origin": "Japan",
  "material": "Paper filter",
  "dimensions": "30x20x5 cm",
  "warranty": "12 months",
  "images": [File, File] // Upload files
}
```

#### PUT `/api/products/:id` 🔒
**Mục đích:** Cập nhật sản phẩm

#### DELETE `/api/products/:id` 🔒
**Mục đích:** Xóa sản phẩm

#### PATCH `/api/products/:id/status` 🔒
**Mục đích:** Cập nhật trạng thái sản phẩm

**Request Body:**
```json
{
  "isActive": false
}
```

#### GET `/api/products/car-model/:carModel`
**Mục đích:** Lấy sản phẩm theo dòng xe

**Query Parameters:**
- Các tham số tương tự như `/api/products` (page, limit, search, v.v.)

### 3. Brand Management (`/api/brands`)

#### GET `/api/brands`
**Mục đích:** Lấy danh sách hãng xe

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Tìm kiếm theo tên
- `isActive`: Filter theo trạng thái
- `sortBy`, `sortOrder`: Sắp xếp

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k9",
      "name": "Toyota",
      "carModels": [
        {
          "_id": "64a7b8c9d1e2f3g4h5i6j7k0",
          "name": "Camry",
          "years": ["2018", "2019", "2020", "2021"],
          "isActive": true,
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/brands/:id`
**Mục đích:** Lấy chi tiết hãng xe

#### GET `/api/brands/:id/car-models`
**Mục đích:** Lấy danh sách dòng xe của hãng

#### POST `/api/brands` 🔒
**Mục đích:** Tạo hãng xe mới

**Request Body:**
```json
{
  "name": "Toyota",
  "isActive": true
}
```

#### PUT `/api/brands/:id` 🔒
**Mục đích:** Cập nhật thông tin hãng

#### DELETE `/api/brands/:id` 🔒
**Mục đích:** Xóa hãng xe

#### POST `/api/brands/:brandId/car-models` 🔒
**Mục đích:** Thêm dòng xe mới cho hãng

**Request Body:**
```json
{
  "name": "Camry",
  "years": ["2018", "2019", "2020"],
  "isActive": true
}
```

#### PUT `/api/brands/:brandId/car-models/:carModelId` 🔒
**Mục đích:** Cập nhật thông tin dòng xe

#### DELETE `/api/brands/:brandId/car-models/:carModelId` 🔒
**Mục đích:** Xóa dòng xe

### 4. Order Management (`/api/orders`)

#### POST `/api/orders`
**Mục đích:** Tạo đơn hàng mới (public)

**Request Body:**
```json
{
  "customer": {
    "name": "Nguyễn Văn A",        // Required
    "phone": "0123456789",         // Required
    "email": "customer@example.com", // Optional
    "address": "123 Đường ABC",     // Optional
    "city": "Hồ Chí Minh",         // Optional
    "district": "Quận 1",          // Optional
    "ward": "Phường Bến Nghé"      // Optional
  },
  "items": [
    {
      "productId": "64a7b8c9d1e2f3g4h5i6j7k8",
      "quantity": 2
    }
  ],
  "notes": "Ghi chú đặc biệt",      // Optional
  "paymentMethod": "cash"           // Optional, default: "cash"
}
```

**Validation Rules:**
- **Required fields**: `customer.name`, `customer.phone`, `items` (array with at least 1 item)
- **Optional fields**: `customer.email`, `customer.address`, `customer.city`, `customer.district`, `customer.ward`, `notes`, `paymentMethod`
- **Email validation**: Chỉ kiểm tra format khi email được cung cấp
- **Phone validation**: Must match pattern `/^[\d\s\-\+\(\)]{10,}$/`
- **Items validation**: Mỗi item phải có `productId` và `quantity` (số nguyên dương)

**Email Automation:**
- **Admin notification**: Luôn được gửi với tất cả thông tin
- **Customer confirmation**: Chỉ gửi khi email hợp lệ được cung cấp
- **Error handling**: Đơn hàng vẫn tạo thành công ngay cả khi gửi email thất bại

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully. We will contact you soon for quotation.",
  "data": {
    "orderNumber": "ORD-20240712-1234",
    "order": {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "orderNumber": "ORD-20240712-1234",
      "customer": { /* customer info */ },
      "items": [ /* order items */ ],
      "status": "not contacted",
      "totalAmount": 900000,
      "totalItems": 2,
      "orderDate": "2024-07-12T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
```json
// Missing required fields
{
  "success": false,
  "message": "Missing required customer fields: name, phone"
}

// Invalid phone format  
{
  "success": false,
  "message": "Invalid phone number format"
}

// Product not found
{
  "success": false,
  "message": "Product with ID 64a7b8c9d1e2f3g4h5i6j7k8 not found"
}
```

#### GET `/api/orders/track/:orderNumber`
**Mục đích:** Tra cứu đơn hàng bằng số đơn (public)

#### GET `/api/orders` 🔒
**Mục đích:** Lấy danh sách đơn hàng (admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "orderNumber": "ORD-20240712-1234",
        "customer": {
          "name": "Nguyễn Văn A",
          "email": "customer@example.com",
          "phone": "0123456789",
          "address": "123 Đường ABC",
          "city": "Hồ Chí Minh",
          "district": "Quận 1",
          "ward": "Phường Bến Nghé"
        },
        "items": [
          {
            "product": {
              "_id": "64a7b8c9d1e2f3g4h5i6j7k9",
              "name": "Lọc gió Toyota Camry",
              "code": "TY001",
              "brand": {
                "_id": "64a7b8c9d1e2f3g4h5i6j7k0",
                "name": "Toyota"
              }
            },
            "quantity": 2,
            "price": 450000
          }
        ],
        "status": "not contacted",
        "totalAmount": 900000,
        "totalItems": 2,
        "orderDate": "2024-07-12T10:30:00.000Z",
        "updatedAt": "2024-07-12T10:30:00.000Z",
        "notes": "Ghi chú đặc biệt"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalOrders": 47,
      "limit": 12
    }
  }
}
```

#### GET `/api/orders/:id` 🔒
**Mục đích:** Lấy chi tiết đơn hàng

#### PUT `/api/orders/:id/status` 🔒
**Mục đích:** Cập nhật trạng thái đơn hàng

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Allowed status values:**
- `"contacted"` - Đã liên hệ
- `"not contacted"` - Chưa liên hệ

#### DELETE `/api/orders/:id` 🔒
**Mục đích:** Xóa đơn hàng

### 5. Blog Management (`/api/blogs`)

#### GET `/api/blogs`
**Mục đích:** Lấy danh sách blog (published only)

**Query Parameters:**
- `page`, `limit`: Pagination
- `category`: Filter theo danh mục
- `tag`: Filter theo tag
- `search`: Tìm kiếm full-text

**Response:**
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "title": "Cách chọn lọc gió ô tô phù hợp",
        "slug": "cach-chon-loc-gio-o-to-phu-hop",
        "featuredImage": "https://res.cloudinary.com/demo/image/upload/blogs/blog1.jpg",
        "author": "Admin",
        "category": "Hướng dẫn",
        "tags": ["lọc gió", "bảo dưỡng"],
        "publishDate": "2024-07-10T00:00:00.000Z",
        "featured": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalBlogs": 47,
      "limit": 10
    }
  }
}
```

#### GET `/api/blogs/featured`
**Mục đích:** Lấy blog nổi bật

#### GET `/api/blogs/categories`
**Mục đích:** Lấy danh sách categories

#### GET `/api/blogs/tags`
**Mục đích:** Lấy danh sách tags

#### GET `/api/blogs/recent`
**Mục đích:** Lấy blog mới nhất

#### GET `/api/blogs/:slug`
**Mục đích:** Lấy blog theo slug

#### GET `/api/blogs/admin/all` 🔒
**Mục đích:** Lấy tất cả blog cho admin (bao gồm hidden)

**Query Parameters:**
- `page`, `limit`: Pagination
- `category`: Filter theo danh mục
- `status`: Filter theo trạng thái ("published" | "hidden")
- `search`: Tìm kiếm full-text

#### GET `/api/blogs/admin/:id` 🔒
**Mục đích:** Lấy chi tiết blog cho admin theo ID

#### POST `/api/blogs` 🔒
**Mục đích:** Tạo blog mới

**Content-Type:** `multipart/form-data`

**Request Body:**
```json
{
  "title": "Tiêu đề blog",
  "content": "Nội dung chi tiết...",
  "excerpt": "Tóm tắt ngắn của blog (tối đa 500 ký tự)",
  "author": "Tác giả",
  "category": "Hướng dẫn",
  "tags": "lọc gió,bảo dưỡng",
  "status": "published",
  "featured": false,
  "featuredImage": File // Upload file
}
```

**Lưu ý:**
- `slug` được tự động tạo từ `title`
- `publishDate` được set tự động khi tạo
- Hình ảnh được upload lên Cloudinary
- Tags được truyền dưới dạng string phân tách bằng dấu phẩy

#### PUT `/api/blogs/:id` 🔒
**Mục đích:** Cập nhật blog

#### DELETE `/api/blogs/:id` 🔒
**Mục đích:** Xóa blog

### 6. Contact (`/api/contacts`)

#### POST `/api/contacts`
**Mục đích:** Gửi tin nhắn liên hệ (public)

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",           // Required
  "phone": "0123456789",           // Required
  "email": "customer@example.com", // Optional
  "subject": "Hỏi về sản phẩm",    // Optional
  "message": "Tôi muốn hỏi về lọc gió cho xe Toyota Camry 2020" // Optional
}
```

**Validation Rules:**
- **Required fields**: `name`, `phone`
- **Optional fields**: `email`, `subject`, `message`
- **Email validation**: Chỉ kiểm tra format khi email được cung cấp
- **Flexible contact**: Khách hàng có thể liên hệ chỉ với tên và số điện thoại

**Email Automation:**
- **Admin notification**: Luôn được gửi với tất cả thông tin có sẵn
- **Customer confirmation**: Chỉ gửi khi email hợp lệ được cung cấp
- **Smart handling**: Xử lý gracefully khi thiếu subject hoặc message

**Response:**
```json
{
  "success": true,
  "message": "Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.",
  "data": {
    "name": "Nguyễn Văn A",
    "email": "customer@example.com", 
    "subject": "Hỏi về sản phẩm",
    "sentAt": "2024-07-12T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// Missing required fields
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "field": "name",
      "message": "Tên là bắt buộc"
    },
    {
      "field": "phone", 
      "message": "Số điện thoại là bắt buộc"
    }
  ]
}

// Email service error (rare)
{
  "success": false,
  "message": "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.",
  "error": "Email service unavailable"
}
```

**Lưu ý:** 
- Hệ thống chỉ gửi email thông báo đến admin, không lưu thông tin liên hệ vào database
- Email được gửi qua Gmail SMTP với thông tin cấu hình từ biến môi trường
- Form hoạt động tốt ngay cả khi chỉ có tên và số điện thoại

### 7. Settings (`/api/settings`)

#### GET `/api/settings`
**Mục đích:** Lấy thông tin cài đặt cửa hàng (public)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
    "storeName": "LocGioGiaSi",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "phone": "0123456789",
    "email": "info@locgiogiasi.com",
    "logo": "https://res.cloudinary.com/demo/image/upload/logo.png",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-07-12T10:30:00.000Z"
  }
}
```

**Tính năng đặc biệt:**
- Tự động tạo settings mặc định nếu chưa có trong database
- Singleton pattern: chỉ có 1 document settings duy nhất

#### PUT `/api/settings` 🔒
**Mục đích:** Cập nhật thông tin cài đặt

**Request Body:**
```json
{
  "storeName": "LocGioGiaSi - Chuyên lọc gió ô tô",
  "address": "456 Đường XYZ, Quận 2, TP.HCM", 
  "phone": "0987654321",
  "email": "contact@locgiogiasi.com",
  "logo": "https://new-logo-url.com"
}
```

**Validation Rules:**
- `storeName`: required, string
- `address`: required, string  
- `phone`: required, string
- `email`: required, valid email format
- `logo`: optional, string (URL)

### 8. Statistics (`/api/statistics`) 🔒

#### GET `/api/statistics/dashboard`
**Mục đích:** Lấy thống kê tổng quan dashboard

**Response:**
```json
{
  "success": true,
  "data": {
    "products": {
      "total": 150,
      "available": 145,
      "inactive": 5,
      "lowStock": 8
    },
    "orders": {
      "total": 1250,
      "thisMonth": 89,
      "lastMonth": 72,
      "contacted": 1100,
      "notContacted": 150,
      "contactedThisMonth": 78,
      "contactedLastMonth": 65,
      "growth": {
        "orders": "23.6%",
        "contacted": "20.0%"
      }
    },
    "revenue": {
      "total": 125000000,
      "thisMonth": 8500000,
      "averageOrderValue": 720000,
      "contactedOrdersRevenue": 118000000
    },
    "recentOrders": [
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "orderNumber": "ORD-20240712-1234",
        "customer": {
          "name": "Nguyễn Văn A",
          "email": "customer@example.com"
        },
        "totalAmount": 900000,
        "status": "not contacted",
        "orderDate": "2024-07-12T10:30:00.000Z"
      }
      // ... 4 more recent orders
    ]
  }
}
```

#### GET `/api/statistics/products`
**Mục đích:** Thống kê chi tiết sản phẩm

**Query Parameters:**
- `period` (string): Khoảng thời gian ("week" | "month" | "year", default: "month")
- `count` (number): Số period lấy dữ liệu (default: 12)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 150,
      "available": 145,
      "inactive": 5,
      "lowStock": 8
    },
    "byBrand": [
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k9",
        "name": "Toyota", 
        "productCount": 45,
        "percentage": 30.0
      },
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k0",
        "name": "Honda",
        "productCount": 38,
        "percentage": 25.3
      }
    ],
    "lowStockProducts": [
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k1",
        "name": "Lọc gió Toyota Camry",
        "code": "TY001",
        "stock": 3,
        "brand": "Toyota"
      }
    ],
    "priceDistribution": {
      "under200k": 25,
      "200k-500k": 85,
      "500k-1m": 35,
      "over1m": 5
    }
  }
}
```

#### GET `/api/statistics/orders`
**Mục đích:** Thống kê chi tiết đơn hàng

**Query Parameters:**
- `period` (string): Khoảng thời gian ("week" | "month" | "year", default: "month")
- `count` (number): Số period lấy dữ liệu (default: 12)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 1250,
      "contacted": 1100,
      "notContacted": 150,
      "averageOrderValue": 720000,
      "totalRevenue": 125000000
    },
    "trends": [
      {
        "period": "2024-07",
        "orders": 89,
        "contacted": 78,
        "revenue": 8500000
      },
      {
        "period": "2024-06", 
        "orders": 72,
        "contacted": 65,
        "revenue": 7200000
      }
      // ... more periods
    ],
    "byStatus": [
      {
        "_id": "contacted",
        "count": 1100,
        "percentage": 88.0,
        "revenue": 118000000
      },
      {
        "_id": "not contacted",
        "count": 150, 
        "percentage": 12.0,
        "revenue": 7000000
      }
    ]
  }
}
```

#### GET `/api/statistics/contacts`
**Mục đích:** Thống kê liên hệ

**Query Parameters:**
- `period` (string): Khoảng thời gian ("week" | "month" | "year", default: "month")
- `count` (number): Số period lấy dữ liệu (default: 12)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Contact statistics not available",
    "reason": "Contact form only sends emails, data not stored in database",
    "suggestion": "Consider implementing contact storage to enable statistics"
  }
}
```

**Lưu ý:** Endpoint này trả về thông báo vì hệ thống không lưu contact vào database.

### 9. Health Check

#### GET `/api/health`
**Mục đích:** Kiểm tra tình trạng API

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-07-12T10:30:00.000Z"
}
```

#### GET `/api`
**Mục đích:** API documentation overview

**Response:**
```json
{
  "success": true,
  "message": "Welcome to API",
  "version": "1.0.0",
  "endpoints": {
    "products": "/api/products",
    "orders": "/api/orders",
    "blogs": "/api/blogs",
    "admin": "/api/admin",
    "contacts": "/api/contacts", 
    "statistics": "/api/statistics",
    "settings": "/api/settings",
    "brands": "/api/brands"
  }
}
```

## Error Handling

### Standard Error Response Format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message", // optional
  "errors": [ /* validation errors */ ] // optional
}
```

### HTTP Status Codes:

- **200**: Success
- **201**: Created successfully
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **404**: Not Found
- **500**: Internal Server Error

### Common Error Types:

1. **Validation Error (400)**:
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

2. **Authentication Error (401)**:
```json
{
  "success": false,
  "message": "No token provided, authorization denied"
}
```

3. **Not Found Error (404)**:
```json
{
  "success": false,
  "message": "Product not found"
}
```

4. **Database Error (500)**:
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

## File Upload

### Supported endpoints:
- `POST /api/products` - Multiple images (field name: `images`)
- `PUT /api/products/:id` - Multiple images (field name: `images`)  
- `POST /api/blogs` - Single featured image (field name: `featuredImage`)
- `PUT /api/blogs/:id` - Single featured image (field name: `featuredImage`)

### Configuration:
- **Storage**: Cloudinary
- **Max file size**: 10MB per file
- **Allowed formats**: JPG, JPEG, PNG, WebP
- **Temp storage**: Files temporarily stored in `/uploads/temp/` before Cloudinary upload
- **Auto cleanup**: Temporary files automatically deleted after processing

### Request format:
```javascript
Content-Type: multipart/form-data

// For products - multiple files
images: [File, File, File]

// For blogs - single file  
featuredImage: File

// Other form data
name: "Product name"
description: "Product description"
// ... other fields
```

### Response format (sau khi upload thành công):
```json
// For single image
{
  "public_id": "products/sample1_xyz123",
  "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/products/sample1_xyz123.jpg",
  "width": 1200,
  "height": 800,
  "alt": ""
}

// For multiple images (trong product)
{
  "images": [
    {
      "public_id": "products/sample1_xyz123", 
      "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/products/sample1_xyz123.jpg",
      "width": 1200,
      "height": 800,
      "alt": ""
    },
    {
      "public_id": "products/sample2_abc456",
      "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/products/sample2_abc456.jpg", 
      "width": 1000,
      "height": 600,
      "alt": ""
    }
  ]
}
```

### Upload folders:
- **Products**: `/products/`
- **Blogs**: `/blogs/`
- **Temp**: `/temp/` (auto-deleted)

### Error handling:
- Upload failures return specific error messages
- Invalid file types are rejected before upload
- File size limits enforced at middleware level
- Cloudinary errors are caught and handled gracefully

## Email Integration

### Features:
- **Order confirmation emails** - Gửi đến cả khách hàng và admin khi có đơn hàng mới
- **Contact form notifications** - Gửi email thông báo đến admin khi có liên hệ mới

### Configuration:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@locgiogiasi.com  # Email nhận thông báo admin (optional, mặc định dùng EMAIL_USER)
```

### Email Templates:

#### 1. Order Confirmation Email (Customer)
- **Chủ đề:** `Xác nhận đơn hàng #<orderNumber> - LocGioGiaSi`
- **Nội dung:** Thông tin chi tiết đơn hàng, khách hàng, sản phẩm và tổng tiền
- **Gửi đến:** Email khách hàng

#### 2. Order Notification Email (Admin) 
- **Chủ đề:** `Đơn hàng mới #<orderNumber> - LocGioGiaSi`
- **Nội dung:** Thông tin đầy đủ đơn hàng bao gồm ID sản phẩm để admin xử lý
- **Gửi đến:** ADMIN_EMAIL hoặc EMAIL_USER

#### 3. Contact Form Email (Admin)
- **Chủ đề:** Từ subject của form liên hệ
- **Nội dung:** Thông tin người gửi và nội dung tin nhắn
- **Gửi đến:** ADMIN_EMAIL hoặc EMAIL_USER

### SMTP Configuration:
- **Service:** Gmail
- **Authentication:** App Password (recommended)
- **Security:** TLS/SSL enabled

## Pagination

### Standard pagination format:

**Request:**
```
GET /api/products?page=2&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Search & Filtering

### Text Search:
- **Products**: name, code, description, compatible models
- **Blogs**: title, content (MongoDB text index)

### Filters:
- **Products**: brand, price range, year, car model, active status
- **Orders**: status, date range, customer email
- **Blogs**: category, tags, status

### Sorting:
- **Products**: Hỗ trợ sắp xếp theo `createdAt`, `updatedAt`, `name`, `price`, `code`
- **Default**: `createdAt` (desc) - sản phẩm mới nhất trước

### Examples:
```
# Tìm kiếm và filter cơ bản
GET /api/products?search=toyota&brand=64a7b8c9d1e2f3g4h5i6j7k9&minPrice=100000&maxPrice=500000&year=2020

# Sắp xếp theo giá từ thấp đến cao
GET /api/products?sortBy=price&sortOrder=asc

# Sắp xếp theo tên A-Z với tìm kiếm
GET /api/products?search=honda&sortBy=name&sortOrder=asc

# Kết hợp nhiều filter và sort
curl -X GET "http://localhost:3000/api/products?brand=toyota&minPrice=100000&sortBy=price&sortOrder=desc&page=1&limit=12"
```

## Rate Limiting

### Future Implementation:
- **Public endpoints**: 100 requests/hour per IP
- **Admin endpoints**: 1000 requests/hour per token
- **Contact form**: 5 submissions/hour per IP

## API Versioning

### Current: v1.0.0
- **Strategy**: URL path versioning (future: `/api/v2/`)
- **Backward compatibility**: Maintained for major versions
- **Deprecation policy**: 6 months notice

## Webhooks (Future)

### Planned events:
- `order.created`
- `order.status_updated`
- `product.out_of_stock`
- `contact.received`

## Development Tools

### Testing API:
- **Postman Collection**: Available in `/docs/postman/`
- **curl examples**: Available in this documentation
- **Swagger UI**: Future implementation

### Environment:
```env
# Server Configuration
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3001

# Database
MONGODB_URI=mongodb://localhost:27017/locgiogiasi

# JWT Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@locgiogiasi.com  # Optional, defaults to EMAIL_USER

# Default Admin (Auto-created if none exists)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_ADMIN_EMAIL=admin@locgiogiasi.com
```

### Postman Examples:

#### Login Admin:
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

#### Get Products:
```bash
# Lấy sản phẩm cơ bản
curl -X GET "http://localhost:3000/api/products?page=1&limit=10&search=toyota"

# Sắp xếp theo giá từ thấp đến cao
curl -X GET "http://localhost:3000/api/products?sortBy=price&sortOrder=asc"

# Sắp xếp theo tên A-Z với tìm kiếm
curl -X GET "http://localhost:3000/api/products?search=honda&sortBy=name&sortOrder=asc"

# Kết hợp nhiều filter và sort
curl -X GET "http://localhost:3000/api/products?brand=toyota&minPrice=100000&sortBy=price&sortOrder=desc&page=1&limit=12"
```

#### Create Order:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Nguyễn Văn A",
      "email": "customer@example.com",
      "phone": "0123456789",
      "address": "123 Đường ABC",
      "city": "Hồ Chí Minh"
    },
    "items": [
      {
        "productId": "64a7b8c9d1e2f3g4h5i6j7k8",
        "quantity": 2
      }
    ]
  }'
```

## Best Practices

### API Design:
- RESTful conventions
- Consistent response format
- Proper HTTP status codes
- Meaningful error messages

### Security:
- JWT authentication
- Input validation
- File upload restrictions
- CORS configuration

### Performance:
- Database indexing
- Query optimization
- Response compression
- Caching (future)

### Monitoring:
- Request logging
- Error tracking
- Performance metrics
- Health checks

---

## Changelog

### v1.0.1 (2025-07-15)
#### 🆕 Features
- **Product Sorting**: Thêm chức năng sắp xếp sản phẩm
  - Tham số `sortBy`: `createdAt`, `updatedAt`, `name`, `price`, `code`
  - Tham số `sortOrder`: `asc`, `desc`
  - Validation cho các tham số sắp xếp
  - Giá trị mặc định: `sortBy=createdAt`, `sortOrder=desc`

#### 📝 Documentation
- Cập nhật API documentation với các tham số sắp xếp mới
- Thêm ví dụ curl commands cho chức năng sắp xếp
- Cập nhật response examples bao gồm `createdAt` và `updatedAt`

### v1.0.0 (2024-07-14)
#### 🎉 Initial Release
- API cơ bản cho quản lý sản phẩm, đơn hàng, blog
- Authentication với JWT
- Upload file với Cloudinary
- Email automation
- Admin dashboard APIs
- Statistics và reporting
