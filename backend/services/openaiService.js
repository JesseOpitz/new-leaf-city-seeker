
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
    
    const prompt = `Create a comprehensive, personalized moving plan for someone relocating to ${city}. Use the following information about the person:

- Moving Date: ${questionnaire.movingDate}
- Budget: ${questionnaire.budget}
- Household Size: ${questionnaire.householdSize} people
- Income: ${questionnaire.income}
- Reason for Moving: ${questionnaire.reason}
${questionnaire.additionalInfo && questionnaire.additionalInfo.trim() 
  ? `
IMPORTANT: The user has provided additional personalization information:

"${questionnaire.additionalInfo}"

Use this user-provided context throughout the plan to personalize details, especially around neighborhood selection, budgeting, checklist items, and resources. This input is critical for tailoring the content.`
  : ''}

Generate the plan as clean, professional HTML with the following structured sections:

---

1. **Personalized Overview & Introduction**  
- A warm, welcoming opening  
- Address their reason for moving and how ${city} supports that  
- Highlight cultural/lifestyle factors  
- Offer high-level budget and timeline insights  
${questionnaire.additionalInfo ? '- Incorporate any user context provided into tone and suggestions' : ''}

---

2. **Pre-Move Checklist** (starts on a new PDF page)  
- Render 20+ checklist items  
- Each item on its own row using: ☐  
- Checklist should be inside a <div class="checklist-page-break"> wrapper  
- Personalize based on household size, moving date, income  
- Visually balanced and print-ready with spacing, borders, and headings  
${questionnaire.additionalInfo ? '- Include specific checklist items based on user notes' : ''}

Example checklist row:  
<div style="margin-bottom: 8px;">☐ Book movers 2–3 weeks before your move date</div>

---

3. **Cost Breakdown for ${city}**  
- Table format  
- Include: housing, transport, healthcare, food, utilities, insurance, emergency fund  
- Add estimated monthly total at bottom  
${questionnaire.additionalInfo ? '- Modify based on user expectations or financial context' : ''}

---

4. **30-60-90 Day Action Plan**  
- 30 Days Before: Prep tasks  
- Move Week: Key logistics  
- First 90 Days: Settling in, connecting locally  
- Format with clear subheadings  
${questionnaire.additionalInfo ? '- Adjust tasks/timing based on user-provided info' : ''}

---

5. **Local Resources in ${city}**  
- Table layout with: Type, Name, Website  
- Include: utilities, DMV, schools, banks, healthcare, LGBTQ+ groups  
- Use links when possible  
${questionnaire.additionalInfo ? '- Prioritize any services mentioned or implied in the user context' : ''}

---

6. **Hiring a Moving Company**  
- Tips for comparing moving companies  
- How to get quotes, licenses to check, red flags  
- How to choose between full-service, hybrid, and DIY  
- Include a short list of example nationwide movers (with links)

---

7. **Eco-Friendly Moving Tips**  
- How to reduce waste  
- Where to find sustainable moving supplies  
- Donation and recycling options before you move  
- Encourage digital docs, minimalism, and green transport options

---

8. **Satisfaction Guarantee** (final page only)  
- Centered, neatly styled light green box  
- Inside:  
<div style="max-width: 600px; margin: 40px auto; padding: 20px; background-color: #e6f4ea; border-radius: 10px; font-size: 16px; line-height: 1.5; text-align: center;">
  <h2 style="color: #2c5530; font-size: 22px; margin-bottom: 12px;">Our Satisfaction Guarantee</h2>  
  <p>We're confident you'll love your personalized plan. If you're not satisfied with your New Leaf moving plan for any reason, contact us at any time and we'll make it right, or refund you.</p>
</div>

---

### Formatting & Styling Requirements

- Return raw HTML only (no markdown formatting like \`\`\`)
- Use semantic HTML: <h1>, <h2>, <table>, <ul>, <p>, etc.
- Before each major section (Checklist, Cost, Action Plan, etc.) add:  
  <div style="page-break-before: always;"></div>
- For tables: use proper <thead>, <tr>, <th>, <td> layout
- Use inline CSS only where needed (for spacing, borders, layout)
- Prevent one or two lines leaking onto a new page — balance spacing
- Checklist: use aligned ☐ symbols  
- Final result must look clean, styled, and professional
- The tone should be warm, helpful, trustworthy, and practical
- Integrate user's additional info deeply across content, not just once
- Ensure visually pleasing layout and formatting in PDF rendering
- DO NOT return any markdown or triple-backtick code blocks

If later enhancements include a map screenshot:  
Add a placeholder where an <img src="{MAP_URL}"> tag could be inserted for city-level map thumbnails.

This will be delivered to a paying user. Assume it will be printed or emailed. Quality and layout matter.`;

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
