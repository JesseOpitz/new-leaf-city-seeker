
const { chromium } = require('playwright-core');
const chromiumBundle = require('@sparticuz/chromium');
const path = require('path');
const fs = require('fs').promises;
const { 
  generateFromTemplate, 
  validateWeatherData, 
  validateProduceData, 
  validateTimelineData, 
  validateChecklistData,
  generateFallbackWeatherData,
  generateFallbackProduceData,
  generateFallbackTimelineData
} = require('./templateService');

const generatePDF = async (contentData, filename, city = '', state = '', documentType = 'welcome') => {
  let browser;

  try {
    console.log('📄 Starting PDF generation with template system...');
    if (!contentData || !filename) throw new Error('Missing content data or filename');

    let htmlContent;
    let templateData;

    // Process content based on document type
    switch (documentType) {
      case 'welcome':
        console.log('🏠 Processing welcome guide template');
        templateData = {
          ...contentData,
          document_title: contentData.document_title || `Welcome to ${city}, ${state}`
        };
        
        // Validate content sections
        if (!contentData.sections || contentData.sections.length < 7) {
          console.warn('⚠️ Welcome guide sections incomplete');
          // Add fallback sections if needed
        }
        
        htmlContent = await generateFromTemplate('welcome-template', templateData);
        break;

      case 'checklist':
        console.log('📋 Processing checklist template');
        
        // Validate checklist data
        const checklistValid = validateChecklistData(contentData.checklist_items);
        const timelineValid = validateTimelineData(contentData.timeline_phases);
        
        if (!checklistValid) {
          console.warn('⚠️ Using fallback checklist data');
          // Add fallback checklist items
        }
        
        if (!timelineValid) {
          console.warn('⚠️ Using fallback timeline data');
          contentData.timeline_phases = generateFallbackTimelineData();
        }
        
        templateData = {
          ...contentData,
          document_title: contentData.document_title || `Moving Checklist & Timeline for ${city}`
        };
        
        htmlContent = await generateFromTemplate('checklist-template', templateData);
        break;

      case 'seasonal':
        console.log('🌤️ Processing seasonal guide template');
        
        // Validate seasonal data
        const weatherValid = validateWeatherData(contentData.weather_data);
        const produceValid = validateProduceData(contentData.produce_data);
        
        if (!weatherValid) {
          console.warn('⚠️ Using fallback weather data');
          contentData.weather_data = generateFallbackWeatherData(city);
        }
        
        if (!produceValid) {
          console.warn('⚠️ Using fallback produce data');
          contentData.produce_data = generateFallbackProduceData(city);
        }
        
        templateData = {
          ...contentData,
          document_title: contentData.document_title || `Seasonal Living Guide for ${city}`
        };
        
        htmlContent = await generateFromTemplate('seasonal-template', templateData);
        break;

      case 'costs':
        console.log('💰 Processing costs guide template');
        // Add costs template processing here
        templateData = {
          ...contentData,
          document_title: contentData.document_title || `Cost Overview & Resources for ${city}`
        };
        // For now, use a simple template until costs template is created
        htmlContent = `<html><body><h1>${templateData.document_title}</h1><p>Cost guide content coming soon...</p></body></html>`;
        break;

      case 'family':
        console.log('👨‍👩‍👧‍👦 Processing family guide template');
        // Add family template processing here
        templateData = {
          ...contentData,
          document_title: contentData.document_title || `Family & Pet Guide for ${city}`
        };
        // For now, use a simple template until family template is created
        htmlContent = `<html><body><h1>${templateData.document_title}</h1><p>Family guide content coming soon...</p></body></html>`;
        break;

      default:
        throw new Error(`Unknown document type: ${documentType}`);
    }

    console.log('📄 Template rendered, launching browser...');

    browser = await chromium.launch({
      args: chromiumBundle.args,
      executablePath: await chromiumBundle.executablePath(),
      headless: chromiumBundle.headless === true,
    });

    console.log('📄 Browser launched');
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    console.log('📄 Page content set');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '10mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    console.log('📄 PDF buffer created');

    const tempDir = path.join(__dirname, '..', 'temp');
    const downloadDir = path.join(__dirname, '..', 'downloads');

    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(downloadDir, { recursive: true });

    const tempPath = path.join(tempDir, filename);
    const downloadPath = path.join(downloadDir, filename);

    await fs.writeFile(tempPath, pdfBuffer);
    await fs.writeFile(downloadPath, pdfBuffer);

    console.log('✅ PDF saved to:', tempPath);
    
    // Log content validation results
    console.log('📊 Content validation summary:');
    console.log(`   Document type: ${documentType}`);
    console.log(`   Template data keys: ${Object.keys(templateData).join(', ')}`);
    
    if (documentType === 'seasonal') {
      console.log(`   Weather data: ${contentData.weather_data?.length || 0}/12 months`);
      console.log(`   Produce data: ${contentData.produce_data?.length || 0}/12 months`);
    }
    
    if (documentType === 'checklist') {
      console.log(`   Checklist items: ${contentData.checklist_items?.length || 0}`);
      console.log(`   Timeline phases: ${contentData.timeline_phases?.length || 0}`);
    }
    
    return tempPath;

  } catch (err) {
    console.error('❌ PDF generation error:', err.message);
    console.error('❌ Stack trace:', err.stack);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
      console.log('📄 Browser closed');
    }
  }
};

module.exports = { generatePDF };
