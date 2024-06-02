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

userController.loginWithEmail = async (req,res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email},"-createdAt -updatedAt -__v");
        if(user){
            const isMatch = await bcrypt.compareSync(password, user.password); 
            if(isMatch){
                const token = await user.generateToken();
                return res.status(200).json({status:'Login Success!', user, token }); //응답으로 user와 토큰 보내준다. 
            }
        } 
        throw new Error(`Incorrect password for ${email}. Try again.`)
        

    }catch(error){
        res.status(400).json({status:'Fail..', message: error.message})
        
    }
}

userController.getUser = async (req,res) => {
    try{
        const {userId} = req
        const user = await User.findById(userId, "-updatedAt -__v");
        if(!user) {
            throw new Error("Cannot find User.")

        }
        res.status(200).json({status:'User id OK!', user })


    }catch(err) {
        res.status(400).json({status:'Fail..!', message: err.message})
        
    }

};




module.exports = userController;