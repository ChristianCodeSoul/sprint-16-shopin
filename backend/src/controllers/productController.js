const Product = require("../models/Product");
const DOMPurify = require("isomorphic-dompurify");

const cleanText = (value) => {
    if (value === undefined || value === null) {
        return value;
    }

    return DOMPurify.sanitize(String(value), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    }).trim();
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID",
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { title, description, price, image, category, stock } = req.body;

        if (!title || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Title and price are required",
            });
        }

        const product = await Product.create({
            title: cleanText(title),
            description: cleanText(description),
            price,
            image: cleanText(image),
            category: cleanText(category),
            stock,
        });

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create product",
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const allowedFields = [
            "title",
            "description",
            "price",
            "image",
            "category",
            "stock",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                if (
                    field === "title" ||
                    field === "description" ||
                    field === "image" ||
                    field === "category"
                ) {
                    updates[field] = cleanText(req.body[field]);
                } else {
                    updates[field] = req.body[field];
                }
            }
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update product",
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to delete product",
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};