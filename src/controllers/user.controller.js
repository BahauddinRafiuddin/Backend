import { asyncHandlers } from "../utils/asyncHandlers.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { ApiResopnse } from "../utils/ApiResponse.js";

const registerUser = asyncHandlers(async (req, res) => {
    // Get User Details From Frontend
    // Validation Empty
    // Check If User Alreafy Exist
    // Check for Avatar
    // Upload Images and avatar on cloudinary...
    // Create USer Object Make Entry In DB
    // Remove Password And Refresh Token from response
    // Check For USer Creation
    // return res

    const { fullname, email, username, password } = req.body
    console.log("Email: ", email)

    // Validation....
    if (
        [fullname, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields Are Requied..")
    }

    // Chrcking If User ALready Exits Or Not....
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User Alredy Exists!!")
    }

    // Check For Images And Avatar given By User Or Not...

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || "";

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File Is Required!")
    }else{
        console.log("Avatar Is Saved On Your Public Folder")
        // console.log("Avatar Path",avatarLocalPath)
    }

    if (!coverImageLocalPath) {
        console.log("coverimage File Is Not Provided!")
    }else{
        console.log("coverImage Is Saved On Your Public Folder")
        // console.log("CoverImage Path",coverImageLocalPath)
    }
    // Upload Images and avatar on cloudinary...
    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar File Is Required!")
    }

    // Create user Object Make Entry In DB...

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // Checking User Object Is Created OR Not...
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user!")
    }

    return res.status(201).json(
        new ApiResopnse(200,createdUser,"User Registered Succesfully")
    )
})

export { registerUser }