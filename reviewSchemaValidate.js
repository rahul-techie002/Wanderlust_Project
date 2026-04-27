const Joi = require('joi');


const reviewSchemaValidator =  Joi.object({
    review: Joi.object({
        comment: Joi.string().required(), 
        rating: Joi.number().required().min(1).max(5),
    }).required()
});

module.exports = reviewSchemaValidator;


































