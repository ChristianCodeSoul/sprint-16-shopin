const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.userId }).populate("items.product");

        if (!cart) {
            cart = await Cart.create({ user: req.user.userId, items: [] });
        }

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
        });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Product ID and valid quantity are required",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available",
            });
        }

        let cart = await Cart.findOne({ user: req.user.userId });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.userId,
                items: [{ product: productId, quantity }],
            });
        } else {
            const existingItem = cart.items.find(
                item => item.product.toString() === productId
            );

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;

                if (newQuantity > product.stock) {
                    return res.status(400).json({
                        success: false,
                        message: "Requested quantity exceeds available stock",
                    });
                }

                existingItem.quantity = newQuantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
        }

        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
        });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity exceeds available stock",
            });
        }

        const cart = await Cart.findOne({ user: req.user.userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            cartItem => cartItem.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product is not in cart",
            });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Cart updated",
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update cart",
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user.userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove product from cart",
        });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId });

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart is already empty",
                data: { items: [] },
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared",
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to clear cart",
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
};