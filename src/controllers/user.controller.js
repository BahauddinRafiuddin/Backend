import { asyncHandlers } from "../utils/asyncHandlers.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { ApiResopnse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(501, "Somethig Went Wrong While Generating Tokens!")
    }
}

// Handle Registering Process...
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
    } else {
        console.log("Avatar Is Saved On Your Public Folder")
        // console.log("Avatar Path",avatarLocalPath)
    }

    if (!coverImageLocalPath) {
        console.log("coverimage File Is Not Provided!")
    } else {
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

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // Checking User Object Is Created OR Not...
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user!")
    }

    return res.status(201).json(
        new ApiResopnse(200, createdUser, "User Registered Succesfully")
    )
})

// Handle Loginn Process......
const loginUser = asyncHandlers(async (req, res) => {
    // Take Data From User:-[Email Or Username And Password]
    // Check Data is Given By User
    // Find User By Username Or Email 
    // Check Password
    // Generate Access Tokan And Refresh Token and Store Refresh Token In DB
    // Return Cookies

    const { username, email, password } = req.body
    console.log("username: ", username)
    console.log("email: ", email)
    console.log("password: ", password)
    // Checking Data Given By User Or Not......
    if (!(username || email)) {
        throw new ApiError(401, "Email OR Username Required!!")
    }

    // Finding Existing User.....
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User Does Not Exists!")
    }

    // Checking Password Entered By User Is valid or Not....
    const validPassword = user.isPasswordCorrect(password, User.password)
    if (!validPassword) {
        throw new ApiError(401, "Invalid Credentials!!")
    }

    // Generating Tokens ...
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    // Creating Another Refrens Of User because we Add Refresh Tokan In our DB..........
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // we need to create Options To Send Cookies ... 
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResopnse(200, { user: loggedInUser, accessToken, refreshToken }, "User LogedIn Successfully")
        )
})

// Handle Logout Process...
const logOutUser = asyncHandlers(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResopnse(200, {}, "User Logged Out SuccesFully")
        )

})
// This EndPoint Generate The Refresh Token For USer:-........

const refreshAccessToken = asyncHandlers(async (req, res) => {

    // Extracting Refresh Token From Cookies Or Body...
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        // Decoding Token Using JWT.verify..............
        const decodedRefreshTokan = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        // Finding User By Id That Already Present in decodedRefreshTokan...
        const user = await User.findById(decodedRefreshTokan?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token!!")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token Is Expired Or Used!")
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

        // we need to create Options To Send Cookies ... 
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResopnse(200, { accessToken, refreshToken }, "Access Token Refreshed")
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

// Handle change Password.......

const changeUserPassword = asyncHandlers(async (req, res) => {

    const { oldPassword, newPassword } = req.body

    // This Is Change Password So User Must Be Loggdin So Auth Middleware Added And We Have User...
    const user = await User.findById(req.user?._id)

    // Checking Old Password Is Correct
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Password!")
    }

    // Now WE Know We Password Is Correct So We Set old Password to new Password
    user.password = newPassword
    // Calling Save Method
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(
            new ApiResopnse(200, {}, "Password Changed SuccessFully")
        )
})
export { registerUser, loginUser, logOutUser, refreshAccessToken, changeUserPassword }