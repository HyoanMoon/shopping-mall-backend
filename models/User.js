const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
require ('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY



const userSchema = Schema({
    name : {
        type: String,
        required: true,
    
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        
    },
    level : {
        type: String,
        default: "customer" // 2types : cx & admin 
    }
},{
    timestamps: true
}
);
userSchema.methods.toJSON =function(){
    const obj =  this._doc; //나중에 반환할 오브젝트에는: 전체 값을 받는다 
    delete obj.password; //전체에서 password는 빼고!
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;

    return obj 

}; // 언제든지 be -> fe 로 데이터를 보낼때 항상 저렇게 호출이 된다!!!!! 

userSchema.methods.generateToken = function(){
    const token = jwt.sign({_id : this._id}, JWT_SECRET_KEY,{expiresIn:"1d"} );
    return token;
}

const User = mongoose.model("User",userSchema);

module.exports = User;

