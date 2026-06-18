// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const createUploadsDirectory = () => {
  const dirs = ['products', 'blogs', 'avatars'];
  
  dirs.forEach(dir => {
    const dirPath = path.join(uploadsDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

module.exports = { createUploadsDirectory };
