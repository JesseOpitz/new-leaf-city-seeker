
import { City } from '@/utils/dataService';

interface MovingPlanData {
  city: string;
  state: string;
  questionnaireData: any;
  userEmail: string;
}

// Email service configuration - you'll need to provide these
const EMAIL_CONFIG = {
  // You'll need to provide these in your next message:
  SMTP_HOST: process.env.SMTP_HOST || 'your-smtp-host.com',
  SMTP_PORT: process.env.SMTP_PORT || '587',
  SMTP_USER: process.env.SMTP_USER || 'your-email@domain.com',
  SMTP_PASS: process.env.SMTP_PASS || 'your-app-password',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@your-domain.com',
  FROM_NAME: process.env.FROM_NAME || 'New Leaf City Seeker'
};

// OpenAI configuration
const OPENAI_CONFIG = {
  API_KEY: process.env.OPENAI_API_KEY || 'your-openai-api-key',
  MODEL: 'gpt-4o',
  MAX_TOKENS: 4000
};

export const generatePersonalizedPlan = async (planData: MovingPlanData): Promise<string> => {
  const { city, state, questionnaireData, userEmail } = planData;
  
  const prompt = `Create a comprehensive, personalized moving plan for someone relocating to ${city}, ${state}. 

User's Moving Profile:
- Timeline: ${questionnaireData.timeline || 'Not specified'}
- Budget: ${questionnaireData.budget || 'Not specified'}
- Household Size: ${questionnaireData.household || 'Not specified'}
- Income Range: ${questionnaireData.income || 'Not specified'}
- Housing Preference: ${questionnaireData.housingPreference || 'Not specified'}
- Move Reason: ${questionnaireData.moveReason || 'Not specified'}

Please create a detailed moving plan that includes:

1. **Executive Summary** (2-3 paragraphs)
   - Personalized welcome message for moving to ${city}
   - Overview of what makes this city perfect for their situation
   - Brief timeline overview based on their preferences

2. **Customized Timeline & Checklist**
   - Break down tasks by timeline phases based on their moving timeline
   - Include specific deadlines and milestones
   - Prioritize tasks based on their budget and household size

3. **Budget Breakdown & Financial Planning**
   - Detailed cost estimates specific to ${city}, ${state}
   - Budget allocation recommendations based on their budget range
   - Cost-saving tips relevant to their financial situation
   - Local cost of living insights

4. **Housing Strategy for ${city}**
   - Neighborhood recommendations based on their housing preference
   - Market insights and timing advice
   - Specific resources for their housing type preference
   - Local real estate contacts and websites

5. **Essential Local Resources**
   - Government offices and registration requirements
   - Utility companies and setup procedures
   - Healthcare providers and insurance considerations
   - Educational resources (if applicable based on household size)

6. **Community Integration Guide**
   - Local amenities and attractions
   - Networking opportunities based on their move reason
   - Community groups and social activities
   - Local customs and cultural insights

7. **Logistics & Service Providers**
   - Recommended moving companies for their budget range
   - Local service providers (utilities, internet, etc.)
   - Emergency contacts and important numbers
   - Transportation options in ${city}

8. **30-60-90 Day Action Plan**
   - Specific tasks for first 30 days
   - 60-day settlement goals
   - 90-day integration milestones

Make this plan highly specific to ${city}, ${state} with actual local information, real resources, and actionable advice. Use a professional yet friendly tone. Format with clear headers and bullet points for easy reading.

Length: Approximately 2000-2500 words with detailed, actionable content.`;

  try {
    console.log('Generating personalized moving plan with OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a professional moving consultant and city relocation expert. Create detailed, personalized moving plans with specific local information and actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: OPENAI_CONFIG.MAX_TOKENS,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedPlan = data.choices[0]?.message?.content;
    
    if (!generatedPlan) {
      throw new Error('No content generated from OpenAI');
    }

    console.log('Successfully generated personalized moving plan');
    return generatedPlan;
    
  } catch (error) {
    console.error('Error generating moving plan:', error);
    throw new Error(`Failed to generate moving plan: ${error.message}`);
  }
};

export const sendMovingPlanEmail = async (planData: MovingPlanData): Promise<boolean> => {
  try {
    console.log(`Generating and sending moving plan for ${planData.city}, ${planData.state}`);
    
    // Generate the personalized plan
    const movingPlan = await generatePersonalizedPlan(planData);
    
    // Convert plan to HTML format for better email presentation
    const htmlPlan = convertPlanToHTML(movingPlan, planData);
    
    // Send email (you'll need to implement your preferred email service)
    const emailSent = await sendEmail({
      to: planData.userEmail,
      subject: `Your Personalized Moving Plan for ${planData.city}, ${planData.state}`,
      html: htmlPlan,
      text: movingPlan
    });
    
    if (emailSent) {
      console.log(`Moving plan successfully sent to ${planData.userEmail}`);
      return true;
    } else {
      throw new Error('Failed to send email');
    }
    
  } catch (error) {
    console.error('Error sending moving plan email:', error);
    throw error;
  }
};

const convertPlanToHTML = (plan: string, planData: MovingPlanData): string => {
  // Convert markdown-style formatting to HTML
  let htmlPlan = plan
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|l|p])/gm, '<p>')
    .replace(/(?<!>)$/gm, '</p>');

  // Wrap list items in ul tags
  htmlPlan = htmlPlan.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  
  // Clean up extra p tags
  htmlPlan = htmlPlan.replace(/<p><\/p>/g, '');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Personalized Moving Plan</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c5530; border-bottom: 2px solid #2c5530; padding-bottom: 10px; }
        h2 { color: #2c5530; margin-top: 30px; }
        h3 { color: #4a7c59; }
        ul { margin: 10px 0; padding-left: 20px; }
        li { margin: 5px 0; }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .footer { margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Your Personalized Moving Plan</h1>
        <h2>Moving to ${planData.city}, ${planData.state}</h2>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      ${htmlPlan}
      
      <div class="footer">
        <p><strong>Thank you for choosing New Leaf City Seeker!</strong></p>
        <p>This plan was customized based on your preferences and generated specifically for your move to ${planData.city}, ${planData.state}.</p>
        <p>If you have any questions or need additional assistance, please don't hesitate to reach out.</p>
        <p><em>Best of luck with your move!</em></p>
      </div>
    </body>
    </html>
  `;
};

// Email sending function - you'll need to implement based on your email service
const sendEmail = async (emailData: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> => {
  // This is a placeholder - you'll need to implement with your email service
  // Options include: SendGrid, Mailgun, AWS SES, Nodemailer with SMTP, etc.
  
  console.log('Email would be sent with the following data:', {
    to: emailData.to,
    subject: emailData.subject,
    contentLength: emailData.html.length
  });
  
  // For now, simulate success
  // Replace this with actual email sending logic
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};
