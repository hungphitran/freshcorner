const Settings = require('../models/settings.model');
const { validationResult } = require('express-validator');

// Lấy thông tin cài đặt
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        if (!settings) {
            // Tạo cài đặt mặc định nếu chưa có
            settings = new Settings({
                storeName: 'Fresh Corner',
                address: 'TP. Hồ Chí Minh',
                phone: '0345 8888 04',
                email: 'hello@freshcorner.vn'
            });
            await settings.save();
        }
        
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin cài đặt',
            error: error.message
        });
    }
};

// Cập nhật thông tin cài đặt
const updateSettings = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array()
            });
        }
        
        const { storeName, address, phone, email, logo } = req.body;
        
        let settings = await Settings.findOne();
        
        if (!settings) {
            // Tạo mới nếu chưa có
            settings = new Settings({
                storeName,
                address,
                phone,
                email,
                logo
            });
        } else {
            // Cập nhật
            settings.storeName = storeName;
            settings.address = address;
            settings.phone = phone;
            settings.email = email;
            if (logo) settings.logo = logo;
        }
        
        await settings.save();
        
        res.json({
            success: true,
            message: 'Cập nhật thông tin cài đặt thành công',
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật thông tin cài đặt',
            error: error.message
        });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
