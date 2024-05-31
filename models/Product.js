const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const productSchema = Schema({
    sku : {
        type: String,
        required: true,
        unique: true
    },
    name : {
        type: String,
        required: true
    },
    image : {
        type: String,
        required: true
    },
    category : {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    stock : {
        type: Object,
        required : true
    },
    status : {
        type: String,
        default: "active"
    },
    isDeleted : {
        type: Boolean,
        default: false
    },
},{
    timestamps: true
}
);
productSchema.methods.toJSON =function(){
    const obj =  this._doc; //나중에 반환할 오브젝트에는: 전체 값을 받는다 
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;

    return obj 

}; // 언제든지 be -> fe 로 데이터를 보낼때 항상 저렇게 호출이 된다!!!!! 

const Product = mongoose.model("Product",productSchema);

module.exports = Product;

