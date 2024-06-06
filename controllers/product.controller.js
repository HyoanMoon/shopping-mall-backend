const Product = require("../models/Product");

const productController = {};

productController.createProduct = async (req,res) => {
    try{
        const {sku,name,size,image,category,description,price, stock, status } = req.body;
        const product = new Product({
            sku,
            name,
            size,
            image,
            category,
            description,
            price,
            stock,
            status 
        });
        await product.save();
        return res.status(200).json({status:'Success', product});


    }catch(error){
        res.status(400).json({status:'Fail..', message: error.message});

    }

}
productController.getProducts = async (req,res) => {
    try{
        const {page,name} = req.query
        const cond = name?{name:{$regex: name, $options: 'i'}} : {}
        let query = Product.find(cond)

        const productList = await query.exec()  // query를 실행시키고 싶을때 또는 실행을 따로 하고 싶을때 
        res.status(200).json({ status: 'Success', data: productList });

    }
    catch(error){

        res.status(400).json({ status: 'Fail', message: error.message });
    }

}



module.exports = productController;