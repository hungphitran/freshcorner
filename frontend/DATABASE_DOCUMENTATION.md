# Tài liệu Database - Hệ thống LocGioGiaSi

## Tổng quan
Hệ thống sử dụng MongoDB với Mongoose ODM để quản lý cơ sở dữ liệu. Database bao gồm 6 collections chính để quản lý một cửa hàng bán phụ tùng ô tô trực tuyến.

## Kiến trúc Database

### 1. Collection: `admins`
**Mô tả**: Quản lý tài khoản quản trị viên hệ thống

**Schema**:
```javascript
{
  _id: ObjectId,
  username: String (required, unique, 3-50 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min 6 chars),
  lastLogin: Date,
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Đặc điểm**:
- Mật khẩu được hash bằng bcryptjs với salt 10
- Email được chuyển về lowercase tự động
- Password được ẩn khi trả về JSON
- Có method `comparePassword()` để xác thực

---

### 2. Collection: `brands`
**Mô tả**: Quản lý thông tin hãng xe và các dòng xe tương ứng

**Schema**:
```javascript
{
  _id: ObjectId,
  name: String (required, unique, trim),
  carModels: [{
    _id: ObjectId (auto-generated),
    name: String (required, trim),
    years: [String] (required),
    isActive: Boolean (default: true),
    createdAt: Date (default: now)
  }],
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Index**:
- `name`: text search
- `isActive`: 1
- `carModels.name`: 1
- `carModels.isActive`: 1

**Đặc điểm**:
- Mỗi brand có thể chứa nhiều car models
- Car models được lưu dưới dạng embedded documents
- Hỗ trợ text search trên tên hãng
- Có thể kích hoạt/vô hiệu hóa từng hãng và dòng xe

---

### 3. Collection: `products`
**Mô tả**: Quản lý thông tin sản phẩm (locgiogiasi ô tô)

**Schema**:
```javascript
{
  _id: ObjectId,
  name: String (required, trim),
  code: String (required, unique, trim),
  brand: ObjectId (ref: 'Brand', required),
  compatibleModels: [{
    carModelId: ObjectId (required),
    carModelName: String (required, trim),
    years: [String] (required)
  }],
  price: Number (required, min: 0),
  description: String (required),
  images: [{
    public_id: String (required),
    url: String (required),
    width: Number (default: 0),
    height: Number (default: 0),
    alt: String (default: '')
  }],
  stock: Number (required, min: 0, default: 0),
  specifications: Map of String,
  tags: [String],
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Index**:
- Text search: `name`, `description`, `tags`, `code`
- `brand`: 1
- `price`: 1
- `isActive`: 1
- `compatibleModels.carModelName`: 1
- `compatibleModels.years`: 1
- `compatibleModels.carModelId`: 1

**Đặc điểm**:
- Mỗi sản phẩm có mã code duy nhất
- Liên kết với brand qua ObjectId reference
- Hỗ trợ nhiều ảnh với thông tin chi tiết
- Lưu trữ thông số kỹ thuật dưới dạng Map
- Quản lý tồn kho
- Hỗ trợ tìm kiếm full-text

---

### 4. Collection: `orders`
**Mô tả**: Quản lý đơn hàng từ khách hàng

**Schema**:
```javascript
{
  _id: ObjectId,
  orderNumber: String (required, unique, auto-generated),
  customer: {
    name: String (required, trim),
    email: String (required, trim, lowercase),
    phone: String (required, trim),
    address: String (required, trim),
    city: String (required, trim),
    district: String (trim),
    ward: String (trim)
  },
  items: [{
    product: ObjectId (ref: 'Product', required),
    quantity: Number (required, min: 1, default: 1),
    price: Number (required, min: 0)
  }],
  status: String (enum: ['contacted', 'not contacted'], default: 'not contacted'),
  notes: String (trim),
  orderDate: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Virtual Fields**:
- `totalAmount`: Tổng giá trị đơn hàng
- `totalItems`: Tổng số lượng sản phẩm

**Đặc điểm**:
- Mã đơn hàng tự động sinh theo format: `ORD-YYYYMMDD-XXXX`
- Thông tin khách hàng được lưu trực tiếp trong đơn hàng
- Mỗi item lưu giá tại thời điểm đặt hàng
- Có virtual fields để tính toán tổng tiền

---

### 5. Collection: `blogs`
**Mô tả**: Quản lý bài viết blog/tin tức

**Schema**:
```javascript
{
  _id: ObjectId,
  title: String (required, trim),
  slug: String (required, unique, lowercase, auto-generated),
  content: String (required),
  featuredImage: String (required),
  author: String (required, trim),
  category: String (required, trim),
  tags: [String] (trim),
  status: String (enum: ['hidden', 'published'], default: 'hidden'),
  featured: Boolean (default: false),
  publishDate: Date (default: now),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Index**:
- Text search: `title`, `content`
- `category`, `status`: compound index

**Đặc điểm**:
- Slug tự động sinh từ title
- Có thể đánh dấu bài viết nổi bật
- Phân loại theo category và tags
- Quản lý trạng thái xuất bản

---

### 6. Collection: `settings`
**Mô tả**: Cài đặt chung của hệ thống

**Schema**:
```javascript
{
  _id: ObjectId,
  storeName: String (required, trim),
  address: String (required, trim),
  phone: String (required, trim),
  email: String (required, trim, lowercase),
  logo: String (trim),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

**Đặc điểm**:
- Lưu trữ thông tin cơ bản của cửa hàng
- Chỉ có một document duy nhất trong collection

---

## Mối quan hệ giữa các Collections

### 1. Brand → Product (One-to-Many)
- Mỗi product thuộc về một brand
- Reference: `products.brand → brands._id`

### 2. Product → Order Items (One-to-Many)
- Mỗi order item tham chiếu đến một product
- Reference: `orders.items.product → products._id`

### 3. Brand → Product Compatible Models (Embedded)
- Product lưu trữ thông tin các car models tương thích
- Sử dụng cả ObjectId và tên để tối ưu performance

---

## Tối ưu hóa và Index

### Text Search Index
- Products: Tìm kiếm theo tên, mô tả, tags, mã code
- Brands: Tìm kiếm theo tên hãng
- Blogs: Tìm kiếm theo title và content

### Performance Index
- Products có nhiều index để tối ưu các truy vấn phổ biến
- Compound index cho blog (category + status)
- Single field index cho các trường thường dùng filter

---

## Chính sách bảo mật

### 1. Authentication
- Admin password được hash với bcryptjs
- Session-based authentication với JWT tokens

### 2. Data Validation
- Mongoose schema validation cho tất cả fields
- Express-validator cho API input validation

### 3. File Upload
- Image upload với Cloudinary integration
- Temporary file cleanup mechanisms

---

## Backup và Migration

### 1. Data Seeding
- Script `seedData.js` để tạo dữ liệu mẫu
- Separate seeding cho brands và products

### 2. Migration Scripts
- `remove-cart-migration.js`: Migration để loại bỏ cart functionality
- `remove-contact-migration.js`: Migration cho contact system

---

## Monitoring và Logging

### 1. Database Connection
- Automatic reconnection handling
- Connection status monitoring

### 2. Error Handling
- Comprehensive error middleware
- Validation error standardization

### 3. Performance Monitoring
- Index usage tracking
- Query performance optimization

---

*Tài liệu này được cập nhật lần cuối: Tháng 7, 2025*
