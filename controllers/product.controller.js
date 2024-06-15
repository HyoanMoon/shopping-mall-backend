const Product = require("../models/Product");
const PAGE_SIZE = 5;
const productController = {};

productController.createProduct = async (req, res) => {
    try {
        const { sku, name, size, image, category, description, price, stock, status } = req.body;
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
        return res.status(200).json({ status: 'Success', product });
    } catch (error) {
        res.status(400).json({ status: 'Fail..', message: error.message });
    }
};
productController.getProducts = async (req, res) => {
    try {
        const { page, name, category } = req.query;
        const cond = {
            ...(name && { name: { $regex: name, $options: 'i' } }),
            ...(category && { category: { $regex: category, $options: 'i' } })
        };

        let query = Product.find(cond);
        let response = { status: "Success" };
        if (page) {
            query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
            const totalItemNum = await Product.find(cond).count();
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
            response.totalPageNum = totalPageNum;
        }
        const productList = await query.exec();
        response.data = productList;
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ status: 'Fail', message: error.message });
    }
};


productController.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { sku,
            name,
            size,
            image,
            category,
            description,
            price,
            stock,
            status } = req.body;
        const product = await Product.findByIdAndUpdate(
            { _id: productId },
            { sku, name, size, image, category, description, price, stock, status },
            { new: true }); // UPDATE 함수들에 옵션으로 줄 수 있는 값. 업데이트힌 후 새로운 값을 반환 받을 수 있다.
        if (!product) throw new Error("item doesn't exist")
        res.status(200).json({ status: 'Success', data: product });


    } catch (error) {
        res.status(400).json({ status: 'Fail', message: error.message });
    }
};

productController.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deleteProduct = await Product.findByIdAndUpdate(
            { _id: productId },
            { isDeleted: true, status: 'disactive' });
        if (!deleteProduct) throw new Error("item doesn't exist")
        res.status(200).json({ status: 'Success', data: deleteProduct });

    } catch (error) {
        res.status(400).json({ status: 'Fail', message: error.message });
    }
};

productController.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) throw new Error("item doesn't exist");
        res.status(200).json({ status: "success", data: product });

    } catch (error) {
        res.status(400).json({ status: 'Fail', message: error.message });
    }
};
productController.checkStock = async (item) => {
    // 1. 내가 사려는 아이템 재고 정보 들고오기
    const product = await Product.findById(item.productId)
    // 2. 내가 사려는 아이템 qty과 재고 비교
    if (product.stock[item.size] < item.qty) { // => 내가 사려는 아이템 사이즈의 스탁이 내가 사고 싶은 수량 보다 적으면!!!
        // 3. 재고가 불충분하면 불충분 메세지와 함께 데이터 반환
        return { isVerify: false, message: `This ${product.name} ${item.size.toUpperCase()} is out of stock.` }
    }
    // 4. 충분하면 재고에서 살 수량 빼고 성공 메세지 보내기
    const newStock = { ...product.stock }
    newStock[item.size] -= item.qty
    product.stock = newStock
    await product.save()
    return { isVerify: true }

};
// 재고를 확인하고 싶은 아이템을 하나씩 들고와서 실제 재고랑 비교
productController.checkItemListStock = async (itemList) => {
    const insufficientStockItems = []
    // 재고 확인 하는 로직
    await Promise.all(itemList.map(async item => {
        const stockCheck = await productController.checkStock(item)
        if (!stockCheck.isVerify) {
            insufficientStockItems.push({ item, message: stockCheck.message })
        }
        return stockCheck
    }))


    return insufficientStockItems
};
// 불충분한 아이템 리스트 반환 하는 함수
// 1. 아이템이 충분하면 빈 리스트로 반환
// 2. 불충분한 아이템이 있으면 리스트에 채워져서 반환.
// 3. checkItemListStock = 전체 리스트를 체크 / checkStock = 아이템 하나하나 포커스를 둔다. 
// Promise.all => 비동기가 여러개일때 직선을 병렬로 해줌. 더 빠름. 




module.exports = productController;

