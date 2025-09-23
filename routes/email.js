const nodemailer = require('nodemailer');

// Create transporter (using Gmail as example - replace with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Send order confirmation email
async function sendOrderConfirmation(orderData) {
  try {
    const { customer_email, customer_name, company, amount, paymentIntentId } = orderData;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@digiclickai.com',
      to: customer_email,
      subject: 'Order Confirmation - Digiclick AI Enterprise Plan',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ffd700, #ffed4e); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #000; margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
          </div>

          <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-bottom: 20px;">Order Details</h2>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p><strong>Customer:</strong> ${customer_name}</p>
              <p><strong>Company:</strong> ${company || 'N/A'}</p>
              <p><strong>Plan:</strong> Enterprise Plan</p>
              <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
              <p><strong>Order ID:</strong> ${paymentIntentId}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <h3 style="color: #2c3e50; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #7f8c8d; line-height: 1.6;">
              <li>✓ Project kickoff call within 24 hours</li>
              <li>✓ Dedicated account manager assigned</li>
              <li>✓ Project timeline and milestones shared</li>
              <li>✓ Development begins immediately</li>
              <li>✓ 6 months of support included</li>
            </ul>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; color: #856404;"><strong>Important:</strong> Please save this email for your records. Your account manager will contact you shortly to begin the project.</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #7f8c8d; margin-bottom: 10px;">Questions? Contact our support team:</p>
              <p style="margin: 0;"><a href="mailto:support@digiclickai.com" style="color: #ffd700; text-decoration: none;">support@digiclickai.com</a></p>
              <p style="margin: 0;"><a href="tel:703-447-3265" style="color: #ffd700; text-decoration: none;">703-447-3265</a></p>
            </div>
          </div>

          <div style="text-align: center; padding: 20px; color: #7f8c8d; font-size: 12px;">
            <p>Digiclick AI - Creating. Managing. Automating. Growing.</p>
            <p>© 2025 Digiclick AI. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
}

// Send admin notification
async function sendAdminNotification(orderData) {
  try {
    const { customer_email, customer_name, company, amount, paymentIntentId, project_details } = orderData;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@digiclickai.com',
      to: process.env.ADMIN_EMAIL || 'admin@digiclickai.com',
      subject: 'New Order Received - Enterprise Plan',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">New Order Alert!</h1>
          </div>

          <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50;">Enterprise Plan Purchase</h2>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Customer Information:</h3>
              <p><strong>Name:</strong> ${customer_name}</p>
              <p><strong>Email:</strong> ${customer_email}</p>
              <p><strong>Company:</strong> ${company || 'N/A'}</p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Details:</h3>
              <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
              <p><strong>Payment ID:</strong> ${paymentIntentId}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>

            ${project_details ? `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Project Requirements:</h3>
              <p>${project_details}</p>
            </div>
            ` : ''}

            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; color: #155724;"><strong>Action Required:</strong> Contact the customer within 24 hours to schedule the project kickoff call.</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOrderConfirmation,
  sendAdminNotification
};
