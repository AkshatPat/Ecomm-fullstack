import Joi from "joi";

const createUserSchema = Joi.object({
    firstname: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    lastname: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string()
        .required(),          
})

const loginUserSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string()
        .required(),
})

const productSchema = Joi.object({
    productName: Joi.string().required(),
    productPrice: Joi.number().required()
})

const cartSchema = Joi.object({
    productId: Joi.number().required(),
    quantity: Joi.number().required(),
    productPrice: Joi.number().required()
})

export default {
    createUserSchema,
    loginUserSchema,
    productSchema,
    cartSchema
}