const orderController = {};
const Order = require("../models/Order");
const productController = require("./product.controller");
const {randomStringGenerator} = require("../utils/randomStringGenerator");



orderController.createOrder = async (req, res) => {
    try {
        // 1. 프론트엔드에서 데이터 보낸거 받아오기 
        const { userId } = req;
        const { totalPrice, shipTo, contact, orderList } = req.body //프론트 엔드에서 가져온 정보
        // 재고 확인 & 재고 업데이트 하고 오더 만들기!
        const insufficientStockItems = await productController.checkItemListStock(orderList)

        // 재고가 충분하지 않은 아이템이 있으면 =>  에러!
        if(insufficientStockItems.length > 0) {
            const errorMessage = insufficientStockItems.reduce((total, item)=> total+= item.message, "")
            throw new Error(errorMessage)
        }
        //재고가 충분해서 통과 하면⬇︎
        // 2. order 만들기

        const newOrder = new Order({
            userId,
            totalPrice,
            shipTo,
            contact,
            orderItems: orderList,
            orderNum : randomStringGenerator()
        });
        
        await newOrder.save(); //save 후에 비워주자!
        

        res.status(200).json({status: 'success', orderNum: newOrder.orderNum  });

    } catch (error) {
        return res.status(400).json({status: "fail", error: error.message})

    }
}


module.exports = orderController; // orderApi 에서 사용할 수 있음.


// // 1. 보낼 데이터 정리해서
// const data = {
//     totalPrice,
//     shipTo: { address, city, zip },
//     contact: { firstName, lastName, contact },
//     orderList: cartList.map(item => {
//       return {
//         productId: item.productId._id,
//         size: item.size,
//         qty: item.qty,
//         price: item.productId.price
//       }
//     })
//   };

