const express = require("express");
const authController = require("../controllers/auth.controller");
const productController = require("../controllers/product.controller");
const router = express.Router();




router.post("/",
authController.authenticate, // 토큰 값으로 유저 아이디 뽑아내서
authController.checkAdminPermission, // 어드민인지 확인하고 
productController.createProduct // 상품 재고정리로 넘어간다
);

router.get("/",productController.getProducts);

router.put("/:id",
authController.authenticate,
authController.checkAdminPermission,
productController.updateProduct);




module.exports = router;