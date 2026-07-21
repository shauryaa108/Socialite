import { HandleAsync } from "../utils/HandleAsync.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = HandleAsync( async (req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;

        let token;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies?.accesstoken) {
            token = req.cookies.accesstoken;
        }
        if(!token){
            throw new ApiError(400, "Unauthorised request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshtoken")
        if(!user){
            throw new ApiError(400, "Invalid authorisation token")
        }
        // the same req is passed throughout the cycle so for controller to know which user to logout, we can now logout the desired user
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(400, error?.message || "Invalid token reference")
    }
})