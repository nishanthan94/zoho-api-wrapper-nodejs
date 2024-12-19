const Joi = require('joi');

const paramsSchema = Joi.object({
    portalId: Joi.string().required().messages({
        'string.empty': 'Portal ID is required',
        'any.required': 'Portal ID is required',
    }),
});

const bodySchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Project name is required',
        'any.required': 'Project name is required',
    }),
    description: Joi.string().allow('', null),
    start_date: Joi.date().iso().messages({
        'date.format': 'Start date must be in YYYY-MM-DD format',
    }),
    end_date: Joi.date().iso().greater(Joi.ref('start_date')).messages({
        'date.format': 'End date must be in YYYY-MM-DD format',
        'date.greater': 'End date must be greater than start date',
    }),
    strict_project: Joi.string(),
    currency: Joi.string(),
});

const projectSchema = Joi.object({
    portalId: Joi.string().required().messages({
        'string.empty': 'Portal ID is required',
        'any.required': 'Portal ID is required',
    }),
    projectId: Joi.string().required().messages({
        'string.empty': 'Portal ID is required',
        'any.required': 'Portal ID is required',
    }),
});

module.exports = { paramsSchema, bodySchema, projectSchema };
