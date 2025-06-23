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
      "content": "Write exactly 500-600 words of personalized welcome content addressing their specific situation, timeline, and reasons for moving. Be warm and encouraging."
    },
    {
      "title": "Cultural Expectations & City Atmosphere",
      "content": "Write exactly 500-600 words about the city's culture, lifestyle, social dynamics, and what makes it unique."
    },
    {
      "title": "What to Expect Upon Arrival", 
      "content": "Write exactly 500-600 words about first impressions, infrastructure, transportation, and initial adjustment considerations."
    },
    {
      "title": "Transition & Mental Preparation Tips",
      "content": "Write exactly 500-600 words about psychological preparation, stress management, and maintaining connections."
    },
    {
      "title": "How This City Aligns with Your Goals",
      "content": "Write exactly 500-600 words analyzing how this city fits their reason for moving and long-term benefits."
    },
    {
      "title": "Support Groups & Social Opportunities", 
      "content": "Write exactly 500-600 words about networking, social clubs, and community connections."
    },
    {
      "title": "Local Orientation Strategies",
      "content": "Write exactly 500-600 words about neighborhood exploration and building local knowledge quickly."
    }
  ]
}

CRITICAL: Return only valid JSON. No markdown, no code blocks, no extra text.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional relocation specialist. Return only valid JSON objects with structured content. Each content section must be exactly 500-600 words. No code blocks or markdown formatting."
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
    // Include exactly 25-30 items covering all categories
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
      model: "gpt-4-1106-preview",
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
  "city_overview": "Brief 2-3 sentence overview of cost of living in ${city}",
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
  "seasonal_activities": [
    {"season": "Spring", "activities": ["outdoor festivals", "hiking", "gardening", "farmers markets"], "description": "Spring in ${city} offers mild weather perfect for outdoor activities"},
    {"season": "Summer", "activities": ["outdoor concerts", "swimming", "festivals", "camping"], "description": "Summer brings warm weather and numerous outdoor entertainment options"},
    {"season": "Fall", "activities": ["apple picking", "hiking", "harvest festivals", "scenic drives"], "description": "Fall offers beautiful foliage and harvest celebrations"},
    {"season": "Winter", "activities": ["indoor events", "holiday markets", "cozy venues", "winter sports"], "description": "Winter activities focus on indoor entertainment and seasonal celebrations"}
  ]
}

Research accurate weather data and seasonal produce for ${city}. Each month must have realistic temperatures and at least 5 seasonal items.

CRITICAL: Return only valid JSON. No markdown, no code blocks, no extra text.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview", 
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
  try {
    console.log('🤖 Generating costs and resources for:', city);
    console.log('🤖 Questionnaire data:', JSON.stringify(questionnaire, null, 2));

    const prompt = `Generate a comprehensive cost breakdown and local resources guide for moving to ${city}. 

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):

{
  "document_title": "Cost Breakdown & Local Resources for ${city}",
  "city_overview": "Brief 2-3 sentence overview of cost of living in ${city}",
  "housing_costs": {
    "rent_1br": "$X,XXX",
    "rent_2br": "$X,XXX", 
    "rent_3br": "$X,XXX",
    "median_home_price": "$XXX,XXX",
    "property_tax_rate": "X.X%"
  },
  "living_expenses": [
    {"category": "Groceries", "monthly_cost": "$XXX", "notes": "Based on family of 4"},
    {"category": "Utilities", "monthly_cost": "$XXX", "notes": "Electric, gas, water, internet"},
    {"category": "Transportation", "monthly_cost": "$XXX", "notes": "Gas, insurance, maintenance"},
    {"category": "Healthcare", "monthly_cost": "$XXX", "notes": "Insurance premiums and copays"},
    {"category": "Dining Out", "monthly_cost": "$XXX", "notes": "Restaurants and takeout"},
    {"category": "Entertainment", "monthly_cost": "$XXX", "notes": "Movies, activities, subscriptions"}
  ],
  "salary_expectations": {
    "median_household_income": "$XX,XXX",
    "entry_level_range": "$XX,XXX - $XX,XXX",
    "experienced_range": "$XX,XXX - $XX,XXX",
    "cost_of_living_index": "XXX (US average = 100)"
  },
  "local_resources": [
    {"category": "Banking", "name": "Local Bank Name", "address": "123 Main St", "phone": "(555) 123-4567"},
    {"category": "Healthcare", "name": "Hospital/Clinic Name", "address": "456 Health Dr", "phone": "(555) 234-5678"},
    {"category": "Education", "name": "School District Name", "address": "789 Education Blvd", "phone": "(555) 345-6789"},
    {"category": "Utilities", "name": "Electric Company", "address": "321 Power St", "phone": "(555) 456-7890"},
    {"category": "Internet", "name": "ISP Provider", "address": "654 Tech Ave", "phone": "(555) 567-8901"}
  ],
  "tax_information": {
    "state_income_tax": "X.X% or No state tax",
    "sales_tax_rate": "X.X%",
    "property_tax_info": "Brief explanation of local property taxes"
  }
}

Use realistic estimates based on ${city}'s actual cost of living. Research current market rates and provide helpful, accurate information for someone planning to move there.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are a cost analysis expert. Return only valid JSON with realistic cost data for the specified city. No markdown formatting, no code blocks, just pure JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0].message.content.trim();
    console.log('🤖 Raw OpenAI response for costs:', content);

    // Parse the JSON response
    let costsData;
    try {
      costsData = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ Failed to parse costs JSON:', parseError);
      console.error('❌ Content that failed to parse:', content);
      throw new Error('Invalid JSON response from OpenAI for costs data');
    }

    // Validate the required structure
    if (!costsData.housing_costs || !costsData.living_expenses || !costsData.local_resources) {
      throw new Error('Incomplete costs data structure from OpenAI');
    }

    console.log('✅ Costs and resources data generated successfully');
    console.log('📊 Housing costs keys:', Object.keys(costsData.housing_costs));
    console.log('📊 Living expenses count:', costsData.living_expenses.length);
    console.log('📊 Local resources count:', costsData.local_resources.length);

    return costsData;

  } catch (error) {
    console.error('❌ Error generating costs and resources:', error);
    throw error;
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
