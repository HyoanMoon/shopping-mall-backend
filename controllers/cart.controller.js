const Cart = require("../models/Cart")
const cartController = {};



cartController.addItemToCart = async (req, res) => {
    try {
        // 1. 정보 가져오기
        // 1-1. User Id
        // 1-2. 상품 Id, size, 수량
        const { userId } = req;
        const { productId, size, qty } = req.body;
        // 1.5 유저를 가지고 카트 찾기 카트가 없으면 새로 만들어 주기
        let cart = await Cart.findOne({ userId: userId }) // 왼쪽 userId = 카트 데베에 있는 userId, 오른쪽 userId =  const { userId } = req;
        // 카트가 없으면 새로 만들어 주기
        if (!cart) {
            cart = new Cart({ userId })
            await cart.save()
        }
        // 이미 카트에 들어가 있는 아이템인지 그렇다면 에러. productId, size 동시에 두개 같은게 들어 올 수 없다.
        const existItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.size === size);
        // productId type이  mongoose.ObjectId 이기 때문에 equals 함수로 비교해야 한다.
        if (existItem) {
            throw new Error("Items alreay exist.")
        }
        // 2. 새로운 아이템을 카트에 추가
        cart.items = [...cart.items, { productId, size, qty }]
        await cart.save()
        res.status(200).json({ status: 'Success', data: cart, cartItemQty: cart.items.length });


    } catch (error) {
        res.status(400).json({ status: 'Fail..', message: error.message });
    }
}



module.exports = cartController;