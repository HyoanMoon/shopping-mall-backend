const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const cartController = require("../controllers/cart.controller");



router.post("/", authController.authenticate, cartController.addItemToCart);













module.exports = router; //routes/index.js에서 쓸 수 있게 하기 위해