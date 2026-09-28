const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/db");

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "blob:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'", "data:"],
                objectSrc: ["'none'"],
                frameAncestors: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
            },
        },
        frameguard: {
            action: "deny",
        },
    })
);

app.use(cors());

app.use(express.json({ limit: "8mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "ShopIn Sprint 16 backend is running",
    });
});

const PORT = process.env.PORT || 4000;

connectDB();

app.listen(PORT, () => {
    console.log(`Sprint 16 ShopIn backend running on port ${PORT}`);
});