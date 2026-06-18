const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục nếu chưa tồn tại
const createDirectoryIfNotExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Cấu hình storage cho multer (tạm thời lưu file để upload lên Cloudinary)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/temp');
        createDirectoryIfNotExists(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Tạo tên file unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// Kiểm tra file type
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép upload file ảnh (JPEG, JPG, PNG, GIF, WEBP)'), false);
    }
};

// Cấu hình multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 10 // Tối đa 10 file
    },
    fileFilter: fileFilter
});

// Middleware upload single file
const uploadSingle = upload.single('image');

// Middleware upload multiple files
const uploadMultiple = upload.array('images', 10);

// Middleware xử lý lỗi upload
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File quá lớn. Kích thước tối đa là 5MB'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Quá nhiều file. Tối đa 10 file'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Trường file không hợp lệ'
            });
        }
    }
    
    if (error.message) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    next(error);
};

// Middleware cleanup temp files
const cleanupTempFiles = (req, res, next) => {
    const originalEnd = res.end;
    
    res.end = function(chunk, encoding) {
        res.end = originalEnd;
        res.end(chunk, encoding);
        
        // Cleanup temp files
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
            });
        }
        
        if (req.files) {
            req.files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error('Error deleting temp file:', err);
                });
            });
        }
    };
    
    next();
};

module.exports = {
    upload,
    uploadSingle,
    uploadMultiple,
    handleUploadError,
    cleanupTempFiles
};
