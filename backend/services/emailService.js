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

// Keep existing single PDF function for backward compatibility
const sendEmail = async (recipientEmail, city, pdfPath) => {
  try {
    console.log('📧 =========================');
    console.log('📧 EMAIL SERVICE START (SINGLE PDF)');
    console.log('📧 =========================');
    console.log('📧 Recipient:', recipientEmail);
    console.log('📧 City:', city);
    console.log('📧 PDF path:', pdfPath);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email credentials missing!');
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
    
    return result;

  } catch (error) {
    console.error('❌ Email service error:', error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

const sendEmailWithMultiplePDFs = async (recipientEmail, city, pdfArray) => {
  try {
    console.log('📧 =========================');
    console.log('📧 EMAIL SERVICE START (MULTIPLE PDFs)');
    console.log('📧 =========================');
    console.log('📧 Recipient:', recipientEmail);
    console.log('📧 City:', city);
    console.log('📧 PDF count:', pdfArray.length);
    console.log('📧 PDFs:', pdfArray.map(pdf => pdf.title));
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email credentials missing!');
      throw new Error('Email credentials not configured');
    }

    const transporter = createTransporter();
    
    // Verify transporter configuration
    console.log('📧 Verifying email transporter...');
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');

    // Prepare attachments
    const attachments = pdfArray.map(pdf => ({
      filename: path.basename(pdf.path),
      path: pdf.path,
      contentType: 'application/pdf'
    }));

    // Generate list of guides for email content
    const guidesList = pdfArray.map(pdf => `<li>${pdf.title}</li>`).join('');

    const mailOptions = {
      from: `"New Leaf" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Your Complete Moving Plan Package for ${city} Is Ready!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2c5530 0%, #7fb069 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Your Complete Moving Plan Package is Ready!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Hello!</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              We're excited to help you with your move to <strong>${city}</strong>! Attached is your comprehensive, 
              personalized moving plan package with ${pdfArray.length} detailed guides covering every aspect of your relocation.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7fb069;">
              <h3 style="color: #2c5530; margin: 0 0 15px 0;">Your complete package includes:</h3>
              <ul style="color: #333; line-height: 1.8; margin: 0; padding-left: 20px;">
                ${guidesList}
              </ul>
            </div>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #2c5530; font-weight: bold; margin: 0 0 10px 0; font-size: 16px;">📋 How to Use Your Guides:</p>
              <ul style="color: #2c5530; line-height: 1.6; margin: 0; padding-left: 20px; font-size: 14px;">
                <li>Start with the Welcome & Introduction Guide for city overview</li>
                <li>Use the Checklist & Timeline for step-by-step planning</li>
                <li>Reference Costs & Resources for budgeting and local contacts</li>
                <li>Check the Seasonal Guide for weather and lifestyle preparation</li>
                ${pdfArray.some(pdf => pdf.title.includes('Family') || pdf.title.includes('Pet')) ? '<li>Follow the Family/Pet Guide for specialized moving tips</li>' : ''}
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Each guide is designed to work together as a complete system for your successful relocation. 
              If you have any questions or need help with any aspect of your move, please don't hesitate to reach out.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Best of luck with your move to ${city}!<br>
              <strong>The New Leaf Team</strong>
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px;">
                Visit us at <a href="https://new-leaf.net" style="color: #2c5530;">new-leaf.net</a> • 
                <a href="mailto:${process.env.EMAIL_USER}" style="color: #2c5530;">Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      `,
      attachments: attachments
    };

    console.log('📧 Mail options configured:');
    console.log('📧 - From:', mailOptions.from);
    console.log('📧 - To:', mailOptions.to);
    console.log('📧 - Subject:', mailOptions.subject);
    console.log('📧 - Attachment count:', attachments.length);
    console.log('📧 - Attachment filenames:', attachments.map(att => att.filename));

    console.log('📧 Sending email with multiple PDFs...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email with multiple PDFs sent successfully!');
    console.log('✅ Message ID:', result.messageId);
    console.log('✅ Response:', result.response);
    console.log('📧 =========================');
    console.log('📧 EMAIL SERVICE END (MULTIPLE PDFs)');
    console.log('📧 =========================');
    
    return result;

  } catch (error) {
    console.error('❌ =========================');
    console.error('❌ EMAIL SERVICE ERROR (MULTIPLE PDFs)');
    console.error('❌ =========================');
    console.error('❌ Error type:', error.constructor.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error response:', error.response);
    console.error('❌ Full error:', error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

module.exports = { sendEmail, sendEmailWithMultiplePDFs };
