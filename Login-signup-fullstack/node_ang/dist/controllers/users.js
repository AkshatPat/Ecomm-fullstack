"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const database_1 = require("../config/database");
const validate_schema_1 = __importDefault(require("./validate_schema"));
const multer_1 = __importDefault(require("multer"));
// import path from 'path';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const JWT_SECRET = "userLogin";
// (((((((((((((((((((((((((((((((((((Login/Signup Valids)))))))))))))))))))))))))))))))))))
// Register User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = validate_schema_1.default.createUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: error.details[0].message,
            });
        }
        if (error)
            throw error;
        console.log("Connected!");
        console.log(req.body);
        //check if the email already registered 
        const checkEmailSql = `SELECT * FROM user WHERE email = "${req.body.email}"`;
        database_1.connection.query(checkEmailSql, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(500).json({
                    code: 500,
                    status: false,
                    message: "Database error occurred while checking email.",
                });
            }
            if (result.length > 0) {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: "This email is already registered. Please use another email.",
                });
            }
            const secPass = yield bcrypt_1.default.hash(req.body.password, 10);
            var sql = `INSERT INTO user (firstname, lastname, email, password) VALUES ("${req.body.firstname}", "${req.body.lastname}", "${req.body.email}", "${secPass}")`;
            database_1.connection.query(sql, function (err) {
                if (err)
                    return res.status(400).json({
                        code: 400,
                        status: false,
                        message: err,
                    });
                else {
                    const token = jsonwebtoken_1.default.sign({ id: result.insertId, email: req.body.email }, JWT_SECRET, { expiresIn: '1h' });
                    return res.status(200).json({
                        code: 200,
                        status: true,
                        message: "User created successfully",
                        token: token
                    });
                }
            });
        }));
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            status: false,
            message: error
        });
    }
});
// Login User 
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = validate_schema_1.default.loginUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: error.details[0].message,
            });
        }
        // SQL query to find user by email
        const sql = `SELECT * FROM user WHERE email = "${req.body.email}"`;
        database_1.connection.query(sql, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: err.message,
                });
            }
            if (result.length === 0) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: "User not found",
                });
            }
            // Password Check
            const user = result[0];
            const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: "Invalid password",
                });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '10m' });
            return res.status(200).json({
                code: 200,
                status: true,
                message: "Login successful",
                token: token,
                data: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                },
            });
        }));
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            status: false,
            message: error
        });
    }
});
// GET Users List
const getUsersList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var sql = "select * from user";
        // console.log("user response",res);
        database_1.connection.query(sql, function (err, result) {
            if (err)
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: err,
                });
            else {
                return res.status(200).json({
                    code: 200,
                    status: true,
                    message: "Users fetched successfully!",
                    data: result
                });
            }
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            status: false,
            message: error
        });
    }
});
const storageConfig = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
// multer.diskStorage({
//   destination: function (req, file, cb) {
//      cb(null, 'public/milestones');
//   },
//   filename: function (req, file, cb) {
//      cb(null, Date.now() + '-' + file.originalname);
//   }
// });
const fileFilterConfig = function (req, file, cb) {
    if (file.mimetype.includes("image")) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.upload = (0, multer_1.default)({
    storage: storageConfig,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilterConfig,
});
const uploadProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.upload.single('productImg')(req, res, (err) => {
            var _a;
            if (err) {
                return res.status(400).send({ error: 'File upload failed!' });
            }
            const { error } = validate_schema_1.default.productSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: error.details[0].message,
                });
            }
            var sql = `Insert into products (productImg, productName, productPrice) values ('${(_a = req.file) === null || _a === void 0 ? void 0 : _a.path.replace(/\\/g, '/')}', '${req.body.productName}', '${req.body.productPrice}')`;
            // console.log(req.file);
            // console.log(req.body);
            database_1.connection.query(sql, function (err, result) {
                if (err)
                    return res.status(400).json({
                        code: 400,
                        status: false,
                        message: err,
                    });
                else {
                    return res.status(200).json({
                        code: 200,
                        status: true,
                        message: "Product Created successfully!",
                        data: result,
                    });
                }
            });
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            status: false,
            message: error
        });
    }
});
const getProductsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var sql = 'select * from products';
        database_1.connection.query(sql, function (err, result) {
            if (err)
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: err,
                });
            else {
                return res.status(200).json({
                    code: 200,
                    status: true,
                    message: "Products fetched successfully!",
                    data: result
                });
            }
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            status: false,
            message: error
        });
    }
});
const cartProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    try {
        const data = {
            productId: req.body.productId,
            quantity: req.body.quantity,
            productPrice: req.body.productPrice
        };
        const { error } = validate_schema_1.default.cartSchema.validate(data);
        if (error) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: error.details[0].message,
            });
        }
        console.log("request body", req.body);
        var sql = `Insert into cart (custId, productId, quantity, productPrice) values ('${req.body.custId}','${req.body.productId}', '${req.body.quantity}', '${req.body.productPrice}')`;
        database_1.connection.query(sql, function (err, result) {
            // console.log("cart products", req.body);
            if (err)
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: err,
                });
            else {
                return res.status(200).json({
                    code: 200,
                    status: true,
                    message: "Product added to cart successfully!",
                    data: result,
                });
            }
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            status: false,
            message: error
        });
    }
});
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.params", req.query);
        const user = req.query.custId;
        var sql = `SELECT cart.id AS cartId, products.id, products.productName, products.productImg, cart.productPrice, cart.quantity FROM products INNER JOIN cart ON cart.productId=products.id WHERE cart.isActive = 1 AND cart.custId = ${user}`;
        database_1.connection.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({
                    code: 500,
                    status: false,
                    message: "Database error occurred.",
                });
            }
            if (result.length === 0) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: "No item found in the cart with the given product ID.",
                });
            }
            return res.status(200).json({
                code: 200,
                status: true,
                message: "Cart item fetched successfully!",
                data: result,
            });
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            status: false,
            message: error
        });
    }
});
const removeAllCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var sql = 'UPDATE cart SET isActive = 0';
        database_1.connection.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({
                    code: 500,
                    status: false,
                    message: "Database error occurred.",
                });
            }
            if (result.length === 0) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: "No item found in the cart with the given product ID.",
                });
            }
            return res.status(200).json({
                code: 200,
                status: true,
                message: "Cart item fetched successfully!",
                data: result,
            });
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            status: false,
            message: error
        });
    }
});
exports.default = {
    createUser,
    getUsersList,
    loginUser,
    uploadProduct,
    getProductsList,
    cartProduct,
    getCartItems,
    removeAllCartItems
};
