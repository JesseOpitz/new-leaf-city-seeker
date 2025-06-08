
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.BACKEND_OPENAI_API_KEY,
});

const generateMovingPlan = async (city, questionnaire) => {
  try {
    console.log('🤖 =========================');
    console.log('🤖 OPENAI SERVICE START');
    console.log('🤖 =========================');
    console.log('🤖 OpenAI API Key present:', !!process.env.BACKEND_OPENAI_API_KEY);
    console.log('🤖 OpenAI API Key length:', process.env.BACKEND_OPENAI_API_KEY?.length || 0);
    console.log('🤖 City:', city);
    console.log('🤖 Questionnaire:', JSON.stringify(questionnaire, null, 2));
    
    const prompt = `
Create a comprehensive, professional, and fully personalized moving plan for someone relocating to ${city}. Use the following information about the person:

- Moving Date: ${questionnaire.movingDate}
- Budget: ${questionnaire.budget}
- Household Size: ${questionnaire.householdSize} people
- Income: ${questionnaire.income}
- Reason for Moving: ${questionnaire.reason}
${questionnaire.additionalInfo ? `
- Additional Context: ${questionnaire.additionalInfo}

IMPORTANT: The user has provided additional personalization information. This must be used heavily throughout every section to guide tone, recommendations, resources, and adjustments in detail. Mention it often and let it shape the voice of the plan.` : ''}

Your output must be raw, production-grade HTML with clear formatting and structured layout, designed to be converted into a polished PDF. Each major section should fill approximately **one full A4 PDF page**, using detailed writing (around 800–1000 words per section), organized layout, and formatting balance.

---

### Sections to Include (1 page each minimum):

1. **Personalized Welcome & Overview**
   - Warm, detailed welcome to their new journey in ${city}
   - Overview of city culture, climate, and lifestyle tailored to their reason for moving
   - Touch on how this move fits their life stage, budget, and aspirations
   - Use storytelling to build excitement
   - Format using headings and paragraphs

<div style="page-break-before: always;"></div>

2. **Pre-Move Checklist**
   - List at least 20 tailored tasks (based on family size, budget, timeline)
   - Each task should appear as a line item with an empty checkbox ☐
   - Include headers like "Documents to Prepare", "Home Prep", "Financial To-Dos"
   - Format it like a print-ready form using borders or shading (but keep it minimal)
   - Wrap in a <div class="checklist-page-break"> for rendering isolation
   ${questionnaire.additionalInfo ? 'Incorporate custom checklist items based on the additional user details.' : ''}

<div style="page-break-before: always;"></div>

3. **Detailed Cost of Living in ${city}**
   - Table layout: housing, transit, utilities, food, internet, healthcare, misc.
   - Use user's budget + income to tailor insights
   - Include footnotes for sources and estimated ranges
   - End the table with a row showing a **Total Monthly Estimate**
   - Add 1–2 paragraphs interpreting what this means for their budget and lifestyle

<div style="page-break-before: always;"></div>

4. **Moving Companies & Transportation Options**
   - List 3–5 reputable moving companies that service ${city} (real or example names)
   - Include comparison of full-service, container-based (like PODS), and self-move
   - Explain insurance, timing tips, and what to ask when hiring
   - Tailor recommendations for their budget and timeline
   - Include external links if possible

<div style="page-break-before: always;"></div>

5. **30-60-90 Day Relocation Plan**
   - Break down tasks and mindset shifts at 30 days before, during move week, and 30–90 days after
   - Use numbered lists and headers
   - Focus on managing stress, setting up services, meeting locals, and feeling "at home"
   - Include motivation tips and short check-ins

<div style="page-break-before: always;"></div>

6. **Local Services & Community in ${city}**
   - List utility companies, banks, healthcare, schools, DMV, voter registration
   - Table format: columns for Service Type, Provider Name, Setup Info (or URL)
   - Add neighborhood suggestions for families, remote workers, LGBTQ+ residents (if applicable)
   - Tailor recommendations based on reason for moving and additional info

<div style="page-break-before: always;"></div>

7. **Eco-Conscious Moving Tips**
   - Write a full section on minimizing waste, choosing green moving options, donating, recycling
   - Explain how to reduce carbon footprint while relocating
   - Include example sustainable moving companies or platforms
   - Add a short "Eco Moving Checklist" at the bottom

<div style="page-break-before: always;"></div>

8. **Satisfaction Guarantee**
   - Centered section on final page
   - Place this in a light green box with neat padding and fixed width (~600px max)
   - Use this text:
     > We're confident you'll love your personalized plan. If you're not satisfied with your New Leaf moving plan for any reason, contact us at any time and we'll make it right — or refund you.

---

### Formatting & Output Rules:

- **Every section must fill approximately one full PDF page** – use word count (~800–1000 words), spacing, and layout awareness.
- **Avoid overly short sections. Never let sections end with only 1–2 lines on a page.**
- Do not include any \`\`\`html or markdown syntax
- Format with \`<h1>\`, \`<h2>\`, \`<p>\`, \`<ul>\`, and \`<table>\` as needed
- Use \`<div style="page-break-before: always;"></div>\` before each major section
- Use inline CSS sparingly but smartly (e.g., borders, spacing, background for boxes)
- Do not output anything that is not pure HTML
- Write as if the final product is being handed to a paying customer. It must be professional, polished, personal, and print-ready.
- Always reflect any personal context or extra notes the user has provided

DO NOT wrap or mark the HTML content as code. Just return valid HTML.
`;

    console.log('🤖 Prompt length:', prompt.length);
    console.log('🤖 Making OpenAI API call...');

    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful moving specialist who creates detailed, personalized relocation plans. Always respond with well-formatted HTML that's ready for PDF conversion. Pay special attention to any user-provided additional information and use it extensively throughout the plan to create a truly personalized experience."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    console.log('🤖 OpenAI API response received');
    console.log('🤖 Response object keys:', Object.keys(completion));
    console.log('🤖 Choices array length:', completion.choices?.length || 0);

    let planHTML = completion.choices[0]?.message?.content || '';
    planHTML = planHTML.replace(/^```html\s*/i, '').replace(/```$/, '').trim();

    
    console.log('🤖 Generated content length:', planHTML?.length || 0);
    console.log('🤖 Generated content preview (first 200 chars):', planHTML?.substring(0, 200) || 'NO CONTENT');
    
    if (!planHTML || planHTML.trim().length < 100) {
      console.error('❌ OpenAI returned insufficient content');
      console.error('❌ Full response:', JSON.stringify(completion, null, 2));
      throw new Error('OpenAI returned insufficient content');
    }

    console.log('✅ OpenAI plan generated successfully');
    console.log('🤖 =========================');
    console.log('🤖 OPENAI SERVICE END');
    console.log('🤖 =========================');
    
    return planHTML;

  } catch (error) {
    console.error('❌ =========================');
    console.error('❌ OPENAI SERVICE ERROR');
    console.error('❌ =========================');
    console.error('❌ Error type:', error.constructor.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error status:', error.status);
    console.error('❌ Error code:', error.code);
    console.error('❌ Full error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};

module.exports = { generateMovingPlan };
