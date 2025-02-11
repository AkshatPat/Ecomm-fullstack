"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleController = void 0;
exports.exampleController = {
    getExample: (req, res) => {
        res.json({ message: 'GET request to /api/example' });
    },
    postExample: (req, res) => {
        const { data } = req.body;
        res.json({ message: `POST request to /api/example with data: ${data}` });
    },
};
