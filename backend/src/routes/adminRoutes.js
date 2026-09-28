const express = require("express");

const {
    getStats,
    getUsers,
    getOrders,
    generateProductDescription,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getStats);
router.get("/users", protect, authorize("admin"), getUsers);
router.get("/orders", protect, authorize("admin"), getOrders);

router.post(
    "/ai/product-description",
    protect,
    authorize("admin"),
    generateProductDescription
);

module.exports = router;