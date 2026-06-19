const { validationResult } = require('express-validator');
const { contactCustomerTemplate, contactAdminTemplate } = require('../utils/emailTemplates');
const { transporter } = require('../config/email');

// Helper function to validate email
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const BRAND_NAME = process.env.BRAND_NAME || "Fresh Corner";
// Create contact message (only send emails, no database storage)
const createContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const contactData = {
      ...req.body,
      createdAt: new Date()
    };

    // Send email notifications
    try {
      await sendContactNotification(contactData);
      
      res.status(200).json({
        success: true,
        message: 'Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.',
        data: {
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          sentAt: contactData.createdAt
        }
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.',
        error: 'Email service unavailable'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending contact message',
      error: error.message
    });
  }
};

// Send contact notification emails
const sendContactNotification = async (contact) => {
  let logoUrl = process.env.BRAND_LOGO;
  try {
    const Settings = require('../models/settings.model');
    const settings = await Settings.findOne();
    if (settings && settings.logo && settings.logo.startsWith('http')) {
      logoUrl = settings.logo;
    }
  } catch (err) {
    console.error("Failed to load logo from settings:", err);
  }

  // Customer confirmation email
  const customerEmail = {
    from: process.env.EMAIL_USER,
    to: contact.email,
    subject: `${BRAND_NAME} | Xác nhận liên hệ`,
    html: contactCustomerTemplate(contact, logoUrl)
  };

  // Admin notification email
  const adminEmail = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `${BRAND_NAME} | Tin nhắn liên hệ mới từ ${contact.name}`,
    html: contactAdminTemplate(contact, logoUrl)
  };

  // Send emails - always send admin email, only send customer email if email is valid
  const emailPromises = [transporter.sendMail(adminEmail)];
  
  // Only send customer email if email is valid
  if (isValidEmail(contact.email)) {
    emailPromises.push(transporter.sendMail(customerEmail));
  } else {
    console.log('Skipping customer email - invalid or missing email:', contact.email);
  }
  
  await Promise.all(emailPromises);
};

module.exports = {
  createContact
};
