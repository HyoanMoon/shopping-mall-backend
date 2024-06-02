const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config() // node.js에서 .env 파일을 읽어오는 방식
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const authController = {};

authController.authenticate = async (req,res,next) => {
    try{
        const tokenString = req.headers.authorization 
        if (!tokenString) {
            throw new Error("invalide token")
        } 
        const token =tokenString.replace("Bearer ","") //Bearer을 떼고 순수한 토큰 값만 저장.

        jwt.verify(token, JWT_SECRET_KEY, (error,payload)=> {  //payload 해독이 끝난 값.
            if(error){
                throw new Error("invalide token")
            }
            req.userId = payload._id; // 요청에 userId (payload._id)를 붙여서 다음 함수에 보내는것
            
        });
        next();

    } catch(error){
        res.status(400).json({status:'Fail..', message: error.message})
    }
};

module.exports = authController;