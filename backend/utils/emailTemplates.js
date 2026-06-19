
const BRAND_NAME = process.env.BRAND_NAME;
const BRAND_PHONE = process.env.BRAND_PHONE;
const BRAND_ADDRESS = process.env.BRAND_ADDRESS;
const BRAND_WEBSITE = process.env.BRAND_WEBSITE;
const BRAND_LOGO = process.env.BRAND_LOGO;

/**
 * Basic style wrapper for all emails with modern green theme
 */
function wrapEmail(content, logoUrl) {
  return `
    <div style="font-family: 'Lexend Deca', sans-serif; min-height: 100vh;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
        <!-- Header with Logo -->
        <tr>
          <td style="padding: 0px 32px; text-align: center; position: relative; gap: 16px;">
            <img src="${logoUrl || BRAND_LOGO}" alt="${BRAND_NAME}" style="max-height: 100px; height: auto; width: auto; display: block; margin: 0 auto;" />
            <h1 style="text-align: center; margin: 0; font-size: 24px; font-weight: 700; color: #000; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">${BRAND_NAME}</h1>
            <div style="text-align: center; margin: 12px 0 0; padding: 8px 16px; background: rgba(255, 255, 255, 0.15); border-radius: 20px; display: inline-block;">
              <p style="text-align: center; margin: 0; font-size: 14px; color: #000; font-weight: 500; text-style: italic;">
                📞 ${BRAND_PHONE} &nbsp;•&nbsp; 📍 ${BRAND_ADDRESS}
              </p>
            </div>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 0px 32px; color: #1f2937; font-size: 15px; line-height: 1.6;">
            ${content}
            
            <!-- Footer -->
            <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #f3f4f6;">
              <div style="text-align: center; margin-bottom: 16px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); padding: 12px 24px; border-radius: 25px;">
                  <a href="${BRAND_WEBSITE}" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">
                    🌐 Truy cập website
                  </a>
                </div>
              </div>
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center; line-height: 1.5;">
                © ${new Date().getFullYear()} <strong>${BRAND_NAME}</strong>. Tất cả quyền được bảo lưu.<br/>
                <span style="color: #059669;">✉️ Email này được gửi tự động, vui lòng không trả lời trực tiếp.</span>
              </p>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `;
}

/**
 * Enhanced info card component
 */
function createInfoCard(title, content) {
  return `
    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 20px 0;">
      <h3 style="margin: 0 0 16px; color: #059669; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
        ${title}
      </h3>
      <div style="color: #374151;">
        ${content}
      </div>
    </div>
  `;
}

function contactCustomerTemplate(contact, logoUrl) {
  const contactInfo = `
    <p>Họ tên: ${contact.name}</p>
    ${contact.email ? `<p>Email: <a href="mailto:${contact.email}" style="color: #059669; text-decoration: none;">${contact.email}</a></p>` : ''}
    <p>Số điện thoại: <a href="tel:${contact.phone}" style="color: #059669; text-decoration: none;">${contact.phone}</a></p>
    ${contact.subject ? `<p>Chủ đề: ${contact.subject}</p>` : ''}
    ${contact.message ? `<p>Nội dung: <br/><em style="color: #6b7280;">"${contact.message}"</em></p>` : ''}
  `;

  const body = `
    <p style="font-size: 16px; margin-bottom: 24px;">
      Xin chào <strong style="color: #059669;">${contact.name}</strong>,
    </p>
    
    <p style="margin-bottom: 24px;">
      Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất có thể.
    </p>
    
    ${createInfoCard('Thông tin liên hệ của bạn', contactInfo)}
    
    <div style="background: #fffbeb; border: 2px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; color: #92400e; font-weight: 600;">
        Lưu ý: Nếu có thắc mắc gấp, bạn có thể gọi trực tiếp hotline: 
        <a href="tel:${BRAND_PHONE}" style="color: #059669; text-decoration: none; font-weight: bold;">${BRAND_PHONE}</a>
      </p>
    </div>
    
    <p style="margin-top: 32px; text-align: center;">
      <strong style="color: #059669;">Trân trọng,</strong><br/>
      <strong style="font-size: 16px;">${BRAND_NAME}</strong>
    </p>
  `;
  return wrapEmail(body, logoUrl);
}

function contactAdminTemplate(contact, logoUrl) {
  const contactInfo = `
    <p>Họ tên: ${contact.name}</p>
    ${contact.email ? `<p>Email: <a href="mailto:${contact.email}" style="color: #059669; text-decoration: none;">${contact.email}</a></p>` : '<p>Email: <span style="color: #ef4444;">Không cung cấp</span></p>'}
    <p>Số điện thoại: <a href="tel:${contact.phone}" style="color: #059669; text-decoration: none;">${contact.phone}</a></p>
    ${contact.subject ? `<p>Chủ đề: ${contact.subject}</p>` : ''}
    ${contact.message ? `<p>Nội dung: <br/><div style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #059669; margin-top: 8px;"><em>"${contact.message}"</em></div></p>` : ''}
    <p>Thời gian gửi: ${new Date(contact.createdAt).toLocaleString('vi-VN')}</p>
  `;

  const body = `
    <p style="font-size: 16px; margin-bottom: 24px;">
      Bạn vừa nhận được một tin nhắn liên hệ mới từ khách hàng.
    </p>
    
    ${createInfoCard('Thông tin khách hàng', contactInfo)}
    
    <div style="text-align: center; margin-top: 32px;">
      <a href="tel:${contact.phone}" style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: 600; margin-right: 12px;">
        📞 Gọi ngay
      </a>
      ${contact.email ? `<a href="mailto:${contact.email}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: 600;">📧 Trả lời email</a>` : ''}
    </div>
  `;
  return wrapEmail(body, logoUrl);
}

function orderItemsTable(order) {
  return `
    <div style="background: #ffffff; border-radius: 12px; overflow: hidden; border: 2px solid #e5e7eb; margin: 20px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr style="background: linear-gradient(135deg, #059669, #10b981); color: white;">
            <th style="padding: 16px 12px; text-align: left; font-weight: 600; font-size: 14px;">Sản phẩm</th>
            <th style="padding: 16px 12px; text-align: left; font-weight: 600; font-size: 14px;">Mã</th>
            <th style="padding: 16px 12px; text-align: center; font-weight: 600; font-size: 14px;">SL</th>
            <th style="padding: 16px 12px; text-align: right; font-weight: 600; font-size: 14px;">Đơn giá</th>
            <th style="padding: 16px 12px; text-align: right; font-weight: 600; font-size: 14px;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((item, index) => `
            <tr style="border-bottom: 1px solid #f3f4f6; ${index % 2 === 0 ? 'background-color: #f9fafb;' : 'background-color: #ffffff;'}">
              <td style="padding: 16px 12px; font-weight: 600; color: #374151;">${item.product.name}</td>
              <td style="padding: 16px 12px; color: #6b7280; font-family: monospace;">${item.product.code || 'N/A'}</td>
              <td style="padding: 16px 12px; text-align: center; font-weight: 600; color: #059669;">${item.quantity}</td>
              <td style="padding: 16px 12px; text-align: right; color: #374151;">${item.price.toLocaleString('vi-VN')}₫</td>
              <td style="padding: 16px 12px; text-align: right; font-weight: 600; color: #059669;">${(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border-top: 2px solid #059669;">
            <td colspan="4" style="padding: 20px 12px; text-align: right; font-weight: 700; font-size: 16px; color: #374151;">
              Tổng cộng:
            </td>
            <td style="padding: 20px 12px; text-align: right; font-weight: 700; font-size: 18px; color: #059669;">
              ${order.totalAmount.toLocaleString('vi-VN')}₫
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

function orderCustomerTemplate(order, logoUrl) {
  const customerInfo = `
    <p>Họ tên: ${order.customer.name}</p>
    ${order.customer.email ? `<p>Email: <a href="mailto:${order.customer.email}" style="color: #059669; text-decoration: none;">${order.customer.email}</a></p>` : ''}
    <p>Số điện thoại: <a href="tel:${order.customer.phone}" style="color: #059669; text-decoration: none;">${order.customer.phone}</a></p>
    ${order.customer.address || order.customer.city ? `<p>Địa chỉ: ${[order.customer.address, order.customer.city].filter(Boolean).join(', ')}</p>` : ''}
  `;

  const body = `
    <p style="font-size: 16px; margin-bottom: 24px;">
      Đơn hàng của bạn đã được tiếp nhận thành công. Chúng tôi sẽ liên hệ trong thời gian sớm nhất để tư vấn và báo giá chi tiết.
    </p>
    
    ${createInfoCard('Thông tin khách hàng', customerInfo)}
    
    <h3 style="color: #059669; font-size: 20px; font-weight: 700; margin: 32px 0 16px; display: flex; align-items: center;">
      Chi tiết đơn hàng
    </h3>
    
    ${orderItemsTable(order)}
    
    ${order.notes ? `
      <div style="background: #fffbeb; border: 2px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h4 style="margin: 0 0 12px; color: #92400e; font-weight: 600;">Ghi chú của bạn:</h4>
        <p style="margin: 0; color: #92400e; font-style: italic;">"${order.notes || 'Không có ghi chú'}"</p>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin: 32px 0; display: flex; gap:16px">
      <p style="font-size: 16px; margin-bottom: 16px; color: #374151; font-weight: 600;">
        Cần hỗ trợ? Liên hệ hotline:
      </p>
      <a href="tel:${BRAND_PHONE}" style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 16px 32px; border-radius: 25px; text-decoration: none; font-weight: 700; font-size: 18px;">
        ${BRAND_PHONE}
      </a>
    </div>
    
    <p style="margin-top: 32px; text-align: center;">
      <strong style="color: #059669;">Trân trọng,</strong><br/>
      <strong style="font-size: 16px;">${BRAND_NAME}</strong>
    </p>
  `;
  return wrapEmail(body, logoUrl);
}

function orderAdminTemplate(order, logoUrl) {
  const customerInfo = `
    <p>Họ tên: ${order.customer.name}</p>
    ${order.customer.email ? `<p>Email: <a href="mailto:${order.customer.email}" style="color: #059669; text-decoration: none;">${order.customer.email}</a></p>` : '<p>Email: <span style="color: #ef4444;">Không cung cấp</span></p>'}
    <p>Số điện thoại: <a href="tel:${order.customer.phone}" style="color: #059669; text-decoration: none;">${order.customer.phone}</a></p>
    ${order.customer.address || order.customer.city ? `<p>Địa chỉ: ${[order.customer.address, order.customer.city].filter(Boolean).join(', ')}</p>` : '<p>Địa chỉ: <span style="color: #ef4444;">Không cung cấp</span></p>'}
    <p>Thời gian đặt: ${new Date(order.orderDate).toLocaleString('vi-VN')}</p>
  `;

  const body = `
    <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; color: #dc2626; font-weight: 600; text-align: center;">
        ⚡ <strong>Ưu tiên xử lý:</strong> Khách hàng đang chờ báo giá
      </p>
    </div>
    
    ${createInfoCard('Thông tin khách hàng', customerInfo)}
    
    <h3 style="color: #059669; font-size: 20px; font-weight: 700; margin: 32px 0 16px; display: flex; align-items: center;">
      Chi tiết đơn hàng
    </h3>
    
    ${orderItemsTable(order)}
    
    ${order.notes ? `
      <div style="background: #fffbeb; border: 2px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h4 style="margin: 0 0 12px; color: #92400e; font-weight: 600;">Ghi chú của khách:</h4>
        <p style="margin: 0; color: #92400e; font-style: italic;">"${order.notes || 'Không có ghi chú'}"</p>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin-top: 32px;">
      <a href="tel:${order.customer.phone}" style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: 600; margin-right: 12px;">
        📞 Gọi khách hàng
      </a>
      ${order.customer.email ? `<a href="mailto:${order.customer.email}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: 600;">📧 Gửi email</a>` : ''}
    </div>
  `;
  return wrapEmail(body, logoUrl);
}

module.exports = {
  contactCustomerTemplate,
  contactAdminTemplate,
  orderCustomerTemplate,
  orderAdminTemplate,
};