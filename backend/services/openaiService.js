const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.BACKEND_OPENAI_API_KEY,
});

const generateWelcomeAndIntroduction = async (city, questionnaire) => {
  const prompt = `
Create a professional, highly personalized relocation introduction for someone moving to ${city}, based on the following details:

- Moving Date: ${questionnaire.movingDate}
- Budget: ${questionnaire.budget}
- Household Size: ${questionnaire.householdSize} people
- Income: ${questionnaire.income}
- Reason for Moving: ${questionnaire.reason}
${questionnaire.additionalInfo ? `- Additional Personalization: ${questionnaire.additionalInfo}

IMPORTANT: The user has provided additional personalization information. This must be referenced and used throughout all sections with genuine empathy and understanding.` : ''}

Generate professional HTML content with appropriate <html>, <head>, and <body> tags. The plan must include:

1. **Warm Welcome Message and Introductory Note** (EXACTLY 400 words)
   - Personal greeting acknowledging their specific situation
   - ${questionnaire.additionalInfo ? 'Address their personal circumstances with empathy and understanding' : ''}
   - Expression of excitement for their journey to ${city}
   - Do not mention spscific dates since theynare only entering an approximate timeline.

2. **Cultural Expectations, City Atmosphere, and General Vibe** (EXACTLY 400 words)
   - Detailed overview of ${city}'s culture and lifestyle
   - What makes this city unique
   - Social dynamics and community feel
   - Local customs and traditions

3. **What to Expect Upon Arrival** (EXACTLY 400 words)
   - First impressions and immediate experiences
   - Infrastructure and city layout
   - Transportation and accessibility
   - Initial adjustment considerations

4. **Transition and Mental Preparation Tips** (EXACTLY 400 words)
   - Psychological preparation for the move
   - Stress management strategies
   - Building resilience during transition
   - Maintaining connections to home

5. **How This City Aligns with Their Reason for Moving** (EXACTLY 400 words)
   - Specific analysis based on their reason: ${questionnaire.reason}
   - Opportunities this city provides for their goals
   - Success stories and testimonials
   - Long-term benefits and potential

6. **Support Groups and Social Meetup Ideas** (EXACTLY 400 words)
   - Professional networking opportunities
   - Social clubs and hobby groups
   - Family-friendly communities (if applicable)
   - Online and offline networking platforms

7. **Local Orientation Strategies** (EXACTLY 400 words)
   - Neighborhood exploration guide
   - First-week survival tips
   - Essential locations to discover early
   - Building local knowledge quickly

FORMATTING REQUIREMENTS:
- Include complete HTML structure with <html>, <head>, and <body> tags
- Each section must be EXACTLY 400 words - no more, no less
- Never include markdown code blocks like \`\`\`html
- Write in a warm, helpful tone while maintaining professional formatting
- Format all headers cleanly with proper HTML tags
- Use semantic, clean HTML and responsive layout hints
- Content must look polished and print-ready

DO NOT wrap the output in code blocks. Return pure HTML only.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional relocation specialist who creates detailed, personalized moving guides. Always respond with well-formatted HTML that's ready for PDF conversion. Show genuine empathy for the user's situation and use any provided additional information extensively throughout the content. Each section must be EXACTLY 400 words."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    let htmlContent = completion.choices[0]?.message?.content || '';
    htmlContent = htmlContent.replace(/^```html\s*/i, '').replace(/```$/, '').trim();
    
    if (!htmlContent || htmlContent.trim().length < 100) {
      throw new Error('OpenAI returned insufficient content for welcome guide');
    }

    return htmlContent;
  } catch (error) {
    console.error('❌ Error generating welcome guide:', error);
    throw new Error(`Welcome guide generation failed: ${error.message}`);
  }
};

const generateChecklistAndTimeline = async (city, questionnaire) => {
  const prompt = `
Build an interactive-style checklist page followed by a 30-60-90 day preparation timeline for someone moving to ${city}.

Moving Details:
- Moving Date: ${questionnaire.movingDate}
- Budget: ${questionnaire.budget}
- Household Size: ${questionnaire.householdSize} people
- Income: ${questionnaire.income}
- Reason for Moving: ${questionnaire.reason}
${questionnaire.hasChildren ? '- Traveling with Children: Yes' : ''}
${questionnaire.hasPets ? '- Traveling with Pets: Yes' : ''}
${questionnaire.additionalInfo ? `- Additional Context: ${questionnaire.additionalInfo}` : ''}

Generate professional HTML content with complete structure. Include:

1. **Comprehensive Moving Checklist** (Full page table with 20-30 items)
   - Format with checkboxes (☐) and helpful context
   - Use professional table layout with borders and headings
   - Include sections for:
     * Financial Preparation
     * Documentation and Legal Tasks
     * Packing and Logistics
     * ${questionnaire.hasChildren ? 'Child-Specific Tasks (school enrollment, medical records, etc.)' : ''}
     * ${questionnaire.hasPets ? 'Pet-Specific Tasks (vet records, travel carriers, registration)' : ''}
     * Utilities and Services
     * Personal and Family Readiness
   - Each item should be actionable and specific

2. **30 Days Before Move** (EXACTLY 400 words)
   - Detailed preparation tasks
   - Planning and organization priorities
   - Research and decision-making phase
   - Early action items

3. **1 Week Before Move** (EXACTLY 400 words)
   - Final preparations and confirmations
   - Last-minute tasks and reminders
   - Emergency planning and backup strategies
   - Final communication checklist

4. **Move Day Strategy** (EXACTLY 400 words)
   - Hour-by-hour moving day timeline
   - Coordination and communication plan
   - Problem-solving and contingency planning
   - Essential items and emergency kit

5. **First Week After Move** (EXACTLY 400 words)
   - Immediate settlement priorities
   - Essential services setup
   - Neighborhood exploration
   - Routine establishment

6. **First 90 Days Integration Plan** (EXACTLY 400 words)
   - Long-term settlement strategy
   - Community integration steps
   - Professional and social networking
   - Lifestyle establishment and optimization

FORMATTING REQUIREMENTS:
- Include complete HTML structure with <html>, <head>, and <body> tags
- Each section must be EXACTLY 400 words - no more, no less
- Format checklist items with proper styling and borders
- Never include markdown code blocks
- Use clean tables and organized layouts
- Write in a helpful, actionable tone
- Make content print-ready and professional

DO NOT wrap the output in code blocks. Return pure HTML only.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional moving coordinator who creates detailed checklists and timelines. Always respond with well-formatted HTML that's ready for PDF conversion. Focus on actionable, practical advice. Each section must be EXACTLY 400 words."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    let htmlContent = completion.choices[0]?.message?.content || '';
    htmlContent = htmlContent.replace(/^```html\s*/i, '').replace(/```$/, '').trim();
    
    if (!htmlContent || htmlContent.trim().length < 100) {
      throw new Error('OpenAI returned insufficient content for checklist');
    }

    return htmlContent;
  } catch (error) {
    console.error('❌ Error generating checklist:', error);
    throw new Error(`Checklist generation failed: ${error.message}`);
  }
};

const generateCostsAndResources = async (city, questionnaire) => {
  const prompt = `
Create a comprehensive cost breakdown and local resources directory for someone moving to ${city}.

Personal Details:
- Budget: ${questionnaire.budget}
- Household Size: ${questionnaire.householdSize} people
- Income: ${questionnaire.income}
- Reason for Moving: ${questionnaire.reason}
${questionnaire.hasChildren ? '- Has Children: Yes' : ''}
${questionnaire.hasPets ? '- Has Pets: Yes' : ''}
${questionnaire.additionalInfo ? `- Additional Context: ${questionnaire.additionalInfo}` : ''}

Generate professional HTML content including:

1. **Detailed Cost Breakdown for ${city}** (Full page table)
   - Comprehensive table with housing, utilities, transportation, healthcare, groceries, entertainment
   - Include low/medium/high ranges for each category
   - Monthly and yearly expense estimates
   - Emergency fund suggestions
   - Budget alignment commentary personalized to their income (${questionnaire.income}) and household size (${questionnaire.householdSize})
   - ${questionnaire.hasChildren ? 'Include childcare and education costs' : ''}
   - ${questionnaire.hasPets ? 'Include pet care and veterinary expenses' : ''}

2. **Personalized Budget Analysis** (EXACTLY 400 words)
   - How their budget fits with ${city} costs
   - Optimization strategies for their situation
   - Saving opportunities and cost-cutting tips
   - Financial planning recommendations

3. **Essential Local Resources Directory for ${city}** (Full page table)
   - Format as clean tables with proper styling
   - Include real contact information and websites where possible
   - Minimum 15 entries covering:
     * DMV and Government Services
     * Healthcare Providers and Hospitals
     * Schools and Educational Institutions
     * Utilities and Internet Providers
     * Banking and Financial Services
     * ${questionnaire.hasChildren ? 'Childcare and Family Services' : ''}
     * ${questionnaire.hasPets ? 'Veterinary and Pet Services' : ''}

4. **Community and Support Resources** (EXACTLY 400 words)
   - LGBTQ+ and minority support groups
   - Women and family resources
   - Professional networking organizations
   - Cultural and recreational facilities
   - Emergency contacts and crisis resources

5. **Neighborhood Recommendations** (EXACTLY 400 words)
   - Best areas based on their budget and needs
   - Transportation accessibility
   - Safety and security considerations
   - Amenities and lifestyle fit

FORMATTING REQUIREMENTS:
- Include complete HTML structure with <html>, <head>, and <body> tags
- Use professional table formatting with borders and styling
- Each text section must be EXACTLY 400 words - no more, no less
- Never include markdown code blocks
- Ensure tables are readable and well-organized
- Include actual URLs and contact information where possible
- Make content comprehensive and actionable
- Professional, polished appearance

DO NOT wrap the output in code blocks. Return pure HTML only.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are a financial planning and local resources specialist who creates comprehensive cost guides and resource directories. Always respond with well-formatted HTML that's ready for PDF conversion. Each text section must be EXACTLY 400 words."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    let htmlContent = completion.choices[0]?.message?.content || '';
    htmlContent = htmlContent.replace(/^```html\s*/i, '').replace(/```$/, '').trim();
    
    if (!htmlContent || htmlContent.trim().length < 100) {
      throw new Error('OpenAI returned insufficient content for costs guide');
    }

    return htmlContent;
  } catch (error) {
    console.error('❌ Error generating costs guide:', error);
    throw new Error(`Costs guide generation failed: ${error.message}`);
  }
};

const generateSeasonalGuide = async (city, questionnaire) => {
  const prompt = `
Generate a professional seasonal guide for ${city} including climate, weather patterns, and local produce information.

Personal Context:
- Moving Date: ${questionnaire.movingDate}
- Household Size: ${questionnaire.householdSize} people
- Reason for Moving: ${questionnaire.reason}
${questionnaire.hasChildren ? '- Has Children: Yes' : ''}
${questionnaire.hasPets ? '- Has Pets: Yes' : ''}
${questionnaire.additionalInfo ? `- Additional Context: ${questionnaire.additionalInfo}` : ''}

Generate professional HTML content including:

1. **Climate and Seasonal Experiences in ${city}** (EXACTLY 400 words)
   - Comprehensive overview of the climate
   - What to expect each season
   - Seasonal lifestyle changes and adaptations
   - How weather affects daily life and activities
   - ${questionnaire.hasChildren ? 'Seasonal considerations for families with children' : ''}
   - ${questionnaire.hasPets ? 'Weather impact on pets and seasonal pet care' : ''}

2. **Monthly Temperature Chart** (Full page table)
   - Professional table with monthly highs and lows
   - Clean layout with background-shaded rows
   - Include humidity and precipitation data
   - Seasonal activity recommendations

3. **Packing and Seasonal Adjustment Guide** (EXACTLY 400 words)
   - What clothing and items to bring for each season
   - Seasonal preparation tips
   - Home preparation for different weather patterns
   - Energy costs and utility considerations
   - Storage and organization strategies

4. **Local Produce and Food Seasonality** (Full page table with EXACTLY 400 words description)
   - Seasonal fruits and vegetables table by month
   - Farmer's market recommendations and schedules
   - Local food specialties and seasonal dishes
   - Tips for healthy and affordable seasonal eating
   - Food preservation and storage advice

5. **Seasonal Events and Activities** (EXACTLY 400 words)
   - Annual festivals and community events
   - Seasonal recreational opportunities
   - Cultural activities throughout the year
   - ${questionnaire.hasChildren ? 'Family-friendly seasonal activities and events' : ''}
   - Networking and social opportunities by season

6. **Seasonal Living Tips and Pros/Cons** (EXACTLY 400 words)
   - Advantages and challenges of each season
   - Cost considerations throughout the year
   - Health and wellness seasonal tips
   - Transportation and commuting seasonal changes

FORMATTING REQUIREMENTS:
- Include complete HTML structure with <html>, <head>, and <body> tags
- Beautiful, inspiring, and clean styling
- Professional table formatting for temperature and produce data
- Each text section must be EXACTLY 400 words - no more, no less
- Never include markdown code blocks
- Use attractive color schemes and typography
- Make tables readable with proper borders and spacing
- Ensure content is comprehensive and visually appealing

DO NOT wrap the output in code blocks. Return pure HTML only.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are a climate and seasonal living specialist who creates beautiful, comprehensive seasonal guides. Always respond with well-formatted HTML that's ready for PDF conversion with attractive styling. Each text section must be EXACTLY 400 words."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    let htmlContent = completion.choices[0]?.message?.content || '';
    htmlContent = htmlContent.replace(/^```html\s*/i, '').replace(/```$/, '').trim();
    
    if (!htmlContent || htmlContent.trim().length < 100) {
      throw new Error('OpenAI returned insufficient content for seasonal guide');
    }

    return htmlContent;
  } catch (error) {
    console.error('❌ Error generating seasonal guide:', error);
    throw new Error(`Seasonal guide generation failed: ${error.message}`);
  }
};

const generateChildrenAndPetsGuide = async (city, questionnaire) => {
  const { hasChildren, hasPets } = questionnaire;
  
  if (!hasChildren && !hasPets) {
    return null; // No need to generate this guide
  }

  const prompt = `
Create an extensive guide for ${hasChildren && hasPets ? 'families with children and pets' : hasChildren ? 'families with children' : 'pet owners'} moving to ${city}.

Family Details:
- Moving Date: ${questionnaire.movingDate}
- Budget: ${questionnaire.budget}
- Household Size: ${questionnaire.householdSize} people
${hasChildren ? '- Traveling with Children: Yes' : ''}
${hasPets ? '- Traveling with Pets: Yes' : ''}
- Reason for Moving: ${questionnaire.reason}
${questionnaire.additionalInfo ? `- Additional Context: ${questionnaire.additionalInfo}` : ''}

Generate professional HTML content including:

${hasChildren ? `
1. **Complete Children's Relocation Guide** (EXACTLY 400 words)
   - Age-appropriate preparation strategies
   - School enrollment and educational transition
   - Healthcare and pediatric services in ${city}
   - Social integration and making friends
   - Activity and entertainment options
   - Childcare and babysitting resources

2. **Educational Resources and Schools in ${city}** (EXACTLY 400 words)
   - Public and private school options
   - Registration requirements and timelines
   - Special needs and gifted programs
   - Extracurricular activities and sports
   - Parent involvement opportunities

3. **Child-Friendly Neighborhoods and Activities** (EXACTLY 400 words)
   - Best family neighborhoods in ${city}
   - Parks, playgrounds, and recreational facilities
   - Libraries and educational centers
   - Safety considerations for families
   - Community resources for children
` : ''}

${hasPets ? `
${hasChildren ? '4' : '1'}. **Comprehensive Pet Relocation Guide** (EXACTLY 400 words)
   - Pre-move veterinary preparations
   - Travel arrangements and safety
   - Pet registration and licensing in ${city}
   - Finding veterinary care and emergency services
   - Pet-friendly housing considerations
   - Local pet regulations and leash laws

${hasChildren ? '5' : '2'}. **Pet Services and Resources in ${city}** (EXACTLY 400 words)
   - Veterinary clinics and animal hospitals
   - Pet stores and supply shops
   - Grooming and boarding services
   - Dog parks and exercise areas
   - Pet training and behavioral services
   - Emergency veterinary care

${hasChildren ? '6' : '3'}. **Pet-Friendly Living in ${city}** (EXACTLY 400 words)
   - Pet-friendly neighborhoods and housing
   - Local pet community and social opportunities
   - Seasonal pet care considerations
   - Pet insurance and healthcare costs
   - Integration tips for pets in new environment
` : ''}

${hasChildren && hasPets ? `
7. **Family and Pet Integration Strategies** (EXACTLY 400 words)
   - Managing both children and pets during the move
   - Creating routines that work for the whole family
   - Safety considerations with children and pets
   - Building community connections for families with pets
   - Budgeting for both child and pet needs
` : ''}

FORMATTING REQUIREMENTS:
- Include complete HTML structure with <html>, <head>, and <body> tags
- Professional, family-friendly styling
- Each section must be EXACTLY 400 words - no more, no less
- Never include markdown code blocks
- Include practical tables and resource lists
- Warm, supportive tone while maintaining professionalism
- Comprehensive resource directories with contact information
- Make content actionable and reassuring for families

DO NOT wrap the output in code blocks. Return pure HTML only.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `You are a family relocation specialist who creates comprehensive guides for ${hasChildren && hasPets ? 'families with children and pets' : hasChildren ? 'families with children' : 'pet owners'}. Always respond with well-formatted HTML that's ready for PDF conversion with warm, supportive guidance. Each section must be EXACTLY 400 words.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    let htmlContent = completion.choices[0]?.message?.content || '';
    htmlContent = htmlContent.replace(/^```html\s*/i, '').replace(/```$/, '').trim();
    
    if (!htmlContent || htmlContent.trim().length < 100) {
      throw new Error('OpenAI returned insufficient content for children/pets guide');
    }

    return htmlContent;
  } catch (error) {
    console.error('❌ Error generating children/pets guide:', error);
    throw new Error(`Children/pets guide generation failed: ${error.message}`);
  }
};

// Keep the original function for backward compatibility but mark as deprecated
const generateMovingPlan = async (city, questionnaire) => {
  console.log('⚠️ Using deprecated generateMovingPlan function. Consider using the new modular approach.');
  return generateWelcomeAndIntroduction(city, questionnaire);
};

module.exports = { 
  generateMovingPlan, 
  generateWelcomeAndIntroduction,
  generateChecklistAndTimeline,
  generateCostsAndResources,
  generateSeasonalGuide,
  generateChildrenAndPetsGuide
};
