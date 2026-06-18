const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/brand.model');
const Product = require('./models/product.model');
const Blog = require('./models/blog.model');
const Settings = require('./models/settings.model');
const Order = require('./models/order.model');

const categories = [
  { name: 'Trái cây', slug: 'fruit', themeKey: 'fruit', description: 'Trái cây tươi, hộp trái cây và platter theo mùa.' },
  { name: 'Tea break', slug: 'teabreak', themeKey: 'teabreak', description: 'Set bánh, trái cây và đồ uống cho văn phòng.' },
  { name: 'Ăn vặt', slug: 'snacks', themeKey: 'snacks', description: 'Đồ ăn vặt ngọt mặn, hạt dinh dưỡng và trái cây sấy.' },
  { name: 'Smoothies', slug: 'smoothies', themeKey: 'smoothies', description: 'Smoothies và nước ép tươi.' },
];

const products = [
  {
    name: 'Hộp trái cây theo mùa',
    code: 'FC-FRUIT-001',
    categorySlug: 'fruit',
    price: 89000,
    description: 'Hộp trái cây tươi cắt sẵn gồm các loại theo mùa, phù hợp bữa phụ văn phòng.',
    stock: 40,
    origin: 'Việt Nam',
    ingredients: 'Trái cây tươi theo mùa',
    packageSize: 'Hộp 500g',
    storageInstruction: 'Bảo quản mát 2-5°C',
    shelfLife: 'Dùng trong ngày',
  },
  {
    name: 'Platter trái cây văn phòng',
    code: 'FC-FRUIT-002',
    categorySlug: 'fruit',
    price: 299000,
    description: 'Khay trái cây tươi trình bày sẵn cho nhóm 6-8 người.',
    stock: 20,
    origin: 'Việt Nam',
    ingredients: 'Dưa lưới, nho, táo, cam, xoài theo mùa',
    packageSize: 'Khay 6-8 người',
    storageInstruction: 'Bảo quản mát, dùng ngay sau khi nhận',
    shelfLife: 'Dùng trong ngày',
  },
  {
    name: 'Set tea break mini croissant',
    code: 'FC-TEA-001',
    categorySlug: 'teabreak',
    price: 349000,
    description: 'Set croissant mini, bánh ngọt nhỏ và trái cây cho buổi họp nhẹ.',
    stock: 15,
    origin: 'Fresh Corner kitchen',
    ingredients: 'Bánh croissant mini, pastry, trái cây',
    packageSize: 'Set 10 phần',
    storageInstruction: 'Để nơi thoáng mát, tránh nắng trực tiếp',
    shelfLife: 'Dùng trong 6 giờ',
  },
  {
    name: 'Set sandwich tea break',
    code: 'FC-TEA-002',
    categorySlug: 'teabreak',
    price: 420000,
    description: 'Set sandwich nhỏ, bánh ngọt và nước uống cho team meeting.',
    stock: 12,
    origin: 'Fresh Corner kitchen',
    ingredients: 'Sandwich, bánh ngọt, trái cây, trà đóng chai',
    packageSize: 'Set 10 phần',
    storageInstruction: 'Bảo quản mát nếu chưa dùng ngay',
    shelfLife: 'Dùng trong ngày',
  },
  {
    name: 'Mix hạt và trái cây sấy',
    code: 'FC-SNACK-001',
    categorySlug: 'snacks',
    price: 69000,
    description: 'Gói ăn vặt gồm hạt rang, nho khô và trái cây sấy, phù hợp bữa phụ.',
    stock: 60,
    origin: 'Việt Nam',
    ingredients: 'Hạt điều, hạnh nhân, nho khô, xoài sấy',
    packageSize: 'Gói 150g',
    storageInstruction: 'Đậy kín sau khi mở',
    shelfLife: '30 ngày',
  },
  {
    name: 'Granola bites',
    code: 'FC-SNACK-002',
    categorySlug: 'snacks',
    price: 79000,
    description: 'Viên granola nhỏ dễ dùng cùng cà phê, trà hoặc smoothie.',
    stock: 45,
    origin: 'Fresh Corner kitchen',
    ingredients: 'Yến mạch, mật ong, hạt, trái cây sấy',
    packageSize: 'Hộp 12 viên',
    storageInstruction: 'Nơi khô ráo, thoáng mát',
    shelfLife: '14 ngày',
  },
  {
    name: 'Smoothie xoài chanh dây',
    code: 'FC-SMOOTH-001',
    categorySlug: 'smoothies',
    price: 59000,
    description: 'Smoothie xoài chanh dây tươi mát, vị chua ngọt cân bằng.',
    stock: 35,
    origin: 'Fresh Corner bar',
    ingredients: 'Xoài, chanh dây, sữa chua, đá',
    packageSize: 'Chai 350ml',
    storageInstruction: 'Giữ lạnh, lắc đều trước khi dùng',
    shelfLife: 'Dùng trong ngày',
  },
  {
    name: 'Smoothie xanh detox',
    code: 'FC-SMOOTH-002',
    categorySlug: 'smoothies',
    price: 65000,
    description: 'Smoothie xanh từ rau củ và trái cây, nhẹ bụng cho buổi sáng.',
    stock: 30,
    origin: 'Fresh Corner bar',
    ingredients: 'Cải bó xôi, táo, chuối, dứa, sữa hạt',
    packageSize: 'Chai 350ml',
    storageInstruction: 'Giữ lạnh, dùng trong ngày',
    shelfLife: 'Dùng trong ngày',
  },
];

const blogs = [
  {
    title: 'Cách chọn set tea break cho buổi họp văn phòng',
    slug: 'cach-chon-set-teabreak-van-phong',
    content: 'Một set tea break tốt nên cân bằng giữa món ngọt, món mặn nhẹ, trái cây và đồ uống.',
    excerpt: 'Gợi ý chọn tea break gọn đẹp, đủ vị và dễ phục vụ.',
    featuredImage: '/categories.jpg',
    author: 'Fresh Corner',
    category: 'Tea break',
    tags: ['teabreak', 'van-phong'],
    status: 'published',
    featured: true,
    publishDate: new Date(),
  },
  {
    title: 'Smoothie nào phù hợp cho bữa phụ healthy?',
    slug: 'smoothie-healthy-cho-bua-phu',
    content: 'Smoothie từ trái cây tươi, sữa chua hoặc sữa hạt là lựa chọn nhanh cho bữa phụ.',
    excerpt: 'Gợi ý chọn smoothie theo nhu cầu năng lượng trong ngày.',
    featuredImage: '/categories.jpg',
    author: 'Fresh Corner',
    category: 'Smoothies',
    tags: ['smoothies', 'healthy'],
    status: 'published',
    featured: false,
    publishDate: new Date(),
  },
];

function assertSafeSeed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed in production.');
  }
  if (process.env.ALLOW_DESTRUCTIVE_SEED !== 'true') {
    throw new Error('Set ALLOW_DESTRUCTIVE_SEED=true to reset and seed local/dev data.');
  }
}

async function seedFreshCorner() {
  assertSafeSeed();
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freshcorner');

  await Promise.all([
    Order.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    Blog.deleteMany({}),
    Settings.deleteMany({}),
  ]);

  const createdCategories = await Category.insertMany(categories);
  const categoryBySlug = new Map(createdCategories.map(category => [category.slug, category]));

  const productDocs = products.map(product => ({
    name: product.name,
    code: product.code,
    category: categoryBySlug.get(product.categorySlug)._id,
    price: product.price,
    description: product.description,
    images: [{
      public_id: product.code.toLowerCase(),
      url: '/fallback-product.jpg',
      width: 800,
      height: 600,
      alt: product.name,
    }],
    stock: product.stock,
    origin: product.origin,
    ingredients: product.ingredients,
    packageSize: product.packageSize,
    storageInstruction: product.storageInstruction,
    shelfLife: product.shelfLife,
  }));

  const createdProducts = await Product.insertMany(productDocs);
  const createdBlogs = await Blog.insertMany(blogs);
  await Settings.create({
    storeName: 'Fresh Corner',
    address: 'TP. Hồ Chí Minh',
    phone: '0345 8888 04',
    email: 'hello@freshcorner.vn',
    logo: '/logo.png',
  });

  console.log(`Fresh Corner seed completed: ${createdCategories.length} categories, ${createdProducts.length} products, ${createdBlogs.length} blogs.`);
  await mongoose.disconnect();
}

if (require.main === module) {
  seedFreshCorner().catch(error => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = { seedFreshCorner };
