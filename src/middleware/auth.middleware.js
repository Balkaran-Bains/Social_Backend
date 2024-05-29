// auth.middleware.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace(/^Bearer\s+/, "");
        if (!token) {
            throw new ApiError(401, "Unauthorized: Access token required");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid Access Token: User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        let errorMessage;
        if (error.name === "JsonWebTokenError") {
            errorMessage = "Invalid Access Token: Signature mismatch or expired token";
        } else if (error.name === "TokenExpiredError") {
            errorMessage = "Access Token Expired: Please re-login";
        } else {
            errorMessage = error.message || "Unauthorized";
        }
        return res.status(401).json({ message: errorMessage });
    }
});
