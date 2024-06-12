const orderController = {};
const Order = require("../models/Order");
const productController = require("./product.controller");
const { randomStringGenerator } = require("../utils/randomStringGenerator");
const { populate } = require("dotenv");
const { model } = require("mongoose");
const PAGE_SIZE = 5;



orderController.createOrder = async (req, res) => {
  try {
    // 1. 프론트엔드에서 데이터 보낸거 받아오기 
    const { userId } = req;
    const { totalPrice, shipTo, contact, orderList } = req.body //프론트 엔드에서 가져온 정보
    // 재고 확인 & 재고 업데이트 하고 오더 만들기!
    const insufficientStockItems = await productController.checkItemListStock(orderList)

    // 재고가 충분하지 않은 아이템이 있으면 =>  에러!
    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems.reduce((total, item) => total += item.message, "")
      throw new Error(errorMessage)
    }
    //재고가 충분해서 통과 하면⬇︎
    // 2. order 만들기

    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator()
    });

    await newOrder.save(); //save 후에 비워주자!


    res.status(200).json({ status: 'success', orderNum: newOrder.orderNum });

  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message })

  }
};

orderController.getOrder = async (req, res, next) => {
  try {
    const { userId } = req;

    const orderList = await Order.find({ userId: userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
        select: "image name",
      },
    });



    res.status(200).json({ status: "success", data: orderList });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

// orderController.getOrderList = async (req, res) => {
//   try {
//     const { page, ordernum } = req.query

//     const cond = ordernum ? { ordernum: { $regex: ordernum, $options: 'i' } } : {}

//     let query = Order.find(cond).populate("userId")
//       .populate({
//         path: "items",
//         populate: {
//           path: "productId",
//           model: "Product",
//           select: "image name",
//         },
//       });

//     let response = { status: "success" };

//     if (page) {
//       query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
//       const totalItemNum = await Order.find(cond).count()
//       const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
//       response.totalPageNum = totalPageNum
//     }

//     const orderList = await query.exec()
//     response.data = orderList

//     res.status(200).json(response);

//   } catch (error) {
//     return res.status(400).json({ status: "fail", error: error.message });
//   }
// };

orderController.getOrderList = async (req, res, next) => {
  try {
    const { page, ordernum } = req.query;

    let cond = {};
    if (ordernum) {
      cond = {
        orderNum: { $regex: ordernum, $options: "i" },
      };
    }

    const orderList = await Order.find(cond)
      .populate("userId")
      .populate({
        path: "items",
        populate: {
          path: "productId",
          model: "Product",
          select: "image name",
        },
      })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);
    const totalItemNum = await Order.find(cond).count();

    const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    res.status(200).json({ status: "success", data: orderList, totalPageNum });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) throw new Error("Order doesn't exist")
    res.status(200).json({ status: 'Success', data: order });

  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
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

