const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Brand = require('./models/brand.model');
const Product = require('./models/product.model');
const Blog = require('./models/blog.model');
const Settings = require('./models/settings.model');
const Order = require('./models/order.model');

// Sample Brands Data
const sampleBrands = [
    {
        name: 'Toyota',
        carModels: [
            {
                name: 'Camry',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Corolla',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Vios',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Fortuner',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Innova',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            }
        ]
    },
    {
        name: 'Honda',
        carModels: [
            {
                name: 'Accord',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Civic',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'City',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'CR-V',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'HR-V',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ]
    },
    {
        name: 'Hyundai',
        carModels: [
            {
                name: 'Elantra',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Accent',
                years: ['2018', '2019', '2020', '2021', '2022', '2023']
            },
            {
                name: 'Tucson',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Santa Fe',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Kona',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ]
    },
    {
        name: 'Mazda',
        carModels: [
            {
                name: 'Mazda3',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Mazda6',
                years: ['2018', '2019', '2020', '2021', '2022']
            },
            {
                name: 'CX-5',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'CX-8',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'CX-30',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ]
    },
    {
        name: 'Kia',
        carModels: [
            {
                name: 'Cerato',
                years: ['2019', '2020', '2021', '2022', '2023']
            },
            {
                name: 'Soluto',
                years: ['2019', '2020', '2021', '2022', '2023']
            },
            {
                name: 'Seltos',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Sorento',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Carnival',
                years: ['2021', '2022', '2023', '2024']
            }
        ]
    },
    {
        name: 'Ford',
        carModels: [
            {
                name: 'Focus',
                years: ['2018', '2019', '2020', '2021', '2022']
            },
            {
                name: 'EcoSport',
                years: ['2018', '2019', '2020', '2021', '2022']
            },
            {
                name: 'Explorer',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Everest',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                name: 'Ranger',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            }
        ]
    }
];

// Sample Products Data
const sampleProductsData = [
    {
        name: 'Lọc gió động cơ Toyota Camry',
        code: 'TOY-CAM-001',
        brandName: 'Toyota',
        compatibleModels: [
            {
                carModelName: 'Camry',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 350000,
        description: 'Lọc gió động cơ chính hãng Toyota dành cho dòng xe Camry. Đảm bảo không khí sạch cho động cơ, tăng hiệu suất hoạt động và tiết kiệm nhiên liệu.',
        images: [
            {
                public_id: 'toyota-camry-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/toyota-camry-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Toyota Camry'
            }
        ],
        stock: 25,
        origin: 'Nhật Bản',
        material: 'Giấy lọc cao cấp',
        dimensions: '245 x 185 x 45 mm',
        warranty: '12 tháng'
    },
    {
        name: 'Lọc dầu Honda Civic',
        code: 'HON-CIV-002',
        brandName: 'Honda',
        compatibleModels: [
            {
                carModelName: 'Civic',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'City',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 280000,
        description: 'Lọc dầu chính hãng Honda cho dòng xe Civic và City. Lọc sạch tạp chất trong dầu động cơ, bảo vệ động cơ tối ưu.',
        images: [
            {
                public_id: 'honda-civic-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/honda-civic-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Honda Civic'
            }
        ],
        stock: 30,
        origin: 'Nhật Bản',
        material: 'Kim loại và cao su NBR',
        dimensions: 'Ø65 x 85 mm',
        warranty: '6 tháng'
    },
    {
        name: 'Lọc nhiên liệu Hyundai Elantra',
        code: 'HYU-ELA-003',
        brandName: 'Hyundai',
        compatibleModels: [
            {
                carModelName: 'Elantra',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Accent',
                years: ['2020', '2021', '2022', '2023']
            }
        ],
        price: 450000,
        description: 'Lọc nhiên liệu chính hãng Hyundai cho dòng xe Elantra và Accent. Lọc sạch tạp chất trong nhiên liệu, bảo vệ hệ thống phun xăng.',
        images: [
            {
                public_id: 'hyundai-elantra-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/hyundai-elantra-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Hyundai Elantra'
            }
        ],
        stock: 18,
        origin: 'Hàn Quốc',
        material: 'Giấy lọc chuyên dụng',
        dimensions: 'Ø55 x 120 mm',
        warranty: '12 tháng'
    },
    {
        name: 'Lọc gió cabin Ford Focus',
        code: 'FOR-FOC-004',
        brandName: 'Ford',
        compatibleModels: [
            {
                carModelName: 'Focus',
                years: ['2018', '2019', '2020', '2021', '2022']
            },
            {
                carModelName: 'EcoSport',
                years: ['2018', '2019', '2020', '2021', '2022']
            }
        ],
        price: 380000,
        description: 'Lọc gió cabin chính hãng Ford cho Focus và EcoSport. Lọc bụi, vi khuẩn và mùi hôi, đảm bảo không khí sạch trong xe.',
        images: [
            {
                public_id: 'ford-focus-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/ford-focus-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Ford Focus'
            }
        ],
        stock: 22,
        origin: 'Mỹ',
        material: 'Than hoạt tính',
        dimensions: '200 x 180 x 30 mm',
        warranty: '18 tháng'
    },
    {
        name: 'Lọc gió động cơ Mazda CX-5',
        code: 'MAZ-CX5-005',
        brandName: 'Mazda',
        compatibleModels: [
            {
                carModelName: 'CX-5',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Mazda3',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 320000,
        description: 'Lọc gió động cơ chính hãng Mazda cho dòng xe CX-5 và Mazda3. Giữ cho động cơ hoạt động hiệu quả và tiết kiệm nhiên liệu.',
        images: [
            {
                public_id: 'mazda-cx5-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mazda-cx5-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Mazda CX-5'
            }
        ],
        stock: 28,
        origin: 'Nhật Bản',
        material: 'Giấy lọc chuyên dụng',
        dimensions: '230 x 180 x 40 mm',
        warranty: '12 tháng'
    },
    {
        name: 'Lọc dầu Kia Seltos',
        code: 'KIA-SEL-006',
        brandName: 'Kia',
        compatibleModels: [
            {
                carModelName: 'Seltos',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Cerato',
                years: ['2019', '2020', '2021', '2022', '2023']
            }
        ],
        price: 290000,
        description: 'Lọc dầu chính hãng Kia cho Seltos và Cerato. Đảm bảo dầu động cơ luôn sạch, tăng tuổi thọ động cơ.',
        images: [
            {
                public_id: 'kia-seltos-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/kia-seltos-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Kia Seltos'
            }
        ],
        stock: 35,
        origin: 'Hàn Quốc',
        material: 'Kim loại và cao su EPDM',
        dimensions: 'Ø68 x 75 mm',
        warranty: '6 tháng'
    },
    {
        name: 'Lọc gió cabin Toyota Vios',
        code: 'TOY-VIO-007',
        brandName: 'Toyota',
        compatibleModels: [
            {
                carModelName: 'Vios',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Corolla',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 250000,
        description: 'Lọc gió cabin chính hãng Toyota cho Vios và Corolla. Loại bỏ bụi bẩn, phấn hoa và vi khuẩn trong không khí.',
        images: [
            {
                public_id: 'toyota-vios-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/toyota-vios-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Toyota Vios'
            }
        ],
        stock: 40,
        origin: 'Nhật Bản',
        material: 'Sợi tổng hợp và than hoạt tính',
        dimensions: '190 x 165 x 25 mm',
        warranty: '12 tháng'
    },
    {
        name: 'Lọc nhiên liệu Honda CR-V',
        code: 'HON-CRV-008',
        brandName: 'Honda',
        compatibleModels: [
            {
                carModelName: 'CR-V',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'HR-V',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 520000,
        description: 'Lọc nhiên liệu chính hãng Honda cho CR-V và HR-V. Bảo vệ hệ thống phun xăng khỏi tạp chất và cặn bẩn.',
        images: [
            {
                public_id: 'honda-crv-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/honda-crv-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Honda CR-V'
            }
        ],
        stock: 15,
        origin: 'Nhật Bản',
        material: 'Giấy lọc cao cấp và nhựa PP',
        dimensions: 'Ø58 x 105 mm',
        warranty: '18 tháng'
    },
    {
        name: 'Lọc gió động cơ Hyundai Tucson',
        code: 'HYU-TUC-009',
        brandName: 'Hyundai',
        compatibleModels: [
            {
                carModelName: 'Tucson',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Santa Fe',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 420000,
        description: 'Lọc gió động cơ chính hãng Hyundai cho Tucson và Santa Fe. Tối ưu hóa luồng không khí vào động cơ.',
        images: [
            {
                public_id: 'hyundai-tucson-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/hyundai-tucson-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Hyundai Tucson'
            }
        ],
        stock: 20,
        origin: 'Hàn Quốc',
        material: 'Giấy lọc cao cấp và khung nhựa',
        dimensions: '260 x 200 x 50 mm',
        warranty: '15 tháng'
    },
    {
        name: 'Lọc dầu Ford Everest',
        code: 'FOR-EVE-010',
        brandName: 'Ford',
        compatibleModels: [
            {
                carModelName: 'Everest',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Ranger',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 350000,
        description: 'Lọc dầu chính hãng Ford cho Everest và Ranger. Phù hợp cho động cơ diesel, lọc hiệu quả tạp chất trong dầu nhờn.',
        images: [
            {
                public_id: 'ford-everest-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/ford-everest-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Ford Everest'
            }
        ],
        stock: 25,
        origin: 'Mỹ',
        material: 'Kim loại chống ăn mòn và cao su NBR',
        dimensions: 'Ø76 x 95 mm',
        warranty: '8 tháng'
    },
    {
        name: 'Lọc gió cabin Mazda CX-8',
        code: 'MAZ-CX8-011',
        brandName: 'Mazda',
        compatibleModels: [
            {
                carModelName: 'CX-8',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'CX-30',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 340000,
        description: 'Lọc gió cabin chính hãng Mazda cho CX-8 và CX-30. Công nghệ than hoạt tính khử mùi hiệu quả.',
        images: [
            {
                public_id: 'mazda-cx8-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mazda-cx8-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Mazda CX-8'
            }
        ],
        stock: 18,
        origin: 'Nhật Bản',
        material: 'Sợi tổng hợp và than hoạt tính cao cấp',
        dimensions: '215 x 180 x 35 mm',
        warranty: '14 tháng'
    },
    {
        name: 'Lọc nhiên liệu Kia Sorento',
        code: 'KIA-SOR-012',
        brandName: 'Kia',
        compatibleModels: [
            {
                carModelName: 'Sorento',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Carnival',
                years: ['2021', '2022', '2023', '2024']
            }
        ],
        price: 480000,
        description: 'Lọc nhiên liệu chính hãng Kia cho Sorento và Carnival. Đặc biệt phù hợp cho động cơ turbo.',
        images: [
            {
                public_id: 'kia-sorento-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/kia-sorento-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Kia Sorento'
            }
        ],
        stock: 12,
        origin: 'Hàn Quốc',
        material: 'Giấy lọc siêu mịn và vỏ kim loại',
        dimensions: 'Ø62 x 110 mm',
        warranty: '16 tháng'
    },
    // 38 sản phẩm mới
    {
        name: 'Lọc gió động cơ Toyota Fortuner',
        code: 'TOY-FOR-013',
        brandName: 'Toyota',
        compatibleModels: [
            {
                carModelName: 'Fortuner',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Innova',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 420000,
        description: 'Lọc gió động cơ chính hãng Toyota cho Fortuner và Innova. Thiết kế chuyên dụng cho động cơ diesel, đảm bảo hiệu suất tối ưu.',
        images: [
            {
                public_id: 'toyota-fortuner-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/toyota-fortuner-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Toyota Fortuner'
            }
        ],
        stock: 15,
        origin: 'Nhật Bản',
        material: 'Giấy lọc cao cấp và khung plastic',
        dimensions: '280 x 220 x 55 mm',
        warranty: '18 tháng'
    },
    {
        name: 'Lọc dầu Toyota Innova',
        code: 'TOY-INN-014',
        brandName: 'Toyota',
        compatibleModels: [
            {
                carModelName: 'Innova',
                years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 320000,
        description: 'Lọc dầu chính hãng Toyota cho dòng xe Innova. Phù hợp cho động cơ diesel, lọc hiệu quả tạp chất trong dầu nhờn.',
        images: [
            {
                public_id: 'toyota-innova-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/toyota-innova-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Toyota Innova'
            }
        ],
        stock: 28,
        origin: 'Nhật Bản',
        material: 'Kim loại và cao su HNBR',
        dimensions: 'Ø78 x 90 mm',
        warranty: '10 tháng'
    },
    {
        name: 'Lọc nhiên liệu Toyota Camry Hybrid',
        code: 'TOY-CAM-015',
        brandName: 'Toyota',
        compatibleModels: [
            {
                carModelName: 'Camry',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 580000,
        description: 'Lọc nhiên liệu chuyên dụng cho Toyota Camry Hybrid. Thiết kế đặc biệt cho hệ thống hybrid, đảm bảo nhiên liệu sạch.',
        images: [
            {
                public_id: 'toyota-camry-hybrid-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/toyota-camry-hybrid-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Toyota Camry Hybrid'
            }
        ],
        stock: 8,
        origin: 'Nhật Bản',
        material: 'Giấy lọc nano và vỏ nhựa ABS',
        dimensions: 'Ø60 x 125 mm',
        warranty: '20 tháng'
    },
    {
        name: 'Lọc gió cabin Honda Accord',
        code: 'HON-ACC-016',
        brandName: 'Honda',
        compatibleModels: [
            {
                carModelName: 'Accord',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 380000,
        description: 'Lọc gió cabin cao cấp Honda cho Accord. Công nghệ lọc 3 lớp với than hoạt tính, khử mùi và vi khuẩn hiệu quả.',
        images: [
            {
                public_id: 'honda-accord-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/honda-accord-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Honda Accord'
            }
        ],
        stock: 22,
        origin: 'Nhật Bản',
        material: 'Sợi tổng hợp, than hoạt tính, ion bạc',
        dimensions: '220 x 195 x 40 mm',
        warranty: '15 tháng'
    },
    {
        name: 'Lọc gió động cơ Honda City Turbo',
        code: 'HON-CIT-017',
        brandName: 'Honda',
        compatibleModels: [
            {
                carModelName: 'City',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 310000,
        description: 'Lọc gió động cơ chuyên dụng cho Honda City phiên bản Turbo. Thiết kế đặc biệt cho động cơ tăng áp.',
        images: [
            {
                public_id: 'honda-city-turbo-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/honda-city-turbo-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Honda City Turbo'
            }
        ],
        stock: 18,
        origin: 'Nhật Bản',
        material: 'Giấy lọc turbo cao cấp',
        dimensions: '240 x 190 x 48 mm',
        warranty: '12 tháng'
    },
    {
        name: 'Lọc dầu Honda HR-V',
        code: 'HON-HRV-018',
        brandName: 'Honda',
        compatibleModels: [
            {
                carModelName: 'HR-V',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 295000,
        description: 'Lọc dầu chính hãng Honda cho HR-V. Công nghệ lọc tiên tiến, đảm bảo dầu nhờn luôn sạch và hiệu quả.',
        images: [
            {
                public_id: 'honda-hrv-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/honda-hrv-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Honda HR-V'
            }
        ],
        stock: 32,
        origin: 'Nhật Bản',
        material: 'Kim loại và cao su fluorine',
        dimensions: 'Ø66 x 78 mm',
        warranty: '8 tháng'
    },
    {
        name: 'Lọc gió cabin Hyundai Kona',
        code: 'HYU-KON-019',
        brandName: 'Hyundai',
        compatibleModels: [
            {
                carModelName: 'Kona',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 360000,
        description: 'Lọc gió cabin Hyundai Kona với công nghệ HEPA, lọc 99.9% bụi PM2.5 và các chất ô nhiễm không khí.',
        images: [
            {
                public_id: 'hyundai-kona-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/hyundai-kona-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Hyundai Kona'
            }
        ],
        stock: 16,
        origin: 'Hàn Quốc',
        material: 'Sợi HEPA và than hoạt tính',
        dimensions: '205 x 175 x 32 mm',
        warranty: '16 tháng'
    },
    {
        name: 'Lọc nhiên liệu Hyundai Accent Diesel',
        code: 'HYU-ACC-020',
        brandName: 'Hyundai',
        compatibleModels: [
            {
                carModelName: 'Accent',
                years: ['2018', '2019', '2020', '2021', '2022', '2023']
            }
        ],
        price: 490000,
        description: 'Lọc nhiên liệu chuyên dụng cho Hyundai Accent động cơ diesel. Có chức năng tách nước và lọc tạp chất hiệu quả.',
        images: [
            {
                public_id: 'hyundai-accent-diesel-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/hyundai-accent-diesel-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Hyundai Accent Diesel'
            }
        ],
        stock: 14,
        origin: 'Hàn Quốc',
        material: 'Giấy lọc chuyên dụng diesel và van tách nước',
        dimensions: 'Ø68 x 135 mm',
        warranty: '14 tháng'
    },
    {
        name: 'Lọc dầu Hyundai Santa Fe',
        code: 'HYU-SAN-021',
        brandName: 'Hyundai',
        compatibleModels: [
            {
                carModelName: 'Santa Fe',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 380000,
        description: 'Lọc dầu chính hãng Hyundai cho Santa Fe. Thiết kế cho động cơ V6 và 4 cylinder, hiệu suất lọc cao.',
        images: [
            {
                public_id: 'hyundai-santa-fe-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/hyundai-santa-fe-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Hyundai Santa Fe'
            }
        ],
        stock: 20,
        origin: 'Hàn Quốc',
        material: 'Kim loại chống ăn mòn và niêm phong cao su',
        dimensions: 'Ø72 x 88 mm',
        warranty: '9 tháng'
    },
    {
        name: 'Lọc gió động cơ Mazda6',
        code: 'MAZ-M6-022',
        brandName: 'Mazda',
        compatibleModels: [
            {
                carModelName: 'Mazda6',
                years: ['2018', '2019', '2020', '2021', '2022']
            }
        ],
        price: 340000,
        description: 'Lọc gió động cơ chính hãng Mazda cho Mazda6. Công nghệ SKYACTIV tối ưu hóa luồng khí và hiệu suất động cơ.',
        images: [
            {
                public_id: 'mazda6-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mazda6-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Mazda6'
            }
        ],
        stock: 24,
        origin: 'Nhật Bản',
        material: 'Giấy lọc SKYACTIV chuyên dụng',
        dimensions: '250 x 185 x 45 mm',
        warranty: '13 tháng'
    },
    {
        name: 'Lọc nhiên liệu Mazda CX-30',
        code: 'MAZ-CX30-023',
        brandName: 'Mazda',
        compatibleModels: [
            {
                carModelName: 'CX-30',
                years: ['2020', '2021', '2022', '2023', '2024']
            },
            {
                carModelName: 'Mazda3',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 460000,
        description: 'Lọc nhiên liệu Mazda cho CX-30 và Mazda3. Thiết kế compact phù hợp với động cơ SKYACTIV-G.',
        images: [
            {
                public_id: 'mazda-cx30-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mazda-cx30-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Mazda CX-30'
            }
        ],
        stock: 11,
        origin: 'Nhật Bản',
        material: 'Giấy lọc nano và thân nhựa PP',
        dimensions: 'Ø54 x 98 mm',
        warranty: '17 tháng'
    },
    {
        name: 'Lọc dầu Mazda CX-8',
        code: 'MAZ-CX8-024',
        brandName: 'Mazda',
        compatibleModels: [
            {
                carModelName: 'CX-8',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 350000,
        description: 'Lọc dầu chính hãng Mazda cho CX-8. Thiết kế cho động cơ diesel turbo, bảo vệ tối ưu các bộ phận.',
        images: [
            {
                public_id: 'mazda-cx8-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mazda-cx8-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Mazda CX-8'
            }
        ],
        stock: 26,
        origin: 'Nhật Bản',
        material: 'Kim loại và cao su ACM',
        dimensions: 'Ø70 x 82 mm',
        warranty: '11 tháng'
    },
    {
        name: 'Lọc gió cabin Kia Soluto',
        code: 'KIA-SOL-025',
        brandName: 'Kia',
        compatibleModels: [
            {
                carModelName: 'Soluto',
                years: ['2019', '2020', '2021', '2022', '2023']
            }
        ],
        price: 240000,
        description: 'Lọc gió cabin Kia Soluto giá rẻ nhưng chất lượng cao. Lọc bụi và mùi hôi hiệu quả cho cabin xe.',
        images: [
            {
                public_id: 'kia-soluto-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/kia-soluto-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Kia Soluto'
            }
        ],
        stock: 35,
        origin: 'Hàn Quốc',
        material: 'Sợi tổng hợp và lớp kháng khuẩn',
        dimensions: '180 x 160 x 25 mm',
        warranty: '10 tháng'
    },
    {
        name: 'Lọc gió động cọ Kia Carnival',
        code: 'KIA-CAR-026',
        brandName: 'Kia',
        compatibleModels: [
            {
                carModelName: 'Carnival',
                years: ['2021', '2022', '2023', '2024']
            }
        ],
        price: 450000,
        description: 'Lọc gió động cơ Kia Carnival cho động cơ V6. Thiết kế đặc biệt cho xe 7-8 chỗ, đảm bảo hiệu suất cao.',
        images: [
            {
                public_id: 'kia-carnival-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/kia-carnival-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Kia Carnival'
            }
        ],
        stock: 9,
        origin: 'Hàn Quốc',
        material: 'Giấy lọc cao cấp và khung kim loại',
        dimensions: '290 x 230 x 58 mm',
        warranty: '19 tháng'
    },
    {
        name: 'Lọc nhiên liệu Kia Cerato Turbo',
        code: 'KIA-CER-027',
        brandName: 'Kia',
        compatibleModels: [
            {
                carModelName: 'Cerato',
                years: ['2019', '2020', '2021', '2022', '2023']
            }
        ],
        price: 420000,
        description: 'Lọc nhiên liệu chuyên dụng cho Kia Cerato phiên bản Turbo. Bảo vệ hệ thống phun xăng áp suất cao.',
        images: [
            {
                public_id: 'kia-cerato-turbo-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/kia-cerato-turbo-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Kia Cerato Turbo'
            }
        ],
        stock: 13,
        origin: 'Hàn Quốc',
        material: 'Giấy lọc turbo và vỏ nhựa chịu áp',
        dimensions: 'Ø58 x 102 mm',
        warranty: '13 tháng'
    },
    {
        name: 'Lọc gió cabin Ford Explorer',
        code: 'FOR-EXP-028',
        brandName: 'Ford',
        compatibleModels: [
            {
                carModelName: 'Explorer',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 420000,
        description: 'Lọc gió cabin Ford Explorer cao cấp. Công nghệ lọc 4 lớp với than hoạt tính và ion bạc kháng khuẩn.',
        images: [
            {
                public_id: 'ford-explorer-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/ford-explorer-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Ford Explorer'
            }
        ],
        stock: 17,
        origin: 'Mỹ',
        material: 'Than hoạt tính, ion bạc, sợi HEPA',
        dimensions: '235 x 200 x 42 mm',
        warranty: '18 tháng'
    },
    {
        name: 'Lọc gió động cơ Ford Ranger Raptor',
        code: 'FOR-RAN-029',
        brandName: 'Ford',
        compatibleModels: [
            {
                carModelName: 'Ranger',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 480000,
        description: 'Lọc gió động cơ Ford Ranger Raptor chuyên dụng. Thiết kế đặc biệt cho động cơ twin-turbo diesel.',
        images: [
            {
                public_id: 'ford-ranger-raptor-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/ford-ranger-raptor-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Ford Ranger Raptor'
            }
        ],
        stock: 12,
        origin: 'Mỹ',
        material: 'Giấy lọc off-road và khung nhựa cứng',
        dimensions: '310 x 240 x 65 mm',
        warranty: '20 tháng'
    },
    {
        name: 'Lọc nhiên liệu Ford EcoSport',
        code: 'FOR-ECO-030',
        brandName: 'Ford',
        compatibleModels: [
            {
                carModelName: 'EcoSport',
                years: ['2018', '2019', '2020', '2021', '2022']
            }
        ],
        price: 380000,
        description: 'Lọc nhiên liệu Ford EcoSport chính hãng. Phù hợp cho động cơ EcoBoost, lọc hiệu quả tạp chất.',
        images: [
            {
                public_id: 'ford-ecosport-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/ford-ecosport-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Ford EcoSport'
            }
        ],
        stock: 19,
        origin: 'Mỹ',
        material: 'Giấy lọc EcoBoost và thân polymer',
        dimensions: 'Ø56 x 95 mm',
        warranty: '12 tháng'
    },
    {
        name: 'Lọc gió cabin Toyota Corolla Cross',
        code: 'TOY-COR-031',
        brandName: 'Toyota',
        compatibleModels: [
            {
                carModelName: 'Corolla',
                years: ['2021', '2022', '2023', '2024']
            }
        ],
        price: 280000,
        description: 'Lọc gió cabin Toyota Corolla Cross. Công nghệ lọc tiên tiến, phù hợp cho SUV compact.',
        images: [
            {
                public_id: 'toyota-corolla-cross-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/toyota-corolla-cross-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Toyota Corolla Cross'
            }
        ],
        stock: 30,
        origin: 'Nhật Bản',
        material: 'Sợi tổng hợp và than hoạt tính',
        dimensions: '195 x 170 x 28 mm',
        warranty: '14 tháng'
    },
    {
        name: 'Lọc dầu Honda Accord Hybrid',
        code: 'HON-ACC-032',
        brandName: 'Honda',
        compatibleModels: [
            {
                carModelName: 'Accord',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 360000,
        description: 'Lọc dầu chuyên dụng cho Honda Accord Hybrid. Thiết kế đặc biệt cho hệ thống hybrid i-MMD.',
        images: [
            {
                public_id: 'honda-accord-hybrid-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/honda-accord-hybrid-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Honda Accord Hybrid'
            }
        ],
        stock: 16,
        origin: 'Nhật Bản',
        material: 'Kim loại và cao su hybrid-grade',
        dimensions: 'Ø69 x 83 mm',
        warranty: '15 tháng'
    },
    {
        name: 'Lọc gió động cơ Hyundai Elantra Sport',
        code: 'HYU-ELA-033',
        brandName: 'Hyundai',
        compatibleModels: [
            {
                carModelName: 'Elantra',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 390000,
        description: 'Lọc gió động cơ cho Hyundai Elantra Sport. Thiết kế thể thao với hiệu suất lọc cao.',
        images: [
            {
                public_id: 'hyundai-elantra-sport-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/hyundai-elantra-sport-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Hyundai Elantra Sport'
            }
        ],
        stock: 21,
        origin: 'Hàn Quốc',
        material: 'Giấy lọc sport grade và khung composite',
        dimensions: '255 x 195 x 50 mm',
        warranty: '16 tháng'
    },
    {
        name: 'Lọc nhiên liệu Mazda CX-5 Diesel',
        code: 'MAZ-CX5-034',
        brandName: 'Mazda',
        compatibleModels: [
            {
                carModelName: 'CX-5',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 520000,
        description: 'Lọc nhiên liệu chuyên dụng cho Mazda CX-5 diesel. Công nghệ SKYACTIV-D với bộ tách nước.',
        images: [
            {
                public_id: 'mazda-cx5-diesel-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mazda-cx5-diesel-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Mazda CX-5 Diesel'
            }
        ],
        stock: 10,
        origin: 'Nhật Bản',
        material: 'Giấy lọc SKYACTIV-D và van tách nước',
        dimensions: 'Ø75 x 140 mm',
        warranty: '18 tháng'
    },
    {
        name: 'Lọc gió cabin Kia Seltos Premium',
        code: 'KIA-SEL-035',
        brandName: 'Kia',
        compatibleModels: [
            {
                carModelName: 'Seltos',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 350000,
        description: 'Lọc gió cabin cao cấp cho Kia Seltos. Công nghệ PM2.5 và khử virus, bảo vệ sức khỏe tối ưu.',
        images: [
            {
                public_id: 'kia-seltos-premium-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/kia-seltos-premium-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Kia Seltos Premium'
            }
        ],
        stock: 14,
        origin: 'Hàn Quốc',
        material: 'Sợi HEPA, than hoạt tính, ion âm',
        dimensions: '210 x 185 x 35 mm',
        warranty: '17 tháng'
    },
    {
        name: 'Lọc dầu Ford Focus ST',
        code: 'FOR-FOC-036',
        brandName: 'Ford',
        compatibleModels: [
            {
                carModelName: 'Focus',
                years: ['2019', '2020', '2021', '2022']
            }
        ],
        price: 340000,
        description: 'Lọc dầu Ford Focus ST chuyên dụng. Thiết kế cho động cơ EcoBoost turbo, hiệu suất cao.',
        images: [
            {
                public_id: 'ford-focus-st-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/ford-focus-st-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Ford Focus ST'
            }
        ],
        stock: 18,
        origin: 'Mỹ',
        material: 'Kim loại chịu nhiệt và cao su FKM',
        dimensions: 'Ø67 x 80 mm',
        warranty: '10 tháng'
    },
    {
        name: 'Lọc gió động cơ Toyota Vios GR-S',
        code: 'TOY-VIO-037',
        brandName: 'Toyota',
        compatibleModels: [
            {
                carModelName: 'Vios',
                years: ['2022', '2023', '2024']
            }
        ],
        price: 320000,
        description: 'Lọc gió động cơ Toyota Vios GR-S phiên bản thể thao. Tối ưu hóa cho động cơ 1.5L CVT.',
        images: [
            {
                public_id: 'toyota-vios-grs-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/toyota-vios-grs-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cọ Toyota Vios GR-S'
            }
        ],
        stock: 25,
        origin: 'Nhật Bản',
        material: 'Giấy lọc thể thao và khung nhựa ABS',
        dimensions: '230 x 175 x 42 mm',
        warranty: '12 tháng'
    },
    {
        name: 'Lọc nhiên liệu Honda CR-V Hybrid',
        code: 'HON-CRV-038',
        brandName: 'Honda',
        compatibleModels: [
            {
                carModelName: 'CR-V',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 550000,
        description: 'Lọc nhiên liệu chuyên dụng cho Honda CR-V Hybrid. Công nghệ i-MMD với hệ thống lọc kép.',
        images: [
            {
                public_id: 'honda-crv-hybrid-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/honda-crv-hybrid-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Honda CR-V Hybrid'
            }
        ],
        stock: 8,
        origin: 'Nhật Bản',
        material: 'Giấy lọc hybrid và vỏ nhựa chuyên dụng',
        dimensions: 'Ø61 x 118 mm',
        warranty: '22 tháng'
    },
    {
        name: 'Lọc gió cabin Hyundai Tucson Hybrid',
        code: 'HYU-TUC-039',
        brandName: 'Hyundai',
        compatibleModels: [
            {
                carModelName: 'Tucson',
                years: ['2021', '2022', '2023', '2024']
            }
        ],
        price: 410000,
        description: 'Lọc gió cabin Hyundai Tucson Hybrid cao cấp. Công nghệ Clean Air với ion âm và ozone.',
        images: [
            {
                public_id: 'hyundai-tucson-hybrid-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/hyundai-tucson-hybrid-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Hyundai Tucson Hybrid'
            }
        ],
        stock: 12,
        origin: 'Hàn Quốc',
        material: 'Sợi HEPA, than hoạt tính, generator ion',
        dimensions: '240 x 205 x 38 mm',
        warranty: '20 tháng'
    },
    {
        name: 'Lọc dầu Mazda3 Turbo',
        code: 'MAZ-M3-040',
        brandName: 'Mazda',
        compatibleModels: [
            {
                carModelName: 'Mazda3',
                years: ['2021', '2022', '2023', '2024']
            }
        ],
        price: 375000,
        description: 'Lọc dầu Mazda3 Turbo chuyên dụng. Thiết kế cho động cơ SKYACTIV-G 2.5T turbo.',
        images: [
            {
                public_id: 'mazda3-turbo-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mazda3-turbo-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Mazda3 Turbo'
            }
        ],
        stock: 15,
        origin: 'Nhật Bản',
        material: 'Kim loại và cao su turbo-grade',
        dimensions: 'Ø71 x 85 mm',
        warranty: '12 tháng'
    },
    {
        name: 'Lọc gió động cơ Kia Sorento Hybrid',
        code: 'KIA-SOR-041',
        brandName: 'Kia',
        compatibleModels: [
            {
                carModelName: 'Sorento',
                years: ['2021', '2022', '2023', '2024']
            }
        ],
        price: 430000,
        description: 'Lọc gió động cơ Kia Sorento Hybrid. Thiết kế đặc biệt cho hệ thống hybrid 6 chỗ.',
        images: [
            {
                public_id: 'kia-sorento-hybrid-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/kia-sorento-hybrid-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Kia Sorento Hybrid'
            }
        ],
        stock: 11,
        origin: 'Hàn Quốc',
        material: 'Giấy lọc hybrid và khung polymer',
        dimensions: '275 x 210 x 52 mm',
        warranty: '18 tháng'
    },
    {
        name: 'Lọc nhiên liệu Ford Everest Biturbo',
        code: 'FOR-EVE-042',
        brandName: 'Ford',
        compatibleModels: [
            {
                carModelName: 'Everest',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 580000,
        description: 'Lọc nhiên liệu Ford Everest Biturbo chuyên dụng. Cho động cơ diesel twin-turbo 2.0L.',
        images: [
            {
                public_id: 'ford-everest-biturbo-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/ford-everest-biturbo-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Ford Everest Biturbo'
            }
        ],
        stock: 7,
        origin: 'Mỹ',
        material: 'Giấy lọc biturbo và hệ thống tách nước',
        dimensions: 'Ø82 x 155 mm',
        warranty: '24 tháng'
    },
    {
        name: 'Lọc gió cabin Toyota Fortuner Legender',
        code: 'TOY-FOR-043',
        brandName: 'Toyota',
        compatibleModels: [
            {
                carModelName: 'Fortuner',
                years: ['2021', '2022', '2023', '2024']
            }
        ],
        price: 390000,
        description: 'Lọc gió cabin Toyota Fortuner Legender cao cấp. Công nghệ Nanoe-X khử khuẩn và làm sạch không khí.',
        images: [
            {
                public_id: 'toyota-fortuner-legender-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/toyota-fortuner-legender-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Toyota Fortuner Legender'
            }
        ],
        stock: 13,
        origin: 'Nhật Bản',
        material: 'Sợi Nanoe-X, than hoạt tính premium',
        dimensions: '250 x 210 x 40 mm',
        warranty: '19 tháng'
    },
    {
        name: 'Lọc dầu Honda City RS',
        code: 'HON-CIT-044',
        brandName: 'Honda',
        compatibleModels: [
            {
                carModelName: 'City',
                years: ['2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 285000,
        description: 'Lọc dầu Honda City RS phiên bản thể thao. Tối ưu cho động cơ VTEC 1.0L turbo.',
        images: [
            {
                public_id: 'honda-city-rs-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/honda-city-rs-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Honda City RS'
            }
        ],
        stock: 28,
        origin: 'Nhật Bản',
        material: 'Kim loại và cao su VTEC-grade',
        dimensions: 'Ø64 x 76 mm',
        warranty: '8 tháng'
    },
    {
        name: 'Lọc gió động cơ Hyundai Accent Hatchback',
        code: 'HYU-ACC-045',
        brandName: 'Hyundai',
        compatibleModels: [
            {
                carModelName: 'Accent',
                years: ['2021', '2022', '2023']
            }
        ],
        price: 270000,
        description: 'Lọc gió động cọ Hyundai Accent Hatchback. Thiết kế compact cho động cơ 1.4L MPI.',
        images: [
            {
                public_id: 'hyundai-accent-hatchback-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/hyundai-accent-hatchback-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Hyundai Accent Hatchback'
            }
        ],
        stock: 32,
        origin: 'Hàn Quốc',
        material: 'Giấy lọc MPI và khung nhựa',
        dimensions: '210 x 165 x 38 mm',
        warranty: '11 tháng'
    },
    {
        name: 'Lọc nhiên liệu Mazda CX-8 Premium',
        code: 'MAZ-CX8-046',
        brandName: 'Mazda',
        compatibleModels: [
            {
                carModelName: 'CX-8',
                years: ['2021', '2022', '2023', '2024']
            }
        ],
        price: 510000,
        description: 'Lọc nhiên liệu Mazda CX-8 Premium. Công nghệ SKYACTIV-G cho động cơ 2.5L turbo 7 chỗ.',
        images: [
            {
                public_id: 'mazda-cx8-premium-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mazda-cx8-premium-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Mazda CX-8 Premium'
            }
        ],
        stock: 9,
        origin: 'Nhật Bản',
        material: 'Giấy lọc SKYACTIV-G và thân titanium',
        dimensions: 'Ø65 x 115 mm',
        warranty: '21 tháng'
    },
    {
        name: 'Lọc gió cabin Kia Carnival Premium',
        code: 'KIA-CAR-047',
        brandName: 'Kia',
        compatibleModels: [
            {
                carModelName: 'Carnival',
                years: ['2022', '2023', '2024']
            }
        ],
        price: 460000,
        description: 'Lọc gió cabin Kia Carnival Premium cho xe 8 chỗ. Hệ thống lọc 3 vùng khí hậu độc lập.',
        images: [
            {
                public_id: 'kia-carnival-premium-cabin-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/kia-carnival-premium-cabin-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió cabin Kia Carnival Premium'
            }
        ],
        stock: 6,
        origin: 'Hàn Quốc',
        material: 'Sợi HEPA cao cấp, than hoạt tính 3 lớp',
        dimensions: '260 x 220 x 45 mm',
        warranty: '22 tháng'
    },
    {
        name: 'Lọc dầu Ford Ranger Wildtrak',
        code: 'FOR-RAN-048',
        brandName: 'Ford',
        compatibleModels: [
            {
                carModelName: 'Ranger',
                years: ['2019', '2020', '2021', '2022', '2023', '2024']
            }
        ],
        price: 365000,
        description: 'Lọc dầu Ford Ranger Wildtrak chuyên dụng. Phù hợp cho động cơ diesel biturbo off-road.',
        images: [
            {
                public_id: 'ford-ranger-wildtrak-oil-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/ford-ranger-wildtrak-oil-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc dầu Ford Ranger Wildtrak'
            }
        ],
        stock: 16,
        origin: 'Mỹ',
        material: 'Kim loại chống ăn mòn và cao su EPDM',
        dimensions: 'Ø77 x 92 mm',
        warranty: '14 tháng'
    },
    {
        name: 'Lọc gió động cơ Toyota Camry 2.5Q',
        code: 'TOY-CAM-049',
        brandName: 'Toyota',
        compatibleModels: [
            {
                carModelName: 'Camry',
                years: ['2021', '2022', '2023', '2024']
            }
        ],
        price: 360000,
        description: 'Lọc gió động cọ Toyota Camry 2.5Q cao cấp. Dynamic Force Engine với hiệu suất nhiên liệu tối ưu.',
        images: [
            {
                public_id: 'toyota-camry-25q-air-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/toyota-camry-25q-air-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc gió động cơ Toyota Camry 2.5Q'
            }
        ],
        stock: 17,
        origin: 'Nhật Bản',
        material: 'Giấy lọc Dynamic Force và khung composite',
        dimensions: '248 x 188 x 47 mm',
        warranty: '15 tháng'
    },
    {
        name: 'Lọc nhiên liệu Honda Civic Type R',
        code: 'HON-CIV-050',
        brandName: 'Honda',
        compatibleModels: [
            {
                carModelName: 'Civic',
                years: ['2022', '2023', '2024']
            }
        ],
        price: 620000,
        description: 'Lọc nhiên liệu Honda Civic Type R hiệu suất cao. Thiết kế cho động cơ VTEC Turbo 2.0L 320HP.',
        images: [
            {
                public_id: 'honda-civic-type-r-fuel-filter',
                url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/honda-civic-type-r-fuel-filter.jpg',
                width: 800,
                height: 600,
                alt: 'Lọc nhiên liệu Honda Civic Type R'
            }
        ],
        stock: 4,
        origin: 'Nhật Bản',
        material: 'Giấy lọc Type R performance và vỏ carbon fiber',
        dimensions: 'Ø63 x 125 mm',
        warranty: '24 tháng'
    }
];

// Sample Blog Data
const sampleBlogs = [
    {
        title: 'Cách bảo dưỡng lọc gió động cơ ô tô đúng cách',
        slug: 'cach-bao-duong-loc-gio-dong-co-o-to-dung-cach',
        content: `Lọc gió động cơ đóng vai trò quan trọng trong việc bảo vệ động cơ xe ô tô khỏi bụi bẩn và tạp chất. Việc bảo dưỡng lọc gió đúng cách không chỉ giúp tăng tuổi thọ động cơ mà còn cải thiện hiệu suất và tiết kiệm nhiên liệu.

## Tại sao cần bảo dưỡng lọc gió động cơ?

Lọc gió động cơ có nhiệm vụ lọc sạch không khí trước khi đưa vào buồng đốt. Nếu lọc gió bị bẩn hoặc tắc nghẽn:
- Giảm hiệu suất động cơ
- Tăng mức tiêu thụ nhiên liệu  
- Gây hại cho các bộ phận bên trong động cơ
- Làm giảm tuổi thọ động cơ

## Dấu hiệu cần thay lọc gió

1. **Màu sắc thay đổi**: Lọc gió có màu đen hoặc nâu đậm
2. **Hiệu suất giảm**: Xe chạy không êm, tăng tốc chậm
3. **Tiêu thụ nhiên liệu tăng**: Xe "ngốn" xăng hơn bình thường
4. **Âm thanh bất thường**: Động cơ phát ra tiếng ồn lạ

## Chu kỳ thay lọc gió

- **Xe con**: 15,000 - 20,000 km
- **Xe tải**: 10,000 - 15,000 km  
- **Điều kiện khắc nghiệt**: 8,000 - 10,000 km

## Cách kiểm tra và thay lọc gió

### Bước 1: Tìm vị trí lọc gió
Lọc gió thường nằm trong hộp lọc gió (air box) gần động cơ.

### Bước 2: Kiểm tra tình trạng
- Tháo lọc gió ra và kiểm tra màu sắc
- Quan sát độ dày của lớp bụi bẩn
- Kiểm tra tình trạng vật liệu lọc

### Bước 3: Thay thế
- Sử dụng lọc gió chính hãng phù hợp với xe
- Lắp đặt đúng hướng và vị trí
- Đảm bảo khớp chặt và kín khít

Việc bảo dưỡng lọc gió đúng cách sẽ giúp xe hoạt động tốt hơn và tiết kiệm chi phí.`,
        featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1234567890/blog-air-filter-maintenance.jpg',
        author: 'Chuyên gia ô tô LocGioGiaSi',
        category: 'Bảo dưỡng',
        tags: ['lọc gió', 'bảo dưỡng', 'động cơ', 'ô tô', 'tiết kiệm nhiên liệu'],
        status: 'published',
        featured: true
    },
    {
        title: 'Tầm quan trọng của lọc dầu trong hệ thống bôi trơn động cơ',
        slug: 'tam-quan-trong-cua-loc-dau-trong-he-thong-boi-tron-dong-co',
        content: `Lọc dầu là một bộ phận không thể thiếu trong hệ thống bôi trơn của động cơ ô tô. Vai trò của lọc dầu không chỉ đơn giản là lọc sạch dầu nhờn mà còn bảo vệ toàn bộ hệ thống động cơ.

## Vai trò của lọc dầu

### 1. Lọc tạp chất
- Loại bỏ các hạt kim loại mài mòn
- Lọc bụi bẩn và cặn bã
- Ngăn chặn các chất ô nhiễm từ môi trường

### 2. Bảo vệ động cơ  
- Giữ dầu nhờn luôn sạch
- Ngăn ngừa mài mòn các bộ phận
- Tăng tuổi thọ động cơ đáng kể

### 3. Duy trì hiệu suất
- Đảm bảo lưu thông dầu nhờn
- Giữ áp suất dầu ổn định
- Tối ưu hóa hiệu suất bôi trơn

## Các loại lọc dầu phổ biến

### 1. Lọc dầu cơ học
- Sử dụng vật liệu lọc truyền thống
- Giá thành phải chăng
- Phù hợp cho xe sử dụng thông thường

### 2. Lọc dầu tổng hợp
- Công nghệ hiện đại
- Hiệu quả lọc cao hơn 
- Tuổi thọ dài hơn

### 3. Lọc dầu từ tính
- Sử dụng nam châm thu hút kim loại
- Hiệu quả cao với hạt kim loại
- Thường kết hợp với lọc cơ học

## Dấu hiệu cần thay lọc dầu

1. **Theo chu kỳ**: 5,000-10,000 km tùy loại xe
2. **Dầu đen**: Dầu nhờn có màu đen đặc
3. **Tiếng ồn**: Động cơ phát ra tiếng gõ
4. **Áp suất dầu thấp**: Đèn báo sáng

## Lưu ý khi thay lọc dầu

- Thay lọc dầu cùng lúc với thay dầu nhờn
- Sử dụng lọc dầu chính hãng
- Kiểm tra độ kín sau khi lắp
- Khởi động thử và kiểm tra

Việc bảo dưỡng lọc dầu đúng cách là yếu tố quan trọng giúp động cơ hoạt động êm ái và bền bỉ.`,
        featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1234567890/blog-oil-filter-importance.jpg',
        author: 'Kỹ thuật viên LocGioGiaSi',
        category: 'Kiến thức',
        tags: ['lọc dầu', 'bôi trơn', 'động cơ', 'bảo dưỡng', 'dầu nhờn'],
        status: 'published',
        featured: false
    },
    {
        title: 'Hướng dẫn chọn lọc nhiên liệu phù hợp cho xe của bạn',
        slug: 'huong-dan-chon-loc-nhien-lieu-phu-hop-cho-xe',
        content: `Lọc nhiên liệu đóng vai trò quan trọng trong việc bảo vệ hệ thống phun xăng và động cơ. Việc chọn đúng loại lọc nhiên liệu sẽ giúp xe hoạt động tối ưu và tiết kiệm chi phí bảo dưỡng.

## Tại sao cần lọc nhiên liệu?

Nhiên liệu từ bình xăng có thể chứa:
- Tạp chất và cặn bẩn
- Nước do ngưng tụ
- Vi khuẩn và nấm mốc
- Kim loại gỉ sét

## Các loại lọc nhiên liệu

### 1. Lọc nhiên liệu trong bình
- Lọc thô đầu tiên
- Loại bỏ tạp chất lớn
- Bảo vệ bơm xăng

### 2. Lọc nhiên liệu ngoài
- Lọc tinh hơn
- Đặt giữa bơm và kim phun
- Lọc tạp chất nhỏ

### 3. Lọc kim phun
- Lọc cuối cùng
- Bảo vệ trực tiếp kim phun
- Độ mịn cao nhất

## Cách chọn lọc nhiên liệu

### 1. Theo hãng xe
- Toyota: Denso, Toyota chính hãng
- Honda: Honda Genuine, Sakura
- Hyundai: Hyundai Mobis, Mann Filter
- Mazda: Mazda chính hãng, Bosch

### 2. Theo loại động cơ
- **Xăng**: Lọc giấy thông thường
- **Diesel**: Lọc có tách nước
- **Turbo**: Lọc cao cấp hơn

### 3. Theo điều kiện sử dụng
- **Thành phố**: Chu kỳ thay tiêu chuẩn
- **Đường xa**: Thay sớm hơn 20%
- **Nhiên liệu kém**: Thay thường xuyên

## Chu kỳ thay lọc nhiên liệu

- **Xe xăng**: 40,000 - 60,000 km
- **Xe diesel**: 20,000 - 40,000 km
- **Xe turbo**: 30,000 - 50,000 km

## Dấu hiệu cần thay

1. Xe giật cục khi tăng tốc
2. Mất công suất trên đường dốc
3. Khó khởi động
4. Tiêu thụ nhiên liệu tăng

Việc chọn và thay lọc nhiên liệu đúng cách sẽ bảo vệ hệ thống phun xăng và tăng tuổi thọ động cơ.`,
        featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1234567890/blog-fuel-filter-guide.jpg',
        author: 'Chuyên gia LocGioGiaSi',
        category: 'Hướng dẫn',
        tags: ['lọc nhiên liệu', 'phun xăng', 'nhiên liệu', 'chọn mua', 'bảo dưỡng'],
        status: 'published',
        featured: true
    },
    {
        title: 'Lọc gió cabin: Giải pháp không khí sạch trong xe',
        slug: 'loc-gio-cabin-giai-phap-khong-khi-sach-trong-xe',
        content: `Lọc gió cabin (hay còn gọi là lọc điều hòa) có vai trò quan trọng trong việc đảm bảo chất lượng không khí bên trong xe. Đây là bộ phận thường bị bỏ qua nhưng lại ảnh hưởng trực tiếp đến sức khỏe người lái và hành khách.

## Vai trò của lọc gió cabin

### 1. Lọc bụi bẩn
- Ngăn chặn bụi đường vào cabin
- Lọc phấn hoa gây dị ứng
- Giảm ô nhiễm không khí

### 2. Khử mùi
- Loại bỏ mùi khói xe
- Giảm mùi khí thải
- Khử mùi hôi từ môi trường

### 3. Bảo vệ sức khỏe
- Ngăn vi khuẩn và nấm mốc
- Giảm nguy cơ dị ứng
- Bảo vệ hệ hô hấp

## Các loại lọc gió cabin

### 1. Lọc thông thường
- Vật liệu sợi tổng hợp
- Chỉ lọc bụi cơ bản
- Giá thành rẻ

### 2. Lọc than hoạt tính
- Có lớp than hoạt tính
- Khử mùi hiệu quả
- Lọc khí độc hại

### 3. Lọc HEPA
- Hiệu suất lọc cao (99.97%)
- Lọc được hạt siêu nhỏ
- Phù hợp vùng ô nhiễm cao

### 4. Lọc ion bạc
- Có tính kháng khuẩn
- Ngăn ngừa nấm mốc
- Bền bỉ hơn

## Dấu hiệu cần thay

1. **Lưu lượng gió giảm**
2. **Có mùi hôi khi bật điều hòa**
3. **Kính xe bị mờ thường xuyên**
4. **Hắt hơi khi bật điều hòa**

## Chu kỳ thay lọc cabin

- **Điều kiện bình thường**: 15,000 km
- **Khu vực ô nhiễm**: 10,000 km
- **Mùa bụi**: 8,000 km
- **Theo thời gian**: 12 tháng

## Cách bảo dưỡng

### 1. Kiểm tra định kỳ
- Mở hộp lọc kiểm tra
- Quan sát màu sắc
- Đánh giá độ bẩn

### 2. Vệ sinh sơ bộ
- Dùng máy thổi khí nén
- Không rửa bằng nước
- Chỉ áp dụng khi ít bẩn

### 3. Thay mới
- Sử dụng lọc chính hãng
- Lắp đúng hướng
- Kiểm tra độ kín

Lọc gió cabin sạch sẽ không chỉ mang lại không khí trong lành mà còn bảo vệ sức khỏe gia đình bạn.`,
        featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1234567890/blog-cabin-filter-clean-air.jpg',
        author: 'Chuyên gia LocGioGiaSi',
        category: 'Sức khỏe',
        tags: ['lọc cabin', 'điều hòa', 'không khí', 'sức khỏe', 'than hoạt tính'],
        status: 'published',
        featured: false
    }
];

// Default Settings Data
const defaultSettings = {
    storeName: 'LocGioGiaSi - Chuyên phân phối lọc gió, lọc dầu ô tô chính hãng',
    address: '123 Đường Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 1, TP.HCM',
    phone: '0123456789',
    email: 'info@locgiogiasi.com',
    logo: 'https://res.cloudinary.com/demo/image/upload/v1234567890/locgiogiasi-logo.png'
};

// Sample Orders Data
const sampleOrders = [
    {
        customer: {
            name: 'Nguyễn Văn Anh',
            email: 'nguyenvananh@gmail.com',
            phone: '0901234567',
            address: '123 Đường Lê Lợi',
            city: 'TP.HCM',
            district: 'Quận 1',
            ward: 'Phường Bến Nghé'
        },
        items: [
            { productCode: 'TOY-CAM-001', quantity: 2, price: 350000 }
        ],
        status: 'contacted',
        notes: 'Khách hàng muốn giao hàng buổi chiều',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Trần Thị Bình',
            email: 'tranthibinh@gmail.com',
            phone: '0987654321',
            address: '456 Đường Nguyễn Huệ',
            city: 'TP.HCM',
            district: 'Quận 3',
            ward: 'Phường Võ Thị Sáu'
        },
        items: [
            { productCode: 'HON-CIV-002', quantity: 1, price: 280000 },
            { productCode: 'HYU-ELA-003', quantity: 1, price: 450000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 25) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Lê Hoàng Cường',
            email: 'lehoangcuong@yahoo.com',
            phone: '0912345678',
            address: '789 Đường Pasteur',
            city: 'TP.HCM',
            district: 'Quận 1',
            ward: 'Phường Nguyễn Thái Bình'
        },
        items: [
            { productCode: 'FOR-FOC-004', quantity: 1, price: 380000 }
        ],
        status: 'contacted',
        notes: 'Khách hàng yêu cầu kiểm tra kỹ sản phẩm',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Phạm Thị Diệu',
            email: 'phamthidieu@hotmail.com',
            phone: '0923456789',
            address: '321 Đường Trần Hưng Đạo',
            city: 'Hà Nội',
            district: 'Hoàn Kiếm',
            ward: 'Phường Tràng Tiền'
        },
        items: [
            { productCode: 'MAZ-CX5-005', quantity: 2, price: 420000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 18) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Võ Minh Đức',
            email: 'vominhduc@gmail.com',
            phone: '0934567890',
            address: '654 Đường Cách Mạng Tháng 8',
            city: 'TP.HCM',
            district: 'Quận 10',
            ward: 'Phường 6'
        },
        items: [
            { productCode: 'TOY-CAM-001', quantity: 1, price: 350000 },
            { productCode: 'HON-CIV-002', quantity: 2, price: 280000 }
        ],
        status: 'contacted',
        notes: 'Giao hàng tận nơi',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Hoàng Thị Hoa',
            email: 'hoangthihoa@gmail.com',
            phone: '0945678901',
            address: '987 Đường Điện Biên Phủ',
            city: 'TP.HCM',
            district: 'Bình Thạnh',
            ward: 'Phường 15'
        },
        items: [
            { productCode: 'HYU-ELA-003', quantity: 1, price: 450000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 12) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Đặng Văn Giang',
            email: 'dangvangiang@outlook.com',
            phone: '0956789012',
            address: '147 Đường Võ Văn Tần',
            city: 'TP.HCM',
            district: 'Quận 3',
            ward: 'Phường 6'
        },
        items: [
            { productCode: 'FOR-FOC-004', quantity: 3, price: 380000 }
        ],
        status: 'contacted',
        notes: 'Khách hàng có garage riêng',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Bùi Thị Kim',
            email: 'buithikim@yahoo.com',
            phone: '0967890123',
            address: '258 Đường Hai Bà Trưng',
            city: 'Hà Nội',
            district: 'Hai Bà Trưng',
            ward: 'Phường Bạch Đằng'
        },
        items: [
            { productCode: 'MAZ-CX5-005', quantity: 1, price: 420000 },
            { productCode: 'TOY-CAM-001', quantity: 1, price: 350000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 8) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Lý Văn Long',
            email: 'lyvanlong@gmail.com',
            phone: '0978901234',
            address: '369 Đường Nguyễn Thị Minh Khai',
            city: 'TP.HCM',
            district: 'Quận 1',
            ward: 'Phường Đa Kao'
        },
        items: [
            { productCode: 'HON-CIV-002', quantity: 1, price: 280000 }
        ],
        status: 'contacted',
        notes: 'Khách hàng VIP',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Chu Thị Mai',
            email: 'chuthimai@hotmail.com',
            phone: '0989012345',
            address: '741 Đường Lý Thường Kiệt',
            city: 'TP.HCM',
            district: 'Quận 11',
            ward: 'Phường 7'
        },
        items: [
            { productCode: 'HYU-ELA-003', quantity: 2, price: 450000 },
            { productCode: 'FOR-FOC-004', quantity: 1, price: 380000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 6) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Phan Văn Nam',
            email: 'phanvannam@gmail.com',
            phone: '0990123456',
            address: '852 Đường Hoàng Văn Thụ',
            city: 'TP.HCM',
            district: 'Tân Bình',
            ward: 'Phường 4'
        },
        items: [
            { productCode: 'MAZ-CX5-005', quantity: 1, price: 420000 }
        ],
        status: 'contacted',
        notes: 'Giao hàng trước 17h',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Đỗ Thị Oanh',
            email: 'dothioanh@yahoo.com',
            phone: '0901234568',
            address: '963 Đường Xô Viết Nghệ Tĩnh',
            city: 'TP.HCM',
            district: 'Bình Thạnh',
            ward: 'Phường 21'
        },
        items: [
            { productCode: 'TOY-CAM-001', quantity: 2, price: 350000 },
            { productCode: 'HON-CIV-002', quantity: 1, price: 280000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 4) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Ngô Văn Phúc',
            email: 'ngovanphuc@outlook.com',
            phone: '0912345679',
            address: '159 Đường Trường Chinh',
            city: 'Hà Nội',
            district: 'Đống Đa',
            ward: 'Phường Láng Thượng'
        },
        items: [
            { productCode: 'FOR-FOC-004', quantity: 1, price: 380000 }
        ],
        status: 'contacted',
        notes: 'Thanh toán khi nhận hàng',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Vũ Thị Quỳnh',
            email: 'vuthiquynh@gmail.com',
            phone: '0923456780',
            address: '753 Đường Nguyễn Kiệm',
            city: 'TP.HCM',
            district: 'Phú Nhuận',
            ward: 'Phường 3'
        },
        items: [
            { productCode: 'HYU-ELA-003', quantity: 1, price: 450000 },
            { productCode: 'MAZ-CX5-005', quantity: 1, price: 420000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Lâm Văn Rồng',
            email: 'lamvanrong@hotmail.com',
            phone: '0934567891',
            address: '486 Đường Phạm Văn Đồng',
            city: 'TP.HCM',
            district: 'Gò Vấp',
            ward: 'Phường 11'
        },
        items: [
            { productCode: 'TOY-CAM-001', quantity: 1, price: 350000 }
        ],
        status: 'contacted',
        notes: 'Khách hàng có kinh nghiệm sửa chữa',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 1) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Cao Thị Sương',
            email: 'caothisuong@gmail.com',
            phone: '0945678902',
            address: '297 Đường Quang Trung',
            city: 'TP.HCM',
            district: 'Gò Vấp',
            ward: 'Phường 10'
        },
        items: [
            { productCode: 'HON-CIV-002', quantity: 2, price: 280000 },
            { productCode: 'FOR-FOC-004', quantity: 1, price: 380000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Đinh Văn Tuấn',
            email: 'dinhvantuan@yahoo.com',
            phone: '0956789013',
            address: '618 Đường Lê Văn Việt',
            city: 'TP.HCM',
            district: 'Quận 9',
            ward: 'Phường Hiệp Phú'
        },
        items: [
            { productCode: 'MAZ-CX5-005', quantity: 3, price: 420000 }
        ],
        status: 'contacted',
        notes: 'Khách hàng có nhiều xe',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 28) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Huỳnh Thị Uyên',
            email: 'huynhthuyen@outlook.com',
            phone: '0967890124',
            address: '529 Đường Tô Ngọc Vân',
            city: 'Hà Nội',
            district: 'Tây Hồ',
            ward: 'Phường Quảng An'
        },
        items: [
            { productCode: 'HYU-ELA-003', quantity: 1, price: 450000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 26) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Trịnh Văn Vinh',
            email: 'trinhvanvinh@gmail.com',
            phone: '0978901235',
            address: '840 Đường Khánh Hội',
            city: 'TP.HCM',
            district: 'Quận 4',
            ward: 'Phường 6'
        },
        items: [
            { productCode: 'TOY-CAM-001', quantity: 1, price: 350000 },
            { productCode: 'HON-CIV-002', quantity: 1, price: 280000 },
            { productCode: 'FOR-FOC-004', quantity: 1, price: 380000 }
        ],
        status: 'contacted',
        notes: 'Đơn hàng combo',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 24) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Mai Thị Xuân',
            email: 'maithixuan@hotmail.com',
            phone: '0989012346',
            address: '175 Đường Nguyễn Văn Trỗi',
            city: 'TP.HCM',
            district: 'Phú Nhuận',
            ward: 'Phường 8'
        },
        items: [
            { productCode: 'MAZ-CX5-005', quantity: 2, price: 420000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 22) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Lưu Văn Yên',
            email: 'luuvanyen@gmail.com',
            phone: '0990123457',
            address: '462 Đường Âu Cơ',
            city: 'TP.HCM',
            district: 'Tân Phú',
            ward: 'Phường Tân Thành'
        },
        items: [
            { productCode: 'HYU-ELA-003', quantity: 2, price: 450000 },
            { productCode: 'TOY-CAM-001', quantity: 1, price: 350000 }
        ],
        status: 'contacted',
        notes: 'Khách hàng thân thiết',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Phan Thị Ánh',
            email: 'phanthianh@yahoo.com',
            phone: '0901234569',
            address: '693 Đường Hùng Vương',
            city: 'Đà Nẵng',
            district: 'Hải Châu',
            ward: 'Phường Thạch Thang'
        },
        items: [
            { productCode: 'FOR-FOC-004', quantity: 1, price: 380000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 18) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Đoàn Văn Bình',
            email: 'doanvanbinh@outlook.com',
            phone: '0912345680',
            address: '384 Đường Nguyễn Trãi',
            city: 'TP.HCM',
            district: 'Quận 5',
            ward: 'Phường 7'
        },
        items: [
            { productCode: 'HON-CIV-002', quantity: 3, price: 280000 }
        ],
        status: 'contacted',
        notes: 'Garage có nhiều xe Honda',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 16) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Tôn Thị Cẩm',
            email: 'tonthicam@gmail.com',
            phone: '0923456781',
            address: '517 Đường Tham Lương',
            city: 'TP.HCM',
            district: 'Quận 12',
            ward: 'Phường Thạnh Lộc'
        },
        items: [
            { productCode: 'MAZ-CX5-005', quantity: 1, price: 420000 },
            { productCode: 'HYU-ELA-003', quantity: 1, price: 450000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Lê Văn Đạt',
            email: 'levandat@hotmail.com',
            phone: '0934567892',
            address: '628 Đường Phan Văn Hớn',
            city: 'TP.HCM',
            district: 'Quận 12',
            ward: 'Phường Tân Thới Nhất'
        },
        items: [
            { productCode: 'TOY-CAM-001', quantity: 2, price: 350000 },
            { productCode: 'FOR-FOC-004', quantity: 2, price: 380000 }
        ],
        status: 'contacted',
        notes: 'Đơn hàng số lượng lớn',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 12) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Vương Thị Ế',
            email: 'vuongthie@yahoo.com',
            phone: '0945678903',
            address: '751 Đường Kinh Dương Vương',
            city: 'TP.HCM',
            district: 'Quận 6',
            ward: 'Phường 12'
        },
        items: [
            { productCode: 'HYU-ELA-003', quantity: 1, price: 450000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Hồ Văn Phong',
            email: 'hovanphong@gmail.com',
            phone: '0956789014',
            address: '364 Đường Tân Sơn Nhì',
            city: 'TP.HCM',
            district: 'Tân Phú',
            ward: 'Phường Tân Sơn Nhì'
        },
        items: [
            { productCode: 'MAZ-CX5-005', quantity: 1, price: 420000 },
            { productCode: 'HON-CIV-002', quantity: 1, price: 280000 }
        ],
        status: 'contacted',
        notes: 'Khách hàng có yêu cầu đặc biệt về bao bì',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 8) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Trương Thị Giang',
            email: 'truongthigiang@outlook.com',
            phone: '0967890125',
            address: '295 Đường Bình Long',
            city: 'TP.HCM',
            district: 'Tân Phú',
            ward: 'Phường Phú Thạnh'
        },
        items: [
            { productCode: 'TOY-CAM-001', quantity: 1, price: 350000 },
            { productCode: 'HYU-ELA-003', quantity: 1, price: 450000 },
            { productCode: 'FOR-FOC-004', quantity: 1, price: 380000 },
            { productCode: 'HON-CIV-002', quantity: 1, price: 280000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 6) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Nguyễn Văn Hải',
            email: 'nguyenvanhai@hotmail.com',
            phone: '0978901236',
            address: '582 Đường Lạc Long Quân',
            city: 'TP.HCM',
            district: 'Quận 11',
            ward: 'Phường 1'
        },
        items: [
            { productCode: 'MAZ-CX5-005', quantity: 2, price: 420000 }
        ],
        status: 'contacted',
        notes: 'Giao hàng cuối tuần',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 4) * 24 * 60 * 60 * 1000)
    },
    {
        customer: {
            name: 'Đặng Thị Lan',
            email: 'dangthilan@gmail.com',
            phone: '0989012347',
            address: '419 Đường Minh Phụng',
            city: 'TP.HCM',
            district: 'Quận 11',
            ward: 'Phường 9'
        },
        items: [
            { productCode: 'HON-CIV-002', quantity: 1, price: 280000 },
            { productCode: 'TOY-CAM-001', quantity: 3, price: 350000 }
        ],
        status: 'not contacted',
        notes: '',
        orderDate: new Date(Date.now() - Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000)
    }
];

// Clear all data function
async function clearAllData() {
    try {
        console.log('🗑️  Clearing all existing data...');
        
        // Delete all collections in order (to handle foreign key constraints)
        await Order.deleteMany({});
        console.log('✓ Cleared orders');
        
        await Product.deleteMany({});
        console.log('✓ Cleared products');
        
        await Brand.deleteMany({});
        console.log('✓ Cleared brands');
        
        await Blog.deleteMany({});
        console.log('✓ Cleared blogs');
        
        await Settings.deleteMany({});
        console.log('✓ Cleared settings');
        
        console.log('🎯 All existing data cleared successfully!');
    } catch (error) {
        console.error('❌ Error clearing data:', error);
        throw error;
    }
}

// Seed Functions
async function seedBrands() {
    try {
        console.log('🏭 Seeding brands...');
        const createdBrands = await Brand.insertMany(sampleBrands);
        console.log(`✅ Created ${createdBrands.length} brands`);
        return createdBrands;
    } catch (error) {
        console.error('❌ Error seeding brands:', error);
        throw error;
    }
}

async function seedProducts() {
    try {
        console.log('🔧 Seeding products...');
        
        let createdCount = 0;
        for (const productData of sampleProductsData) {
            // Find brand
            const brand = await Brand.findOne({ name: productData.brandName });
            if (!brand) {
                console.log(`⚠️  Brand not found: ${productData.brandName}`);
                continue;
            }
            
            // Create compatible models with carModelId
            const compatibleModels = [];
            for (const compatibleModel of productData.compatibleModels) {
                const carModel = brand.carModels.find(model => 
                    model.name === compatibleModel.carModelName
                );
                
                if (carModel) {
                    compatibleModels.push({
                        carModelId: carModel._id,
                        carModelName: carModel.name,
                        years: compatibleModel.years
                    });
                }
            }
            
            // Create product
            const product = new Product({
                name: productData.name,
                code: productData.code,
                brand: brand._id,
                compatibleModels: compatibleModels,
                price: productData.price,
                description: productData.description,
                images: productData.images,
                stock: productData.stock,
                origin: productData.origin || '',
                material: productData.material || '',
                dimensions: productData.dimensions || '',
                warranty: productData.warranty || '',
                isActive: true
            });
            
            await product.save();
            createdCount++;
            console.log(`  ✅ Created: ${productData.name}`);
        }
        
        console.log(`✅ Created ${createdCount} products`);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        throw error;
    }
}

async function seedBlogs() {
    try {
        console.log('📝 Seeding blogs...');
        const createdBlogs = await Blog.insertMany(sampleBlogs);
        console.log(`✅ Created ${createdBlogs.length} blogs`);
        createdBlogs.forEach(blog => {
            console.log(`  ✅ Created: ${blog.title}`);
        });
    } catch (error) {
        console.error('❌ Error seeding blogs:', error);
        throw error;
    }
}

async function seedOrders() {
    try {
        console.log('📦 Seeding orders...');
        
        let createdCount = 0;
        for (const orderData of sampleOrders) {
            // Resolve product references by product code
            const orderItems = [];
            
            for (const item of orderData.items) {
                const product = await Product.findOne({ code: item.productCode });
                if (product) {
                    orderItems.push({
                        product: product._id,
                        quantity: item.quantity,
                        price: item.price
                    });
                } else {
                    console.log(`⚠️  Product not found with code: ${item.productCode}`);
                }
            }
            
            if (orderItems.length > 0) {
                // Generate unique order number manually to avoid pre-save hook issues
                const date = orderData.orderDate || new Date();
                const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
                const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                const orderNumber = `ORD-${dateString}-${random}`;
                
                const order = new Order({
                    orderNumber: orderNumber,
                    customer: orderData.customer,
                    items: orderItems,
                    status: orderData.status,
                    notes: orderData.notes,
                    orderDate: orderData.orderDate
                });
                
                await order.save();
                createdCount++;
                console.log(`  ✅ Created order: ${order.orderNumber} - ${orderData.customer.name}`);
            }
        }
        
        console.log(`✅ Created ${createdCount} orders`);
    } catch (error) {
        console.error('❌ Error seeding orders:', error);
        throw error;
    }
}

async function seedSettings() {
    try {
        console.log('⚙️  Seeding settings...');
        const settings = new Settings(defaultSettings);
        await settings.save();
        console.log('✅ Created default settings');
    } catch (error) {
        console.error('❌ Error seeding settings:', error);
        throw error;
    }
}

// Main seed function
async function seedAll() {
    try {
        console.log('🌱 Starting database seeding...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locgiogiasi');
        console.log('✓ Connected to MongoDB');
        
        // Clear existing data
        await clearAllData();
        
        // Seed in order (brands first, then products, then orders)
        await seedBrands();
        await seedProducts();
        await seedOrders();
        await seedBlogs();
        await seedSettings();
        
        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('✓ Database connection closed');
    }
}

// Individual seed functions for specific data types
async function seedBrandsOnly() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locgiogiasi');
        console.log('✓ Connected to MongoDB');
        await seedBrands();
        console.log('🎉 Brands seeding completed!');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('✓ Database connection closed');
    }
}

async function seedProductsOnly() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locgiogiasi');
        console.log('✓ Connected to MongoDB');
        await seedProducts();
        console.log('🎉 Products seeding completed!');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('✓ Database connection closed');
    }
}

async function seedBlogsOnly() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locgiogiasi');
        console.log('✓ Connected to MongoDB');
        
        // Clear existing blogs only
        await Blog.deleteMany({});
        console.log('🗑️  Cleared existing blogs');
        
        await seedBlogs();
        console.log('🎉 Blogs seeding completed!');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('✓ Database connection closed');
    }
}

async function seedOrdersOnly() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locgiogiasi');
        console.log('✓ Connected to MongoDB');
        await seedOrders();
        console.log('🎉 Orders seeding completed!');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('✓ Database connection closed');
    }
}

// Run seeding if this file is executed directly
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--brands')) {
        seedBrandsOnly();
    } else if (args.includes('--products')) {
        seedProductsOnly();
    } else if (args.includes('--blogs')) {
        seedBlogsOnly();
    } else if (args.includes('--orders')) {
        seedOrdersOnly();
    } else {
        seedAll();
    }
}

module.exports = {
    seedAll,
    clearAllData,
    seedBrands,
    seedProducts,
    seedBlogs,
    seedOrders,
    seedBlogsOnly,
    seedSettings,
    sampleBrands,
    sampleProductsData
};
