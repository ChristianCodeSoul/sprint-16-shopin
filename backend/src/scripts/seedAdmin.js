const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const username = "shopinadmin";
        const email = "admin@shopin.com";
        const password = "Admin@12345";

        const existingAdmin = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingAdmin) {
            if (existingAdmin.role !== "admin") {
                existingAdmin.role = "admin";
                await existingAdmin.save();
            }

            console.log("Admin account already exists.");
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await User.create({
            firstName: "ShopIn",
            lastName: "Admin",
            username,
            email,
            passwordHash,
            role: "admin",
        });

        console.log("Admin account created successfully.");
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error("Admin seed error:", error);
        process.exit(1);
    }
};

seedAdmin();