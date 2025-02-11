"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const example_1 = require("./middlewares/example");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use((0, cors_1.default)({
    origin: "*"
}));
// Middleware
app.use(body_parser_1.default.json());
// app.use(cors());
// Apply the logging middleware to all routes
app.use(example_1.exampleMiddleware);
// API Routes
app.use('/api/', routes_1.default);
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
