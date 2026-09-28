const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        originalPrice: {
            type: Number,
            default: null,
            min: 0,
        },

        discountPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        image: {
            type: String,
            default: "",
        },

        category: {
            type: String,
            default: "general",
            trim: true,
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);