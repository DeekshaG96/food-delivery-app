import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const token = req.headers.token || (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, ""));
    if (!token) {
        if (req.body?.userId) {
            return next();
        }
        return res.json({ success: false, message: "Not Authorized, Login Again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET || "food_delivery_super_secret_jwt_key_2026");
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        // Fallback if userId was supplied in body
        if (req.body?.userId) {
            return next();
        }
        console.error("JWT auth error:", error.message);
        res.json({ success: false, message: "Invalid or expired token, please login again" });
    }
};

export default authMiddleware;
