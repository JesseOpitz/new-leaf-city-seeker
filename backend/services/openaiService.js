
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.BACKEND_OPENAI_API_KEY,
});

const generateMovingPlan = async (city, questionnaire) => {
  try {
    console.log('🤖 Calling OpenAI API...');
    
    const prompt = `
Create a comprehensive, personalized moving plan for someone relocating to ${city}. Use the following information about the person:

- Moving Date: ${questionnaire.movingDate}
- Budget: ${questionnaire.budget}
- Household Size: ${questionnaire.householdSize} people
- Income: ${questionnaire.income}
- Reason for Moving: ${questionnaire.reason}

Generate a warm, helpful, and detailed moving plan formatted as clean HTML with the following sections:

1. **Personalized Overview & Introduction** (1000 words)
   - Welcome them personally to their journey to ${city}
   - Explain what to expect in the city based on their specific situation
   - Address their reason for moving and how ${city} can fulfill that
   - Discuss the city's culture, climate, and lifestyle
   - Provide high-level guidance for their timeline and budget

2. **Pre-Move Checklist**
   - Items specific to their household size and timeline
   - Financial preparations based on their income and budget
   - Important documents and records to gather
   - Tasks to complete before leaving their current location

3. **Cost Breakdown for ${city}**
   - Housing costs (rent/mortgage) relevant to their budget
   - Transportation expenses (car vs public transit)
   - Healthcare and insurance considerations
   - Food and dining costs
   - Utilities and internet
   - Entertainment and miscellaneous expenses
   - Emergency fund recommendations

4. **30-60-90 Day Action Plan**
   - 30 days before: Critical preparations
   - Move week: Step-by-step moving process
   - 90 days after: Settling in and establishing routines

5. **Local Resources for ${city}**
   - Utilities companies and setup procedures
   - Healthcare providers and clinics
   - Government services (DMV, voter registration, etc.)
   - Banks and financial services
   - Schools (if applicable for their household)
   - Community groups and networking opportunities
   - LGBTQ+ and women's resources (if available)

Format the response as semantic HTML with:
- Proper headings (h1, h2, h3)
- Organized lists and paragraphs
- Basic inline CSS for readability
- Warm, conversational tone (not robotic)
- Specific, actionable advice

The tone should be encouraging, practical, and personalized to their specific situation.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful moving specialist who creates detailed, personalized relocation plans. Always respond with well-formatted HTML that's ready for PDF conversion."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const planHTML = completion.choices[0].message.content;
    
    if (!planHTML || planHTML.trim().length < 100) {
      throw new Error('OpenAI returned insufficient content');
    }

    console.log('✅ OpenAI plan generated successfully');
    return planHTML;

  } catch (error) {
    console.error('❌ OpenAI service error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};

module.exports = { generateMovingPlan };
