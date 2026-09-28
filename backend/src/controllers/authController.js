const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(user) {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters",
            });
        }

        const normalizedUsername = username.toLowerCase();
        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({
            $or: [
                { username: normalizedUsername },
                { email: normalizedEmail },
            ],
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    existingUser.username === normalizedUsername
                        ? "Username already exists"
                        : "Email already exists",
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName,
            lastName,
            username: normalizedUsername,
            email: normalizedEmail,
            passwordHash,
        });

        const token = createToken(user);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create account",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            });
        }

        const user = await User.findOne({
            username: username.toLowerCase(),
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        const token = createToken(user);

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to login",
        });
    }
};