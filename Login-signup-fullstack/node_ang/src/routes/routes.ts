import express from "express";
import userController from "../controllers/users";

const routes = express.Router();

routes.post("/create-user", userController.createUser);

routes.post("/login-user", userController.loginUser);

routes.get("/users-list", userController.getUsersList);

routes.post("/upload-product", userController.uploadProduct);

routes.get("/product-list", userController.getProductsList);

routes.post("/cart-product", userController.cartProduct);

routes.get("/cart-items", userController.getCartItems);

routes.get("/remove-item/:id", userController.removeAllCartItems);

routes.post("/cart-product-quantity", userController.updateCartQuantity);

export = routes;