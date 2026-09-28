const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { GoogleGenAI } = require("@google/genai");
const DOMPurify = require("isomorphic-dompurify");

const getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalProducts,
            totalOrders,
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
        ]);

        const salesResult = await Order.aggregate([
            {
                $match: {
                    status: { $ne: "cancelled" },
                },
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                },
            },
        ]);

        const totalSales = salesResult[0]?.totalSales || 0;

        res.json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalSales,
            },
        });
    } catch (error) {
        console.error("Admin stats error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load admin statistics.",
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-passwordHash")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error("Admin users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load users.",
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate(
                "user",
                "firstName lastName username email"
            )
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        console.error("Admin orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load orders.",
        });
    }
};

const generateProductDescription = async (req, res) => {
    try {
        const title = String(req.body.title || "").trim();
        const category = String(req.body.category || "").trim();

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Product title is required.",
            });
        }

        if (title.length > 120 || category.length > 80) {
            return res.status(400).json({
                success: false,
                message: "Product details are too long.",
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "AI service is not configured.",
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: `Write a short ecommerce product description for:
Product: ${title}
Category: ${category || "General"}

Requirements:
- 2 to 3 sentences
- Clear and natural
- Mention practical benefits
- No markdown
- No emojis
- Do not invent technical specifications`,
        });

        const description = DOMPurify.sanitize(response.text || "", {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
        }).trim();

        if (!description) {
            return res.status(502).json({
                success: false,
                message: "AI did not return a description.",
            });
        }

        res.json({
            success: true,
            data: {
                description: description.slice(0, 500),
            },
        });
    } catch (error) {
        console.error("AI product description error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate product description.",
        });
    }
};

module.exports = {
    getStats,
    getUsers,
    getOrders,
    generateProductDescription,
};