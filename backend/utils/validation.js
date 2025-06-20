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
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Timeline is required',
        'string.max': 'Timeline is too long'
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

    household: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Household size is required',
        'string.max': 'Household size is too long'
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

    moveReason: Joi.string()
      .trim()
      .min(1)
      .max(500)
      .required()
      .messages({
        'string.empty': 'Reason for moving is required',
        'string.max': 'Reason is too long (max 500 characters)'
      }),

    hasChildren: Joi.boolean().optional(),
    hasPets: Joi.boolean().optional(),

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
  return planRequestSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });
};

module.exports = { validatePlanRequest };
