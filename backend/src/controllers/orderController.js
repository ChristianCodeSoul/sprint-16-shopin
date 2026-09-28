const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("items.product");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "A product in the cart no longer exists",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.title}`,
        });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      totalAmount,
      status: "confirmed",
      paymentStatus: "pending",
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

module.exports = {
  getOrders,
  createOrder,
};