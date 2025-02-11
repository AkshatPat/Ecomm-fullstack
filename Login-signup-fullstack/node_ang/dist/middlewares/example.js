"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleMiddleware = void 0;
const exampleMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};
exports.exampleMiddleware = exampleMiddleware;
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// const JWT_SECRET = "your_secret_key"; // Use environment variable in production
// const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) {
//     return res.status(401).json({ message: "Access denied. No token provided." });
//   }
//   jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
//     if (err) {
//       return res.status(403).json({ message: "Invalid token." });
//     }
//     req.user = user;
//     next();
//   });
// };
// export default authenticateToken;
