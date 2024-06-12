const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authController = require("../controllers/auth.controller");


router.post("/", authController.authenticate, orderController.createOrder);

router.get("/", authController.authenticate, orderController.getOrder)

router.get("/orderAdmin", authController.authenticate, authController.checkAdminPermission, orderController.getOrderList)

router.put("/:id", authController.authenticate, authController.checkAdminPermission, orderController.updateOrder  )






module.exports = router;
