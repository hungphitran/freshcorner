const Admin = require('../models/admin.model');

const createDefaultAdmin = async () => {
  try {
    // Check if any admin exists
    const existingAdmin = await Admin.findOne();
    
    if (!existingAdmin) {
      // Create default admin
      const defaultAdmin = new Admin({
        username: 'admin',
        email: 'admin@freshcorner.vn',
        password: '123456' // Will be hashed by the model
      });
      
      await defaultAdmin.save();
      console.log('Default admin created:');
      console.log('Username: admin');
      console.log('Password: 123456');
      console.log('Please change the default password after first login!');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

module.exports = { createDefaultAdmin };
