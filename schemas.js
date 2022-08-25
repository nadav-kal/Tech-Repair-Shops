const Joi = require('joi');

module.exports.techrepairSchema = Joi.object({
    techrepair: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        phone: Joi.number().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required()
    }).required()
})