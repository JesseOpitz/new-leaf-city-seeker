
const fs = require('fs').promises;
const path = require('path');

// Simple template engine using string replacement
const renderTemplate = (templateContent, data) => {
  let rendered = templateContent;
  
  // Handle simple variables like {{variable_name}}
  rendered = rendered.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    
    // Handle nested object access like {{data.property}}
    if (trimmedKey.includes('.')) {
      const keys = trimmedKey.split('.');
      let value = data;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
      return value !== undefined ? value : match;
    }
    
    return data[trimmedKey] !== undefined ? data[trimmedKey] : match;
  });
  
  // Handle array iterations like {{#each array}}
  rendered = rendered.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, content) => {
    const array = data[arrayName.trim()];
    if (!Array.isArray(array)) return '';
    
    return array.map((item, index) => {
      let itemContent = content;
      
      // Replace {{this}} with current item if it's a string
      if (typeof item === 'string') {
        itemContent = itemContent.replace(/\{\{this\}\}/g, item);
      } else if (typeof item === 'object') {
        // Replace {{property}} with item.property
        itemContent = itemContent.replace(/\{\{([^}]+)\}\}/g, (propMatch, propKey) => {
          const trimmedPropKey = propKey.trim();
          if (trimmedPropKey === 'this') return item;
          if (trimmedPropKey.startsWith('../')) {
            // Handle parent context access
            const parentKey = trimmedPropKey.substring(3);
            return data[parentKey] !== undefined ? data[parentKey] : propMatch;
          }
          return item[trimmedPropKey] !== undefined ? item[trimmedPropKey] : propMatch;
        });
      }
      
      return itemContent;
    }).join('');
  });
  
  // Handle conditional blocks like {{#if condition}}
  rendered = rendered.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
    const conditionValue = data[condition.trim()];
    return conditionValue ? content : '';
  });
  
  return rendered;
};

const loadTemplate = async (templateName) => {
  const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
  try {
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    return templateContent;
  } catch (error) {
    console.error(`❌ Error loading template ${templateName}:`, error);
    throw new Error(`Template ${templateName} not found`);
  }
};

const generateFromTemplate = async (templateName, data) => {
  try {
    console.log(`📄 Loading template: ${templateName}`);
    const template = await loadTemplate(templateName);
    
    console.log(`🔄 Rendering template with data keys: ${Object.keys(data).join(', ')}`);
    const rendered = renderTemplate(template, data);
    
    console.log(`✅ Template ${templateName} rendered successfully`);
    return rendered;
  } catch (error) {
    console.error(`❌ Error generating from template ${templateName}:`, error);
    throw error;
  }
};

// Validation functions
const validateWeatherData = (weatherData) => {
  if (!Array.isArray(weatherData) || weatherData.length !== 12) {
    console.warn(`⚠️ Weather data incomplete: ${weatherData?.length || 0}/12 months`);
    return false;
  }
  
  const requiredFields = ['month', 'high_temp', 'low_temp', 'precipitation', 'description'];
  for (const month of weatherData) {
    for (const field of requiredFields) {
      if (!month[field]) {
        console.warn(`⚠️ Weather data missing ${field} for ${month.month || 'unknown month'}`);
        return false;
      }
    }
  }
  
  return true;
};

const validateProduceData = (produceData) => {
  if (!Array.isArray(produceData) || produceData.length !== 12) {
    console.warn(`⚠️ Produce data incomplete: ${produceData?.length || 0}/12 months`);
    return false;
  }
  
  for (const month of produceData) {
    if (!month.produce_list || month.produce_list.split(',').length < 5) {
      console.warn(`⚠️ Produce data insufficient for ${month.month || 'unknown month'}`);
      return false;
    }
  }
  
  return true;
};

const validateTimelineData = (timelinePhases) => {
  if (!Array.isArray(timelinePhases) || timelinePhases.length < 3) {
    console.warn(`⚠️ Timeline data incomplete: ${timelinePhases?.length || 0}/3+ phases`);
    return false;
  }
  
  for (const phase of timelinePhases) {
    if (!phase.tasks || !Array.isArray(phase.tasks) || phase.tasks.length < 5) {
      console.warn(`⚠️ Timeline phase "${phase.phase_title}" has insufficient tasks: ${phase.tasks?.length || 0}/5+`);
      return false;
    }
  }
  
  return true;
};

const validateChecklistData = (checklistItems) => {
  if (!Array.isArray(checklistItems) || checklistItems.length < 20) {
    console.warn(`⚠️ Checklist data incomplete: ${checklistItems?.length || 0}/20+ items`);
    return false;
  }
  
  const requiredFields = ['task', 'category', 'priority'];
  for (const item of checklistItems) {
    for (const field of requiredFields) {
      if (!item[field]) {
        console.warn(`⚠️ Checklist item missing ${field}`);
        return false;
      }
    }
  }
  
  return true;
};

// Fallback data generators
const generateFallbackWeatherData = (city) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  return months.map(month => ({
    month,
    high_temp: 'Data coming soon',
    low_temp: 'Data coming soon',
    precipitation: 'Data coming soon',
    description: `Weather information for ${month} in ${city} will be available soon.`
  }));
};

const generateFallbackProduceData = (city) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  return months.map(month => ({
    month,
    produce_list: 'Seasonal produce information coming soon',
    specialties: `Local specialties for ${month} in ${city} will be available soon.`
  }));
};

const generateFallbackTimelineData = () => {
  return [
    {
      phase_title: '30 Days Before Move',
      description: 'Essential preparation tasks for your upcoming move.',
      tasks: [
        'More detailed timeline information coming soon',
        'Contact moving companies for quotes',
        'Begin decluttering and organizing belongings',
        'Research schools and services in your new city',
        'Start collecting important documents'
      ]
    },
    {
      phase_title: '1 Week Before Move',
      description: 'Final preparations for moving week.',
      tasks: [
        'More detailed timeline information coming soon',
        'Confirm moving day logistics',
        'Pack essential items separately',
        'Notify final services of address change',
        'Prepare moving day survival kit'
      ]
    },
    {
      phase_title: 'First Week After Move',
      description: 'Getting settled in your new home.',
      tasks: [
        'More detailed timeline information coming soon',
        'Set up essential utilities and services',
        'Register with local government offices',
        'Find nearby grocery stores and pharmacies',
        'Explore your new neighborhood'
      ]
    }
  ];
};

module.exports = {
  generateFromTemplate,
  validateWeatherData,
  validateProduceData,
  validateTimelineData,
  validateChecklistData,
  generateFallbackWeatherData,
  generateFallbackProduceData,
  generateFallbackTimelineData
};
