const mongoose = require('mongoose');
const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Schema = mongoose.Schema;

const orderSchema = Schema({
    orderNum: {
        type: String
        
    },
    shipTo : {
        type: Object,
        required: true
    
    },
    contact: {
        type: Object,
        required: true,
        unique: false
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: mongoose.ObjectId,
        ref: User,
        required: true,
    },
    status: {
        type: String,
        default: "preparing"
    },

    orderItems : [{
        productId : {type : mongoose.ObjectId, ref:Product, required: true,},
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

orderSchema.post("save", async function(){ // save 후에(post) ~~
    // 카트를 비워주자!
    const cart = await Cart.findOne({userId: this.userId})
    cart.items = []
    await cart.save();

});

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;

