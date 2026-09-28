const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            console.warn(
                `[Auth] Access denied for role: "${userRole || "none"}". Required: [${allowedRoles.join(", ")}]`
            );

            return res.status(403).json({
                success: false,
                message: "Forbidden: You do not have permission to access this resource.",
            });
        }

        next();
    };
};

module.exports = authorize;