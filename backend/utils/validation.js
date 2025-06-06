
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
    movingDate: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Moving date is required',
        'string.max': 'Moving date is too long'
      }),
    
    budget: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Budget is required',
        'string.max': 'Budget description is too long'
      }),
    
    householdSize: Joi.number()
      .integer()
      .min(1)
      .max(20)
      .required()
      .messages({
        'number.base': 'Household size must be a number',
        'number.integer': 'Household size must be a whole number',
        'number.min': 'Household size must be at least 1',
        'number.max': 'Household size cannot exceed 20',
        'any.required': 'Household size is required'
      }),
    
    income: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Income is required',
        'string.max': 'Income description is too long'
      }),
    
    reason: Joi.string()
      .trim()
      .min(1)
      .max(500)
      .required()
      .messages({
        'string.empty': 'Reason for moving is required',
        'string.max': 'Reason is too long (max 500 characters)'
      })
  })
  .required()
  .messages({
    'any.required': 'Questionnaire data is required'
  })
});

const validatePlanRequest = (data) => {
  return planRequestSchema.validate(data, { 
    abortEarly: false,
    stripUnknown: true 
  });
};

module.exports = { validatePlanRequest };
