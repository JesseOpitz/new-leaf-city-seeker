const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.BACKEND_OPENAI_API_KEY,
});

const generateWelcomeAndIntroduction = async (city, questionnaire) => {
  const prompt = `
Create structured content for a personalized relocation welcome guide for someone moving to ${city}.

Personal Details:
- Timeline: ${questionnaire.timeline}
- Budget: ${questionnaire.budget}
- Household Size: ${questionnaire.household} people
- Income: ${questionnaire.income}
- Reason for Moving: ${questionnaire.moveReason}
${questionnaire.hasChildren ? '- Has Children: Yes' : ''}
${questionnaire.hasPets ? '- Has Pets: Yes' : ''}
${questionnaire.additionalInfo ? `- Additional Context: ${questionnaire.additionalInfo}` : ''}

Return ONLY a JSON object with this exact structure (no code blocks, no markdown):

{
  "document_title": "Welcome to [City], [State]",
  "title_heading": "Thank you for purchasing your personalized moving plan for [City], [State]",
  "content_list": [
    "Personalized Welcome & Overview",
    "Cultural Expectations & City Atmosphere", 
    "What to Expect Upon Arrival",
    "Transition & Mental Preparation Tips",
    "How This City Aligns with Your Goals",
    "Support Groups & Social Opportunities",
    "Local Orientation Strategies"
  ],
  "sections": [
    {
      "title": "Personalized Welcome & Overview",
      "content": "Write 350-500 words of personalized welcome content addressing their specific situation, timeline, and reasons for moving. Be warm and encouraging. Fewer than 350 words or more an 500 words will be seen as a failure in this task."
    },
    {
      "title": "Cultural Expectations & City Atmosphere",
      "content": "Write exactly 350-500 words about the city's culture, lifestyle, social dynamics, and what makes it unique. Fewer than 350 words or more an 500 words will be seen as a failure in this task."
    },
    {
      "title": "What to Expect Upon Arrival", 
      "content": "Write exactly 350-500 words about first impressions, infrastructure, transportation, and initial adjustment considerations. Fewer than 350 words or more an 500 words will be seen as a failure in this task."
    },
    {
      "title": "Transition & Mental Preparation Tips",
      "content": "Write exactly 350-500 words about psychological preparation, stress management, and maintaining connections. Fewer than 350 words or more an 500 words will be seen as a failure in this task."
    },
    {
      "title": "How This City Aligns with Your Goals",
      "content": "Write exactly 350-500 words analyzing how this city fits their reason for moving and long-term benefits. Fewer than 350 words or more an 500 words will be seen as a failure in this task."
    },
    {
      "title": "Support Groups & Social Opportunities", 
      "content": "Write exactly 350-500 words about networking, social clubs, and community connections. Fewer than 350 words or more an 500 words will be seen as a failure in this task."
    },
    {
      "title": "Local Orientation Strategies",
      "content": "Write exactly 350-500 words about neighborhood exploration and building local knowledge quickly. Fewer than 350 words or more an 500 words will be seen as a failure in this task."
    }
  ]
}

CRITICAL: Return only valid JSON. No markdown, no code blocks, no extra text.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional relocation specialist. Return only valid JSON objects with structured content. Each content section must be exactly 350-500 words. No code blocks or markdown formatting. Fewer than 350 word or more than 500 words will be seen as a failure in this task."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    let response = completion.choices[0]?.message?.content || '';
    
    // Clean up any potential markdown formatting
    response = response.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    
    try {
      const data = JSON.parse(response);
      
      // Validate the response structure
      if (!data.sections || !Array.isArray(data.sections) || data.sections.length < 7) {
        throw new Error('Invalid welcome guide structure');
      }
      
      return data;
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI JSON response:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }
  } catch (error) {
    console.error('❌ Error generating welcome guide:', error);
    throw new Error(`Welcome guide generation failed: ${error.message}`);
  }
};

const generateChecklistAndTimeline = async (city, questionnaire) => {
  const prompt = `
Create structured checklist and timeline content for someone moving to ${city}.

Personal Details:
- Timeline: ${questionnaire.timeline}
- Budget: ${questionnaire.budget}
- Household Size: ${questionnaire.household} people
- Income: ${questionnaire.income}
- Reason for Moving: ${questionnaire.moveReason}
${questionnaire.hasChildren ? '- Has Children: Yes' : ''}
${questionnaire.hasPets ? '- Has Pets: Yes' : ''}
${questionnaire.additionalInfo ? `- Additional Context: ${questionnaire.additionalInfo}` : ''}

Return ONLY a JSON object with this exact structure:

{
  "document_title": "Moving Checklist & Timeline for [City]",
  "checklist_items": [
    {
      "task": "Specific actionable task description",
      "category": "Financial|Documentation|Packing|Children|Pets|Utilities|Personal",
      "priority": "High|Medium|Low"
    }
    // Include exactly 15 items covering all categories
  ],
  "timeline_phases": [
    {
      "phase_title": "30 Days Before Move",
      "description": "150-200 word overview of this phase",
      "tasks": [
        "Specific actionable task 1",
        "Specific actionable task 2", 
        "Specific actionable task 3",
        "Specific actionable task 4",
        "Specific actionable task 5",
        "Specific actionable task 6",
        "Specific actionable task 7"
      ]
    },
    {
      "phase_title": "1 Week Before Move", 
      "description": "150-200 word overview of this phase",
      "tasks": [
        "Specific actionable task 1",
        "Specific actionable task 2",
        "Specific actionable task 3", 
        "Specific actionable task 4",
        "Specific actionable task 5",
        "Specific actionable task 6",
        "Specific actionable task 7"
      ]
    },
    {
      "phase_title": "Move Day Strategy",
      "description": "150-200 word overview of move day",
      "tasks": [
        "Specific actionable task 1",
        "Specific actionable task 2",
        "Specific actionable task 3",
        "Specific actionable task 4", 
        "Specific actionable task 5",
        "Specific actionable task 6",
        "Specific actionable task 7"
      ]
    },
    {
      "phase_title": "First Week After Move",
      "description": "150-200 word overview of first week",
      "tasks": [
        "Specific actionable task 1",
        "Specific actionable task 2",
        "Specific actionable task 3",
        "Specific actionable task 4",
        "Specific actionable task 5", 
        "Specific actionable task 6",
        "Specific actionable task 7"
      ]
    },
    {
      "phase_title": "First 90 Days Integration Plan",
      "description": "150-200 word overview of long-term integration",
      "tasks": [
        "Specific actionable task 1", 
        "Specific actionable task 2",
        "Specific actionable task 3",
        "Specific actionable task 4",
        "Specific actionable task 5",
        "Specific actionable task 6",
        "Specific actionable task 7"
      ]
    }
  ]
}

Make tasks specific and actionable, not generic. Include ${questionnaire.hasChildren ? 'children-specific tasks' : ''} ${questionnaire.hasPets ? 'and pet-specific tasks' : ''} where relevant.

CRITICAL: Return only valid JSON. No markdown, no code blocks, no extra text.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional moving coordinator. Return only valid JSON with actionable, specific tasks. Each timeline phase must have exactly 7 tasks. No generic advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    let response = completion.choices[0]?.message?.content || '';
    response = response.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    
    try {
      const data = JSON.parse(response);
      
      if (!data.checklist_items || !Array.isArray(data.checklist_items) || data.checklist_items.length < 20) {
        throw new Error('Invalid checklist structure');
      }
      
      if (!data.timeline_phases || !Array.isArray(data.timeline_phases) || data.timeline_phases.length < 5) {
        throw new Error('Invalid timeline structure');
      }
      
      return data;
    } catch (parseError) {
      console.error('❌ Failed to parse checklist JSON response:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }
  } catch (error) {
    console.error('❌ Error generating checklist:', error);
    throw new Error(`Checklist generation failed: ${error.message}`);
  }
};

const generateSeasonalGuide = async (city, questionnaire) => {
  const prompt = `
Create structured seasonal guide content for ${city}.

Return ONLY a JSON object with this exact structure:

{
  "document_title": "Seasonal Living Guide for [City]",
  "climate_overview": "Write exactly 300-400 words about the overall climate and seasonal patterns in ${city}",
  "seasonal_tips": "Write exactly 300-400 words about seasonal preparation and adaptation tips",
  "weather_data": [
    {
      "month": "January",
      "high_temp": "XX°F",
      "low_temp": "XX°F", 
      "precipitation": "X.X inches",
      "description": "Brief description of January weather and activities"
    }
    // Include all 12 months with realistic temperature and precipitation data
  ],
  "produce_data": [
    {
      "month": "January",
      "produce_list": "List at least 5-8 fruits/vegetables in season, comma separated",
      "specialties": "Local specialties and market information for January"
    }
    // Include all 12 months with realistic seasonal produce
  ],
  "farmers_market_info": "Write 200-300 words about farmers markets, schedules, and local food culture in ${city}"
}

Research accurate weather data and seasonal produce for ${city}. Each month must have realistic temperatures and at least 5 seasonal items.

CRITICAL: Return only valid JSON. No markdown, no code blocks, no extra text.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", 
      messages: [
        {
          role: "system",
          content: "You are a climate and seasonal specialist. Return only valid JSON with accurate weather data and complete seasonal information for all 12 months. Research real data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    let response = completion.choices[0]?.message?.content || '';
    response = response.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    
    try {
      const data = JSON.parse(response);
      
      if (!data.weather_data || !Array.isArray(data.weather_data) || data.weather_data.length !== 12) {
        throw new Error('Invalid weather data structure - must have 12 months');
      }
      
      if (!data.produce_data || !Array.isArray(data.produce_data) || data.produce_data.length !== 12) {
        throw new Error('Invalid produce data structure - must have 12 months');
      }
      
      return data;
    } catch (parseError) {
      console.error('❌ Failed to parse seasonal JSON response:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }
  } catch (error) {
    console.error('❌ Error generating seasonal guide:', error);
    throw new Error(`Seasonal guide generation failed: ${error.message}`);
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
      model: "gpt-4.1-mini",
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
      model: "gpt-4.1-mini",
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
