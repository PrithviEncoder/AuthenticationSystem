import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyToken = asyncHandler(async (req, res, next) => {
    
    const { token } = req.cookies;//token is name give when set
    //or const token=req.cookies.token; here name can be any
    console.log("Token to verify:", token); // Log the token
    try {
        if(!token) {
            throw new ApiError(401, "UNAUTHORIZED - no token provided");  
        }
        
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

        if(!decodedToken) {
            throw new ApiError(401, "UNAUTHORIZED - no token provided");  
        }

        req.userId = decodedToken._id;//_id since we provided this while generating jwt token

        
        next()
    } catch (error) {
        throw new ApiError(500, error.message || "Server Error");
        //500 server error since what user can do init

    }

})