
const Joi = require('joi');

const planRequestSchema = Joi.object({
  city: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'City is required',
      'string.min': 'City must be at least 2 characters',
      'string.max': 'City must not exceed 100 characters'
    }),

  email: Joi.string()
    .email()
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.email': 'Please provide a valid email address'
    }),

  questionnaire: Joi.object({
    timeline: Joi.string()
      .valid('0-3', '3-6', '6-12', '12+', 'not-sure', 'prefer-not-to-say')
      .required()
      .messages({
        'string.empty': 'Timeline is required',
        'any.only': 'Timeline must be one of: 0-3, 3-6, 6-12, 12+, not-sure, prefer-not-to-say'
      }),

    budget: Joi.string()
      .valid('under-1000', '1000-3000', '3000-5000', '5000-10000', '10000+', 'prefer-not-to-say')
      .required()
      .messages({
        'string.empty': 'Budget is required',
        'any.only': 'Budget must be one of: under-1000, 1000-3000, 3000-5000, 5000-10000, 10000+, prefer-not-to-say'
      }),

    household: Joi.string()
      .valid('just-me', '2', '3-4', '5+', 'prefer-not-to-say')
      .required()
      .messages({
        'string.empty': 'Household size is required',
        'any.only': 'Household size must be one of: just-me, 2, 3-4, 5+, prefer-not-to-say'
      }),

    income: Joi.string()
      .valid('under-50k', '50k-100k', '100k-150k', '150k+', 'prefer-not-to-say')
      .required()
      .messages({
        'string.empty': 'Income is required',
        'any.only': 'Income must be one of: under-50k, 50k-100k, 100k-150k, 150k+, prefer-not-to-say'
      }),

    moveReason: Joi.string()
      .valid('job', 'family', 'lifestyle', 'retirement', 'education', 'other', 'prefer-not-to-say')
      .required()
      .messages({
        'string.empty': 'Reason for moving is required',
        'any.only': 'Move reason must be one of: job, family, lifestyle, retirement, education, other, prefer-not-to-say'
      }),

    hasChildren: Joi.string()
      .valid('yes', 'no', 'prefer-not-to-say')
      .required()
      .messages({
        'string.empty': 'Children status is required',
        'any.only': 'Children status must be one of: yes, no, prefer-not-to-say'
      }),

    hasPets: Joi.string()
      .valid('yes', 'no', 'prefer-not-to-say')
      .required()
      .messages({
        'string.empty': 'Pets status is required',
        'any.only': 'Pets status must be one of: yes, no, prefer-not-to-say'
      }),

    additionalInfo: Joi.string()
      .allow('')
      .max(1000)
      .optional()
      .messages({
        'string.max': 'Additional information is too long (max 1000 characters)'
      })
  })
    .required()
    .messages({
      'any.required': 'Questionnaire data is required'
    })
});

const validatePlanRequest = (data) => {
  const result = planRequestSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });
  
  // Add detailed logging for validation debugging
  if (result.error) {
    console.log('❌ VALIDATION FAILED:');
    console.log('📝 Input data:', JSON.stringify(data, null, 2));
    console.log('🚫 Validation errors:', result.error.details.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      value: err.context?.value
    })));
  } else {
    console.log('✅ VALIDATION PASSED');
    console.log('📝 Validated data:', JSON.stringify(result.value, null, 2));
  }
  
  return result;
};

module.exports = { validatePlanRequest };
