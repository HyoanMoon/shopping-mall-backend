const Product = require("../models/Product");
const PAGE_SIZE = 5;
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
};
productController.getProducts = async (req,res) => {
    try{
        const {page,name} = req.query
        const cond = name?{name:{$regex: name, $options: 'i'}} : {}
        let query = Product.find(cond);
        let response = {status: "Success"};
        if(page){
            query.skip((page-1) * PAGE_SIZE ).limit(PAGE_SIZE) 
            // limit() - 한페이지에 내가 몇개을 보여주고 싶은지
            // skip() - 만약 3페이지를 보여주고 싶으면 (3-1) * 한 페이지 당 데이터 갯수를 곱해서 그만큼 데이터를 스킵하면 내가 원하는 페이지 데이터가 나옴. ex) 2*5 = 10개 건너뛰고 나머지 5개만 보여주면 3페이지. 

            // 데이터가 최종 몇개 있는지
            const totalItemNum = await Product.find(cond).count()
            // 데이터 총 개수 / PAGE_SIZE
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE); //전체 페이지 = 전체 데이터 수 / 내 페이지 사이즈
            response.totalPageNum = totalPageNum
        }
        const productList = await query.exec()  // query를 실행시키고 싶을때 또는 실행을 따로 하고 싶을때
        response.data= productList
        res.status(200).json(response);
    }
    catch(error){
        res.status(400).json({ status: 'Fail', message: error.message });
    }
};
productController.updateProduct =async(req,res) => {
    try{
        const productId = req.params.id;
        const {sku,
            name,
            size,
            image,
            category,
            description,
            price,
            stock,
            status } = req.body;
        const product = await Product.findByIdAndUpdate(
            {_id:productId}, 
            {sku,name,size,image,category,description,price,stock,status },
            {new:true}); // UPDATE 함수들에 옵션으로 줄 수 있는 값. 업데이트힌 후 새로운 값을 반환 받을 수 있다.
            if(!product) throw new Error("item doesn't exist")
            res.status(200).json({status:'Success',data: product});
            

    }catch(error){
        res.status(400).json({ status: 'Fail', message: error.message });
    }
};

productController.deleteProduct = async(req,res) => {
    try{
        const productId = req.params.id;
        const deleteProduct = await Product.findByIdAndUpdate(
            {_id:productId},
            { isDeleted: true, status: 'disactive' });
        if(!deleteProduct) throw new Error("item doesn't exist")
        res.status(200).json({status:'Success',data : deleteProduct});

    }catch(error){
        res.status(400).json({ status: 'Fail', message: error.message });
    }
}

productController.getProductById = async (req,res) => {
    try{
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) throw new Error("item doesn't exist");
        res.status(200).json({ status: "success", data: product });

    }catch(error){
        res.status(400).json({ status: 'Fail', message: error.message });
    }
}




module.exports = productController;

