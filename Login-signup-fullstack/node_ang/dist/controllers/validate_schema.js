"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const createUserSchema = joi_1.default.object({
    firstname: joi_1.default.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    lastname: joi_1.default.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: joi_1.default.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi_1.default.string()
        .required(),
});
const loginUserSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi_1.default.string()
        .required(),
});
const productSchema = joi_1.default.object({
    productName: joi_1.default.string().required(),
    productPrice: joi_1.default.number().required()
});
const cartSchema = joi_1.default.object({
    productId: joi_1.default.number().required(),
    quantity: joi_1.default.number().required(),
    productPrice: joi_1.default.number().required()
});
exports.default = {
    createUserSchema,
    loginUserSchema,
    productSchema,
    cartSchema
};
