
const nodemailer = require('nodemailer');
const path = require('path');

const createTransporter = () => {
  console.log('📧 Creating email transporter...');
  console.log('📧 Email user present:', !!process.env.EMAIL_USER);
  console.log('📧 Email pass present:', !!process.env.EMAIL_PASS);
  console.log('📧 Email user value:', process.env.EMAIL_USER);
  
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    secure: true
  });
};

const sendEmail = async (recipientEmail, city, pdfPath) => {
  try {
    console.log('📧 =========================');
    console.log('📧 EMAIL SERVICE START');
    console.log('📧 =========================');
    console.log('📧 Recipient:', recipientEmail);
    console.log('📧 City:', city);
    console.log('📧 PDF path:', pdfPath);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email credentials missing!');
      console.error('❌ EMAIL_USER:', !!process.env.EMAIL_USER);
      console.error('❌ EMAIL_PASS:', !!process.env.EMAIL_PASS);
      throw new Error('Email credentials not configured');
    }

    const transporter = createTransporter();
    
    // Verify transporter configuration
    console.log('📧 Verifying email transporter...');
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');

    const mailOptions = {
      from: `"New Leaf" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Your Personalized Moving Plan for ${city} Is Ready!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2c5530 0%, #7fb069 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Your Moving Plan is Ready!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Hello!</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              We're excited to help you with your move to <strong>${city}</strong>! Attached is your detailed, 
              personalized moving plan that includes everything you need to know for a successful relocation.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7fb069;">
              <h3 style="color: #2c5530; margin: 0 0 10px 0;">Your plan includes:</h3>
              <ul style="color: #333; line-height: 1.8;">
                <li>Personalized overview and city insights</li>
                <li>Comprehensive moving checklist</li>
                <li>Detailed cost breakdown</li>
                <li>30-60-90 day action timeline</li>
                <li>Local resources and contacts</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              If you have any questions or need help with revisions, please don't hesitate to reach out. 
              We're here to make your move as smooth as possible!
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Best of luck with your move!<br>
              <strong>The New Leaf Team</strong>
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px;">
                Visit us at <a href="https://new-leaf.net" style="color: #2c5530;">new-leaf.net</a>
              </p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: path.basename(pdfPath),
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    };

    console.log('📧 Mail options configured:');
    console.log('📧 - From:', mailOptions.from);
    console.log('📧 - To:', mailOptions.to);
    console.log('📧 - Subject:', mailOptions.subject);
    console.log('📧 - Attachment path:', pdfPath);
    console.log('📧 - Attachment filename:', path.basename(pdfPath));

    console.log('📧 Sending email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('✅ Message ID:', result.messageId);
    console.log('✅ Response:', result.response);
    console.log('📧 =========================');
    console.log('📧 EMAIL SERVICE END');
    console.log('📧 =========================');
    
    return result;

  } catch (error) {
    console.error('❌ =========================');
    console.error('❌ EMAIL SERVICE ERROR');
    console.error('❌ =========================');
    console.error('❌ Error type:', error.constructor.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error response:', error.response);
    console.error('❌ Full error:', error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

module.exports = { sendEmail };
