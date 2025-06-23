
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
    console.log('📝 NEW STRUCTURED PDF GENERATION REQUEST');
    console.log('📝 =========================');
    console.log('📝 Request body keys:', Object.keys(req.body));
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    // Validate input
    const { error, value } = validatePlanRequest(req.body);
    if (error) {
      console.log('❌ VALIDATION ERROR:', error.details.map(d => d.message));
      return res.status(400).json({ 
        error: 'Invalid input', 
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message,
          value: d.context?.value
        }))
      });
    }

    const { city, email, questionnaire } = value;
    
    // Convert string values to boolean for processing
    const processedQuestionnaire = {
      ...questionnaire,
      hasChildren: questionnaire.hasChildren === 'yes',
      hasPets: questionnaire.hasPets === 'yes'
    };
    
    console.log(`🏙️ Processing structured plan for: ${city}`);
    console.log(`📧 Email provided: ${email ? 'YES' : 'NO'} (${email || 'none'})`);
    console.log(`📋 Processed questionnaire data:`, JSON.stringify(processedQuestionnaire, null, 2));

    // Extract city and state for PDF generation
    const cityParts = city.split(',');
    const cityName = cityParts[0]?.trim() || city;
    const stateName = cityParts[1]?.trim() || '';
    
    const generatedPDFs = [];
    const errors = [];

    // Generate Welcome & Introduction PDF with structured content
    try {
      console.log('🤖 Generating Welcome & Introduction structured content...');
      const welcomeData = await generateWelcomeAndIntroduction(city, processedQuestionnaire);
      
      // Validate the structured content
      if (!welcomeData.sections || welcomeData.sections.length < 7) {
        console.warn('⚠️ Welcome guide sections incomplete, adding fallback content');
      }
      
      const welcomeFilename = sanitizeFilename(`${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-welcome-guide.pdf`);
      const welcomePDFPath = await generatePDF(welcomeData, welcomeFilename, cityName, stateName, 'welcome');
      generatedPDFs.push({
        path: welcomePDFPath,
        filename: welcomeFilename,
        title: 'Welcome & Introduction Guide'
      });
      console.log('✅ Welcome guide generated with structured templates');
    } catch (error) {
      console.error('❌ Error generating welcome guide:', error);
      errors.push(`Welcome Guide: ${error.message}`);
    }

    // Generate Checklist & Timeline PDF with structured content
    try {
      console.log('🤖 Generating Checklist & Timeline structured content...');
      const checklistData = await generateChecklistAndTimeline(city, processedQuestionnaire);
      
      // Validate the structured content
      if (!checklistData.checklist_items || checklistData.checklist_items.length < 20) {
        console.warn('⚠️ Checklist items insufficient');
        errors.push('Checklist: Insufficient checklist items generated');
      }
      
      if (!checklistData.timeline_phases || checklistData.timeline_phases.length < 5) {
        console.warn('⚠️ Timeline phases insufficient');
        errors.push('Timeline: Insufficient timeline phases generated');
      }
      
      const checklistFilename = sanitizeFilename(`${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-checklist-timeline.pdf`);
      const checklistPDFPath = await generatePDF(checklistData, checklistFilename, cityName, stateName, 'checklist');
      generatedPDFs.push({
        path: checklistPDFPath,
        filename: checklistFilename,
        title: 'Moving Checklist & Timeline'
      });
      console.log('✅ Checklist & timeline generated with structured templates');
      console.log(`   Checklist items: ${checklistData.checklist_items?.length || 0}`);
      console.log(`   Timeline phases: ${checklistData.timeline_phases?.length || 0}`);
    } catch (error) {
      console.error('❌ Error generating checklist:', error);
      errors.push(`Checklist & Timeline: ${error.message}`);
    }

    // Generate Seasonal Guide PDF with structured content
    try {
      console.log('🤖 Generating Seasonal Guide structured content...');
      const seasonalData = await generateSeasonalGuide(city, processedQuestionnaire);
      
      // Validate the structured content
      if (!seasonalData.weather_data || seasonalData.weather_data.length !== 12) {
        console.warn('⚠️ Weather data incomplete - should have 12 months');
        errors.push('Seasonal: Incomplete weather data');
      }
      
      if (!seasonalData.produce_data || seasonalData.produce_data.length !== 12) {
        console.warn('⚠️ Produce data incomplete - should have 12 months');
        errors.push('Seasonal: Incomplete produce data');
      }
      
      const seasonalFilename = sanitizeFilename(`${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-seasonal-guide.pdf`);
      const seasonalPDFPath = await generatePDF(seasonalData, seasonalFilename, cityName, stateName, 'seasonal');
      generatedPDFs.push({
        path: seasonalPDFPath,
        filename: seasonalFilename,
        title: 'Seasonal Living Guide'
      });
      console.log('✅ Seasonal guide generated with structured templates');
      console.log(`   Weather months: ${seasonalData.weather_data?.length || 0}/12`);
      console.log(`   Produce months: ${seasonalData.produce_data?.length || 0}/12`);
    } catch (error) {
      console.error('❌ Error generating seasonal guide:', error);
      errors.push(`Seasonal Guide: ${error.message}`);
    }

    // Temporary placeholder for costs guide (structured template coming soon)
    try {
      console.log('🤖 Generating Costs & Resources content (placeholder)...');
      const costsData = await generateCostsAndResources(city, processedQuestionnaire);
      const costsFilename = sanitizeFilename(`${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-costs-resources.pdf`);
      const costsPDFPath = await generatePDF(costsData, costsFilename, cityName, stateName, 'costs');
      generatedPDFs.push({
        path: costsPDFPath,
        filename: costsFilename,
        title: 'Cost Breakdown & Local Resources'
      });
      console.log('✅ Costs & resources guide generated (placeholder)');
    } catch (error) {
      console.error('❌ Error generating costs guide:', error);
      errors.push(`Costs & Resources: ${error.message}`);
    }

    // Generate Children & Pets Guide PDF (if applicable)
    if (processedQuestionnaire.hasChildren || processedQuestionnaire.hasPets) {
      try {
        console.log('🤖 Generating Children & Pets Guide content (placeholder)...');
        const familyData = await generateChildrenAndPetsGuide(city, processedQuestionnaire);
        if (familyData) {
          const familyFilename = sanitizeFilename(`${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-family-pets-guide.pdf`);
          const familyPDFPath = await generatePDF(familyData, familyFilename, cityName, stateName, 'family');
          generatedPDFs.push({
            path: familyPDFPath,
            filename: familyFilename,
            title: `${processedQuestionnaire.hasChildren && processedQuestionnaire.hasPets ? 'Family & Pets' : processedQuestionnaire.hasChildren ? 'Children & Family' : 'Pet Owner'} Guide`
          });
          console.log('✅ Children & pets guide generated (placeholder)');
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

    console.log(`📄 Successfully generated ${generatedPDFs.length} structured PDFs:`, generatedPDFs.map(pdf => pdf.title));

    // Log final validation summary
    console.log('📊 FINAL VALIDATION SUMMARY:');
    console.log(`   Total PDFs generated: ${generatedPDFs.length}`);
    console.log(`   Total warnings/errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log('   Issues found:');
      errors.forEach(error => console.log(`     - ${error}`));
    }

    if (email) {
      console.log(`📧 Starting email send process to: ${email}`);
      // Send email with all PDF attachments
      await sendEmailWithMultiplePDFs(email, city, generatedPDFs);
      console.log(`✅ Email with ${generatedPDFs.length} structured PDFs sent successfully to: ${email}`);
      
      res.status(200).json({
        success: true,
        message: `Your comprehensive moving plan for ${city} (${generatedPDFs.length} guides) has been sent to ${email}`,
        city,
        generatedGuides: generatedPDFs.map(pdf => pdf.title),
        contentWarnings: errors.length > 0 ? errors : undefined,
        generationMethod: 'structured-templates'
      });
    } else {
      // Return download links for all PDFs
      const downloadUrls = generatedPDFs.map(pdf => ({
        title: pdf.title,
        url: `/downloads/${pdf.filename}`,
        filename: pdf.filename
      }));
      
      console.log(`🔗 Download links created for ${generatedPDFs.length} structured PDFs`);
      
      res.status(200).json({
        success: true,
        message: `Your comprehensive moving plan for ${city} is ready for download (${generatedPDFs.length} guides)`,
        city,
        downloadUrls,
        contentWarnings: errors.length > 0 ? errors : undefined,
        generationMethod: 'structured-templates'
      });
    }

    console.log('✅ =========================');
    console.log('✅ STRUCTURED PDF GENERATION COMPLETED');
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
