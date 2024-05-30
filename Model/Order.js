const mongoose = require('mongoose');
const Product = require('./Product');
const User = require('./User');
const Schema = mongoose.Schema;



const orderSchema = Schema({
    oderNum: {
        type: String
        
    },
    shipTo : {
        type: Object,
        required: true
    
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: mongoose.ObjectId,
        ref: User
    },
    status: {
        type: String,
        default: "preparing"
    },

    orderItems : [{
        productId : {type : mongoose.ObjectId, ref:Product},
        size : {type: String, required: true},
        qty: {type: Number, default: 1, required: true},
        price: {type: Number, required: true}

    }]
    
},{
    timestamps: true
}
);
orderSchema.methods.toJSON =function(){
    const obj =  this._doc; //나중에 반환할 오브젝트에는: 전체 값을 받는다 
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;

    return obj 

}; // 언제든지 be -> fe 로 데이터를 보낼때 항상 저렇게 호출이 된다!!!!! 

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;

