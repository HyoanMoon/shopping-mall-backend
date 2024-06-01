const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller")

// 1. 회원가입 // / <- URL로 들어왔을때 , userController.createUser 이 헹동을 해줘라!
router.post("/", userController.createUser);

//2. 로그인
router.post("/login", userController.loginWithEmail);












module.exports = router; //routes/index.js에서 쓸 수 있게 하기 위해