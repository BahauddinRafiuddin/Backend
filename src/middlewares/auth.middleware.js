import { ApiError } from "../utils/ApiError.js"
import { asyncHandlers } from "../utils/asyncHandlers.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


export const verifyJWT = asyncHandlers(async (req, res, next) => {

    try {
        // Extracting the token from cookies Or From header And In header it come with bearer So using .replace method
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized Request!!")
        }

        // Decoding The Token Using JWT.verify
        const deCodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(deCodedToken?._id).select(
            "-password -refreshToken"
        )

        if (!user) {
            throw new ApiError(401, "Invalid Access Token!!")
        }

        // Setting Additional Req User Asign it With user...
        req.user = user
        // It s Middleware WE Need To call Next()
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Inavlid Access Token")
    }
})