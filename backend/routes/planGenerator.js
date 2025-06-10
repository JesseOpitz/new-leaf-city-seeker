
const express = require('express');
const { 
  generateWelcomeAndIntroduction,
  generateChecklistAndTimeline,
  generateCostsAndResources,
  generateSeasonalGuide,
  generateChildrenAndPetsGuide
} = require('../services/openaiService');
const { generatePDF } = require('../services/pdfService');
const { sendEmailWithMultiplePDFs } = require('../services/emailService');
const { validatePlanRequest } = require('../utils/validation');
const { sanitizeFilename } = require('../utils/helpers');
const path = require('path');

const router = express.Router();

router.post('/generate-plan', async (req, res) => {
  try {
    console.log('📝 =========================');
    console.log('📝 NEW MULTI-PDF PLAN GENERATION REQUEST');
    console.log('📝 =========================');
    console.log('📝 Request body keys:', Object.keys(req.body));
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    // Validate input
    const { error, value } = validatePlanRequest(req.body);
    if (error) {
      console.log('❌ VALIDATION ERROR:', error.details[0].message);
      return res.status(400).json({ 
        error: 'Invalid input', 
        details: error.details[0].message 
      });
    }

    const { city, email, questionnaire } = value;
    
    console.log(`🏙️ Processing multi-PDF plan for: ${city}`);
    console.log(`📧 Email provided: ${email ? 'YES' : 'NO'} (${email || 'none'})`);
    console.log(`📋 Questionnaire data:`, JSON.stringify(questionnaire, null, 2));

    // Extract city and state for PDF generation
    const cityParts = city.split(',');
    const cityName = cityParts[0]?.trim() || city;
    const stateName = cityParts[1]?.trim() || '';
    
    const generatedPDFs = [];
    const errors = [];

    // Generate Welcome & Introduction PDF
    try {
      console.log('🤖 Generating Welcome & Introduction content...');
      const welcomeHTML = await generateWelcomeAndIntroduction(city, questionnaire);
      const welcomeFilename = sanitizeFilename(`${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-welcome-guide.pdf`);
      const welcomePDFPath = await generatePDF(welcomeHTML, welcomeFilename, cityName, stateName);
      generatedPDFs.push({
        path: welcomePDFPath,
        filename: welcomeFilename,
        title: 'Welcome & Introduction Guide'
      });
      console.log('✅ Welcome guide generated successfully');
    } catch (error) {
      console.error('❌ Error generating welcome guide:', error);
      errors.push(`Welcome Guide: ${error.message}`);
    }

    // Generate Checklist & Timeline PDF
    try {
      console.log('🤖 Generating Checklist & Timeline content...');
      const checklistHTML = await generateChecklistAndTimeline(city, questionnaire);
      const checklistFilename = sanitizeFilename(`${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-checklist-timeline.pdf`);
      const checklistPDFPath = await generatePDF(checklistHTML, checklistFilename, cityName, stateName);
      generatedPDFs.push({
        path: checklistPDFPath,
        filename: checklistFilename,
        title: 'Moving Checklist & Timeline'
      });
      console.log('✅ Checklist & timeline generated successfully');
    } catch (error) {
      console.error('❌ Error generating checklist:', error);
      errors.push(`Checklist & Timeline: ${error.message}`);
    }

    // Generate Costs & Resources PDF
    try {
      console.log('🤖 Generating Costs & Resources content...');
      const costsHTML = await generateCostsAndResources(city, questionnaire);
      const costsFilename = sanitizeFilename(`${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-costs-resources.pdf`);
      const costsPDFPath = await generatePDF(costsHTML, costsFilename, cityName, stateName);
      generatedPDFs.push({
        path: costsPDFPath,
        filename: costsFilename,
        title: 'Cost Breakdown & Local Resources'
      });
      console.log('✅ Costs & resources guide generated successfully');
    } catch (error) {
      console.error('❌ Error generating costs guide:', error);
      errors.push(`Costs & Resources: ${error.message}`);
    }

    // Generate Seasonal Guide PDF
    try {
      console.log('🤖 Generating Seasonal Guide content...');
      const seasonalHTML = await generateSeasonalGuide(city, questionnaire);
      const seasonalFilename = sanitizeFilename(`${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-seasonal-guide.pdf`);
      const seasonalPDFPath = await generatePDF(seasonalHTML, seasonalFilename, cityName, stateName);
      generatedPDFs.push({
        path: seasonalPDFPath,
        filename: seasonalFilename,
        title: 'Seasonal Living Guide'
      });
      console.log('✅ Seasonal guide generated successfully');
    } catch (error) {
      console.error('❌ Error generating seasonal guide:', error);
      errors.push(`Seasonal Guide: ${error.message}`);
    }

    // Generate Children & Pets Guide PDF (if applicable)
    if (questionnaire.hasChildren || questionnaire.hasPets) {
      try {
        console.log('🤖 Generating Children & Pets Guide content...');
        const familyHTML = await generateChildrenAndPetsGuide(city, questionnaire);
        if (familyHTML) {
          const familyFilename = sanitizeFilename(`${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-family-pets-guide.pdf`);
          const familyPDFPath = await generatePDF(familyHTML, familyFilename, cityName, stateName);
          generatedPDFs.push({
            path: familyPDFPath,
            filename: familyFilename,
            title: `${questionnaire.hasChildren && questionnaire.hasPets ? 'Family & Pets' : questionnaire.hasChildren ? 'Children & Family' : 'Pet Owner'} Guide`
          });
          console.log('✅ Children & pets guide generated successfully');
        }
      } catch (error) {
        console.error('❌ Error generating children & pets guide:', error);
        errors.push(`Children & Pets Guide: ${error.message}`);
      }
    }

    // Check if we have any PDFs to send
    if (generatedPDFs.length === 0) {
      console.error('❌ No PDFs were generated successfully');
      return res.status(500).json({
        error: 'Plan generation failed',
        message: 'No guides could be generated. Please try again.',
        details: errors
      });
    }

    console.log(`📄 Successfully generated ${generatedPDFs.length} PDFs:`, generatedPDFs.map(pdf => pdf.title));

    if (email) {
      console.log(`📧 Starting email send process to: ${email}`);
      // Send email with all PDF attachments
      await sendEmailWithMultiplePDFs(email, city, generatedPDFs);
      console.log(`✅ Email with ${generatedPDFs.length} PDFs sent successfully to: ${email}`);
      
      res.status(200).json({
        success: true,
        message: `Your comprehensive moving plan for ${city} (${generatedPDFs.length} guides) has been sent to ${email}`,
        city,
        generatedGuides: generatedPDFs.map(pdf => pdf.title),
        errors: errors.length > 0 ? errors : undefined
      });
    } else {
      // Return download links for all PDFs
      const downloadUrls = generatedPDFs.map(pdf => ({
        title: pdf.title,
        url: `/downloads/${pdf.filename}`,
        filename: pdf.filename
      }));
      
      console.log(`🔗 Download links created for ${generatedPDFs.length} PDFs`);
      
      res.status(200).json({
        success: true,
        message: `Your comprehensive moving plan for ${city} is ready for download (${generatedPDFs.length} guides)`,
        city,
        downloadUrls,
        errors: errors.length > 0 ? errors : undefined
      });
    }

    console.log('✅ =========================');
    console.log('✅ MULTI-PDF PLAN GENERATION COMPLETED');
    console.log('✅ =========================');

  } catch (error) {
    console.error('❌ =========================');
    console.error('❌ MULTI-PDF PLAN GENERATION ERROR');
    console.error('❌ =========================');
    console.error('❌ Error type:', error.constructor.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    if (error.message.includes('OpenAI')) {
      return res.status(503).json({ 
        error: 'AI service temporarily unavailable',
        message: 'Please try again in a few minutes'
      });
    }
    
    if (error.message.includes('email')) {
      return res.status(500).json({ 
        error: 'Email delivery failed',
        message: 'Plans were generated but could not be emailed. Please contact support.'
      });
    }
    
    if (error.message.includes('PDF')) {
      return res.status(500).json({ 
        error: 'PDF generation failed',
        message: 'Could not generate PDFs. Please try again.'
      });
    }
    
    res.status(500).json({ 
      error: 'Plan generation failed',
      message: 'Unable to generate your moving plans. Please try again.'
    });
  }
});

module.exports = router;
