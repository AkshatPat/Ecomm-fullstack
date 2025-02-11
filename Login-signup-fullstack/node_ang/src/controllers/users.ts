import { Request, Response } from "express";
import { connection } from "../config/database";
import validSchema from "./validate_schema";
import multer from "multer";
// import path from 'path';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = "userLogin";

// (((((((((((((((((((((((((((((((((((Login/Signup Valids)))))))))))))))))))))))))))))))))))

// Register User
const createUser = async (req: Request, res: Response) => {
  try {
    const { error } = validSchema.createUserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: error.details[0].message,
      });
    }
    if (error) throw error;
    console.log("Connected!");

    console.log(req.body);

    //check if the email already registered
    const checkEmailSql = `SELECT * FROM user WHERE email = "${req.body.email}"`;

    connection.query(checkEmailSql, async (err, result) => {
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
          message:
            "This email is already registered. Please use another email.",
        });
      }

      const secPass = await bcrypt.hash(req.body.password, 10);
      var sql = `INSERT INTO user (firstname, lastname, email, password) VALUES ("${req.body.firstname}", "${req.body.lastname}", "${req.body.email}", "${secPass}")`;

      connection.query(sql, function (err) {
        if (err)
          return res.status(400).json({
            code: 400,
            status: false,
            message: err,
          });
        else {
          const token = jwt.sign(
            { id: result.insertId, email: req.body.email },
            JWT_SECRET,
            { expiresIn: "1h" }
          );
          return res.status(200).json({
            code: 200,
            status: true,
            message: "User created successfully",
            token: token,
          });
        }
      });
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      status: false,
      message: error,
    });
  }
};

// Login User

const loginUser = async (req: Request, res: Response) => {
  try {
    const { error } = validSchema.loginUserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: error.details[0].message,
      });
    }

    // SQL query to find user by email
    const sql = `SELECT * FROM user WHERE email = "${req.body.email}"`;

    connection.query(sql, async (err, result) => {
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

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Invalid password",
        });
      }

      //JWT Sign
      const decode = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "24h",
      });

      return res.status(200).json({
        code: 200,
        status: true,
        message: "Login successful",
        token: decode,
        data: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
      });
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      status: false,
      message: error,
    });
  }
};

// GET Users List
const getUsersList = async (req: Request, res: Response) => {
  try {
    var sql = "select * from user";
    // console.log("user response",res);

    connection.query(sql, function (err, result) {
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
          data: result,
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      status: false,
      message: error,
    });
  }
};

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const fileFilterConfig = function (
  req: any,
  file: { mimetype: string },
  cb: (arg0: null, arg1: boolean) => void
) {
  if (file.mimetype.includes("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage: storageConfig,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilterConfig,
});

const uploadProduct = async (req: Request, res: Response) => {
  try {
    upload.single("productImg")(req, res, (err) => {
      if (err) {
        return res.status(400).send({ error: "File upload failed!" });
      }

      const { error } = validSchema.productSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: error.details[0].message,
        });
      }
      var sql = `Insert into products (productImg, productName, productPrice) values ('${req.file?.path.replace(/\\/g, "/")}', '${req.body.productName}', '${req.body.productPrice}')`;
      

      connection.query(sql, function (err, result) {
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
  } catch (error) {
    res.status(400).json({
      code: 400,
      status: false,
      message: error,
    });
  }
};

const getProductsList = async (req: Request, res: Response) => {
  try {
    var sql = "select * from products";
    connection.query(sql, function (err, result) {
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
          data: result,
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      status: false,
      message: error,
    });
  }
};

const cartProduct = async (req: Request, res: Response) => {
  // console.log(req.body);

  try {
    const data = {
      productId: req.body.productId,
      quantity: req.body.quantity,
      productPrice: req.body.productPrice,
    };
    const { error } = validSchema.cartSchema.validate(data);

    if (error) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: error.details[0].message,
      });
    }
    console.log("request body", req.body);
    var sql = `Insert into cart (custId, productId, quantity, productPrice) values ('${req.body.custId}','${req.body.productId}', '${req.body.quantity}', '${req.body.productPrice}')`;

    connection.query(sql, function (err, result) {
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
  } catch (error) {
    res.status(400).json({
      code: 400,
      status: false,
      message: error,
    });
  }
};

const getCartItems = async (req: Request, res: Response) => {
  try {
    console.log("req.params", req.query);
    const user = req.query.custId;

    var sql = `SELECT cart.id AS cartId, products.id, products.productName, products.productImg, cart.productPrice, cart.quantity FROM products INNER JOIN cart ON cart.productId=products.id WHERE cart.isActive = 1 AND cart.custId = ${user}`;

    connection.query(sql, (err, result) => {
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
  } catch (error) {
    res.status(400).json({
      code: 400,
      status: false,
      message: error,
    });
  }
};

const removeAllCartItems = async (req: Request, res: Response) => {
  try {
    var sql = `UPDATE cart SET isActive = 0`;

    connection.query(sql, (err, result) => {
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
  } catch (error) {
    res.status(400).json({
      code: 400,
      status: false,
      message: error,
    });
  }
};

const updateCartQuantity = async (req: Request, res: Response) => {
  try {
    var sql = `UPDATE cart SET quantity`;

    connection.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          status: false,
          message: "Cannot Update Quantity ",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "Product Quantity Updated ",
        });
      }

      return res.status(200).json({
        code: 200,
        status: true,
        message: "Cart item fetched successfully!",
        data: result,
      });
    });
  } catch (error) {}
};

export default {
  createUser,
  getUsersList,
  loginUser,
  uploadProduct,
  getProductsList,
  cartProduct,
  getCartItems,
  removeAllCartItems,
  updateCartQuantity,
};
