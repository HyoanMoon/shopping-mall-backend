const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { response } = require("express");
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const userController = {}; //userController 라는 객체

userController.createUser = async (req, res) => {

    try {
        let { email, password, name, level } = req.body;
        const existingUser = await User.findOne({ email }) // 키와 값이 동일하니까 한번만
        if (existingUser) {
            throw new Error('Email is already in use')
        }
        const salt = await bcrypt.genSaltSync(10); // email , name, password 저장 하기 전에 password를 암호화 해서 저장 해주기. 
        password = await bcrypt.hash(password, salt)

        const newUser = new User({ email, password, name, level: level ? level : "customer" });
        await newUser.save();

        return res.status(200).json({ status: 'Sign up success!' });

    } catch (error) {
        res.status(400).json({ status: 'Fail..', message: error.message });

    }

}

userController.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }, "-createdAt -updatedAt -__v");
        if (user) {
            const isMatch = await bcrypt.compareSync(password, user.password);
            if (isMatch) {
                const token = await user.generateToken();
                return res.status(200).json({ status: 'Login Success!', user, token }); //응답으로 user와 토큰 보내준다. 
            }
        }
        throw new Error(`Incorrect password for ${email}. Try again.`)


    } catch (error) {
        res.status(400).json({ status: 'Fail..', message: error.message })

    }
};

userController.loginWithGoogle = async (req, res) => {
    // 토큰값을 읽어와서 =>  유저 정보 빼내고 email 같은
    try {
        const { token } = req.body;
        const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        })
        const { email, name } = ticket.getPayload()
        console.log("eee", email, name);
        let user = await User.findOne({ email })

        if (!user) {
            const randomPassword = "" + Math.floor(Math.random() * 100000000)
            const salt = await bcrypt.genSaltSync(10);
            const newPassword = await bcrypt.hash(randomPassword, salt)
            user = new User({
                name,
                email,
                password: newPassword
            })
            await user.save();
        }

        const sessionToken = await user.generateToken()
        res.status(200).json({ status: "Login Success!", user, token: sessionToken })


    } catch (error) {
        res.status(400).json({ status: 'Fail..', message: error.message })
    }
};





userController.getUser = async (req, res) => {
    try {
        const { userId } = req
        const user = await User.findById(userId, "-updatedAt -__v");
        if (!user) {
            throw new Error("Cannot find User.")

        }
        res.status(200).json({ status: 'User id OK!', user })


    } catch (err) {
        res.status(400).json({ status: 'Fail..!', message: err.message })

    }

};




module.exports = userController;