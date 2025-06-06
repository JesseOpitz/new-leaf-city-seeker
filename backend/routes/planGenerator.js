
const express = require('express');
const { generateMovingPlan } = require('../services/openaiService');
const { generatePDF } = require('../services/pdfService');
const { sendEmail } = require('../services/emailService');
const { validatePlanRequest } = require('../utils/validation');
const { sanitizeFilename } = require('../utils/helpers');
const path = require('path');

const router = express.Router();

router.post('/generate-plan', async (req, res) => {
  try {
    console.log('📝 =========================');
    console.log('📝 NEW PLAN GENERATION REQUEST');
    console.log('📝 =========================');
    console.log('📝 Request body keys:', Object.keys(req.body));
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    // Validate input
    const { error, value } = validatePlanRequest(req.body);
    if (error) {
      console.log('❌ VALIDATION ERROR:', error.details[0].message);
      console.log('❌ Full validation error:', error);
      return res.status(400).json({ 
        error: 'Invalid input', 
        details: error.details[0].message 
      });
    }

    const { city, email, questionnaire } = value;
    
    console.log(`🏙️ Processing plan for: ${city}`);
    console.log(`📧 Email provided: ${email ? 'YES' : 'NO'} (${email || 'none'})`);
    console.log(`📋 Questionnaire data:`, JSON.stringify(questionnaire, null, 2));

    // Generate moving plan using OpenAI
    console.log('🤖 Starting OpenAI plan generation...');
    const planHTML = await generateMovingPlan(city, questionnaire);
    console.log(`✅ OpenAI plan generated successfully (length: ${planHTML.length} chars)`);
    
    // Generate PDF
    console.log('📄 Starting PDF generation...');
    const filename = sanitizeFilename(`moving-plan-${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`);
    console.log(`📄 PDF filename will be: ${filename}`);
    
    const pdfPath = await generatePDF(planHTML, filename);
    console.log(`📄 PDF generated successfully at: ${pdfPath}`);

    if (email) {
      console.log(`📧 Starting email send process to: ${email}`);
      // Send email with PDF attachment
      await sendEmail(email, city, pdfPath);
      console.log(`✅ Email sent successfully to: ${email}`);
      
      res.status(200).json({
        success: true,
        message: `Your personalized moving plan for ${city} has been sent to ${email}`,
        city
      });
    } else {
      // Return download link
      const downloadUrl = `/downloads/${filename}`;
      console.log(`🔗 Download link created: ${downloadUrl}`);
      
      res.status(200).json({
        success: true,
        message: `Your personalized moving plan for ${city} is ready for download`,
        downloadUrl,
        city,
        filename
      });
    }

    console.log('✅ =========================');
    console.log('✅ PLAN GENERATION COMPLETED');
    console.log('✅ =========================');

  } catch (error) {
    console.error('❌ =========================');
    console.error('❌ PLAN GENERATION ERROR');
    console.error('❌ =========================');
    console.error('❌ Error type:', error.constructor.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    if (error.message.includes('OpenAI')) {
      console.error('❌ OpenAI-related error detected');
      return res.status(503).json({ 
        error: 'AI service temporarily unavailable',
        message: 'Please try again in a few minutes'
      });
    }
    
    if (error.message.includes('email')) {
      console.error('❌ Email-related error detected');
      return res.status(500).json({ 
        error: 'Email delivery failed',
        message: 'Plan was generated but could not be emailed. Please contact support.'
      });
    }
    
    if (error.message.includes('PDF')) {
      console.error('❌ PDF-related error detected');
      return res.status(500).json({ 
        error: 'PDF generation failed',
        message: 'Could not generate PDF. Please try again.'
      });
    }
    
    res.status(500).json({ 
      error: 'Plan generation failed',
      message: 'Unable to generate your moving plan. Please try again.'
    });
  }
});

module.exports = router;
