
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
    console.log('📝 Received plan generation request');
    
    // Validate input
    const { error, value } = validatePlanRequest(req.body);
    if (error) {
      console.log('❌ Validation error:', error.details[0].message);
      return res.status(400).json({ 
        error: 'Invalid input', 
        details: error.details[0].message 
      });
    }

    const { city, email, questionnaire } = value;
    
    console.log(`🏙️ Generating plan for: ${city}`);
    console.log(`📧 Email provided: ${!!email}`);

    // Generate moving plan using OpenAI
    const planHTML = await generateMovingPlan(city, questionnaire);
    
    // Generate PDF
    const filename = sanitizeFilename(`moving-plan-${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`);
    const pdfPath = await generatePDF(planHTML, filename);
    
    console.log(`📄 PDF generated: ${filename}`);

    if (email) {
      // Send email with PDF attachment
      await sendEmail(email, city, pdfPath);
      console.log(`✅ Email sent to: ${email}`);
      
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

  } catch (error) {
    console.error('❌ Error generating plan:', error);
    
    if (error.message.includes('OpenAI')) {
      return res.status(503).json({ 
        error: 'AI service temporarily unavailable',
        message: 'Please try again in a few minutes'
      });
    }
    
    if (error.message.includes('email')) {
      return res.status(500).json({ 
        error: 'Email delivery failed',
        message: 'Plan was generated but could not be emailed. Please contact support.'
      });
    }
    
    res.status(500).json({ 
      error: 'Plan generation failed',
      message: 'Unable to generate your moving plan. Please try again.'
    });
  }
});

module.exports = router;
