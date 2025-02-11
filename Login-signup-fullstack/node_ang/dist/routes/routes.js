"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("../controllers/users"));
const routes = express_1.default.Router();
routes.post("/create-user", users_1.default.createUser);
routes.post("/login-user", users_1.default.loginUser);
routes.get("/users-list", users_1.default.getUsersList);
routes.post("/upload-product", users_1.default.uploadProduct);
routes.get("/product-list", users_1.default.getProductsList);
routes.post("/cart-product", users_1.default.cartProduct);
routes.get("/cart-items", users_1.default.getCartItems);
routes.get("/remove-item", users_1.default.removeAllCartItems);
module.exports = routes;
