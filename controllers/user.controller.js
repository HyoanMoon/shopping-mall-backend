const User = require("../models/User");
const bcrypt = require('bcryptjs');
const userController = {}; //userController 라는 객체

userController.createUser = async (req,res) =>{

    try{
        let {email,password,name,level} = req.body;
        const existingUser = await User.findOne({email}) // 키와 값이 동일하니까 한번만
        if(existingUser) {
            throw new Error('Email is already in use')
        }
        const salt = await bcrypt.genSaltSync(10); // email , name, password 저장 하기 전에 password를 암호화 해서 저장 해주기. 
        password = await bcrypt.hash(password,salt)
        
        const newUser = new User({email,password,name,level:level ? level : "customer"});
        await newUser.save();
        
        return res.status(200).json({status:'Sign up success!'});

    }catch(error){
        res.status(400).json({status:'Fail..', message: error.message});

    }

}




module.exports = userController;