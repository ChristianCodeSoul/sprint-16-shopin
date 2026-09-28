const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        image: {
            type: String,
            default: "",
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => Array.isArray(items) && items.length > 0,
                message: "Order must contain at least one item",
            },
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);