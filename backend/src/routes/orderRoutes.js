const express = require("express");
const { getOrders, createOrder } = require("../controllers/orderController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getOrders);
router.post("/", protect, createOrder);

module.exports = router;