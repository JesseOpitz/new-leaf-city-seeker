
const { chromium } = require('playwright-core');
const chromiumBundle = require('@sparticuz/chromium');
const path = require('path');
const fs = require('fs').promises;

const generatePDF = async (htmlContent, filename, city = '', state = '', documentType = 'welcome') => {
  let browser;

  try {
    console.log('📄 Starting PDF generation...');
    if (!htmlContent || !filename) throw new Error('Missing content or filename');

    // Define content lists for different document types
    const contentLists = {
      welcome: [
        'Personalized Welcome & Overview',
        'Cultural Expectations & City Atmosphere',
        'What to Expect Upon Arrival',
        'Transition & Mental Preparation Tips',
        'Support Groups & Social Meetup Ideas',
        'Local Orientation Strategies',
        'Neighborhood Guides & First-Week Advice'
      ],
      checklist: [
        'Comprehensive Moving Checklist (20+ Items)',
        'Financial Preparation Tasks',
        'Packing & Organization Guide',
        'Pet & Children-Specific Tasks',
        'Utilities & Services Setup',
        '30-Day Preparation Timeline',
        '60-Day Preparation Timeline',
        '90-Day Preparation Timeline'
      ],
      costs: [
        'Detailed Cost Breakdown by Category',
        'Housing & Utilities Estimates',
        'Transportation & Healthcare Costs',
        'Groceries & Entertainment Budget',
        'Emergency Fund Recommendations',
        'Local Resources Directory',
        'Essential Services & Contacts',
        'Community Support Groups'
      ],
      seasonal: [
        'Climate & Seasonal Overview',
        'Monthly Temperature Charts',
        'Seasonal Packing Suggestions',
        'Local Produce & Harvest Calendar',
        'Farmers Market Guide',
        'Seasonal Events & Activities',
        'Weather Adaptation Tips'
      ],
      family: [
        'School District Information',
        'Childcare & Educational Resources',
        'Family-Friendly Activities',
        'Pediatric Healthcare Providers',
        'Pet Services & Veterinarians',
        'Pet-Friendly Parks & Activities',
        'Family Safety & Community Info'
      ]
    };

    const documentTitles = {
      welcome: `Welcome to ${city}, ${state}`,
      checklist: `Moving Checklist & Timeline for ${city}`,
      costs: `Cost Overview & Local Resources for ${city}`,
      seasonal: `Seasonal Living Guide for ${city}`,
      family: `Family & Pet Guide for ${city}`
    };

    // Get the appropriate content list and title
    const content_list = contentLists[documentType] || contentLists.welcome;
    const documentTitle = documentTitles[documentType] || documentTitles.welcome;

    // Create title page HTML based on document type
    const titlePageHTML = documentType === 'welcome' ? `
      <div style="
        height: 100vh; 
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        text-align: center; 
        padding: 40px 20px;
        page-break-after: always;
      ">
        <div style="margin-bottom: 40px;">
          <img src="https://raw.githubusercontent.com/JesseOpitz/new-leaf-city-seeker/main/logo.png" 
               alt="New Leaf Logo" 
               style="max-height: 120px; max-width: 300px;" />
        </div>
        
        <h1 style="
          color: #2c5530; 
          font-size: 28px; 
          margin-bottom: 30px; 
          line-height: 1.4;
          max-width: 600px;
        ">
          Thank you for purchasing your personalized moving plan for ${city}, ${state}
        </h1>
        
        <p style="
          font-size: 18px; 
          color: #333; 
          margin-bottom: 25px;
          font-weight: 500;
        ">
          In this welcome guide, you will find:
        </p>
        
        <ol style="
          font-size: 16px; 
          color: #333; 
          text-align: left; 
          max-width: 500px; 
          line-height: 1.6;
          padding-left: 20px;
        ">
          ${content_list.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
        </ol>
      </div>
    ` : `
      <div style="
        height: 100vh; 
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        text-align: center; 
        padding: 40px 20px;
        page-break-after: always;
      ">
        <h1 style="
          color: #2c5530; 
          font-size: 32px; 
          margin-bottom: 40px; 
          line-height: 1.4;
          max-width: 600px;
          border-bottom: 3px solid #7fb069;
          padding-bottom: 20px;
        ">
          ${documentTitle}
        </h1>
        
        <p style="
          font-size: 18px; 
          color: #333; 
          margin-bottom: 25px;
          font-weight: 500;
        ">
          This guide includes:
        </p>
        
        <ol style="
          font-size: 16px; 
          color: #333; 
          text-align: left; 
          max-width: 500px; 
          line-height: 1.6;
          padding-left: 20px;
        ">
          ${content_list.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
        </ol>
      </div>
    `;

    const styledHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${documentTitle}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #fff;
          }
          h1 {
            color: #2c5530;
            border-bottom: 3px solid #7fb069;
            padding-bottom: 10px;
            margin-bottom: 30px;
            font-size: 28px;
          }
          h2 {
            color: #2c5530;
            margin-top: 35px;
            margin-bottom: 15px;
            font-size: 22px;
          }
          h3 {
            color: #4a7c59;
            margin-top: 25px;
            margin-bottom: 12px;
            font-size: 18px;
          }
          p {
            margin-bottom: 15px;
            text-align: justify;
          }
          ul, ol {
            margin-bottom: 20px;
            padding-left: 25px;
          }
          li {
            margin-bottom: 8px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 10px;
          }
          .section {
            margin-bottom: 35px;
            padding: 20px;
            border-left: 4px solid #7fb069;
            background: #f8f9fa;
            border-radius: 0 8px 8px 0;
          }
          .cost-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
          }
          .timeline-item {
            margin-bottom: 15px;
            padding: 10px;
            background: #fff;
            border-radius: 5px;
            border-left: 3px solid #7fb069;
          }
          .resource-link {
            color: #2c5530;
            text-decoration: none;
            font-weight: 500;
          }
          .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
            padding: 15px 20px;
            background: white;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .satisfaction-guarantee {
            color: #22c55e;
            font-weight: 600;
            font-size: 13px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #dee2e6;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #2c5530;
          }
          
          @media print {
            .footer {
              position: static;
              margin-top: 40px;
              border-top: 1px solid #dee2e6;
              background: transparent;
            }
          }
        </style>
      </head>
      <body>
        <div class="title-page">
          ${titlePageHTML}
        </div>
        ${htmlContent}
        <div class="footer">
          <div class="satisfaction-guarantee">
            Not seeing what you expected? Please reach out to support@new-leaf.net at any time for a full refund.
          </div>
          <div>
            Generated by New Leaf • Visit us at new-leaf.net
          </div>
        </div>
      </body>
      </html>
    `;

    browser = await chromium.launch({
      args: chromiumBundle.args,
      executablePath: await chromiumBundle.executablePath(),
      headless: chromiumBundle.headless === true,
    });

    console.log('📄 Browser launched');
    const page = await browser.newPage();

    await page.setContent(styledHTML, { waitUntil: 'networkidle' });
    console.log('📄 Page content set');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '25mm',
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
    return tempPath;

  } catch (err) {
    console.error('❌ PDF generation error:', err.message);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
      console.log('📄 Browser closed');
    }
  }
};

module.exports = { generatePDF };
