const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Hàm upload ảnh lên Cloudinary
const uploadToCloudinary = async (file, folder = 'products') => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: `freshcorner/${folder}`,
            transformation: [
                { width: 800, height: 600, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });
        
        return {
            public_id: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height
        };
    } catch (error) {
        console.error('Lỗi upload ảnh lên Cloudinary:', error);
        throw new Error('Không thể upload ảnh lên Cloudinary');
    }
};

// Hàm xóa ảnh khỏi Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Lỗi xóa ảnh khỏi Cloudinary:', error);
        throw new Error('Không thể xóa ảnh khỏi Cloudinary');
    }
};

// Hàm upload nhiều ảnh
const uploadMultipleToCloudinary = async (files, folder = 'products') => {
    try {
        const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error('Lỗi upload nhiều ảnh:', error);
        throw new Error('Không thể upload nhiều ảnh');
    }
};

module.exports = {
    cloudinary,
    uploadToCloudinary,
    deleteFromCloudinary,
    uploadMultipleToCloudinary
};
