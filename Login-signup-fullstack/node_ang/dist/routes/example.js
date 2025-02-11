"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleRouter = void 0;
// src/routes/example.ts
const express_1 = __importDefault(require("express"));
const example_1 = require("../controllers/example");
exports.exampleRouter = express_1.default.Router();
exports.exampleRouter.get('/', example_1.exampleController.getExample);
exports.exampleRouter.post('/', example_1.exampleController.postExample);
