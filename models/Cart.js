const mongoose = require('mongoose');
const User = require('./User');
const Product = require('./Product');
const Schema = mongoose.Schema;



const cartSchema = Schema({
    userId: {
        type: mongoose.ObjectId,
        ref: User

    },
    items: [{
        productId: { type: mongoose.ObjectId, ref: Product },
        size: { type: String, required: true },
        qty: { type: Number, default: 1, required: true }

    }]

}, {
    timestamps: true
}
);
cartSchema.methods.toJSON = function () {
    const obj = this._doc; //나중에 반환할 오브젝트에는: 전체 값을 받는다 
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;

    return obj

}; // 언제든지 be -> fe 로 데이터를 보낼때 항상 저렇게 호출이 된다!!!!! 

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

