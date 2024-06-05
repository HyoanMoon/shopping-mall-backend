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
        const products = await Product.find({});

        if(!products) {
            throw new Error('Product not found')
        }
        res.status(200).json({ status: 'Success', data: products });


    }
    catch(error){

        res.status(400).json({ status: 'Fail', message: error.message });
    }

}



module.exports = productController;