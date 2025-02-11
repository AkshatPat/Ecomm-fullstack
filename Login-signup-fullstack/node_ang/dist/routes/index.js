"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
// src/routes/index.ts
const express_1 = __importDefault(require("express"));
const example_1 = require("./example");
const example_2 = require("../middlewares/example");
exports.apiRouter = express_1.default.Router();
// Apply the logging middleware to all routes in this router
exports.apiRouter.use(example_2.exampleMiddleware);
exports.apiRouter.use('/example', example_1.exampleRouter);
