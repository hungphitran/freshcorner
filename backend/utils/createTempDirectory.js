const fs = require('fs');
const path = require('path');

// Tạo thư mục temp để lưu file tạm thời trước khi upload lên Cloudinary
const createTempUploadDirectory = () => {
    const tempDir = path.join(__dirname, '../uploads/temp');
    
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
        console.log('✅ Thư mục temp upload đã được tạo');
    }
};

module.exports = {
    createTempUploadDirectory
};
