import { Router } from "express";
import {
    loginUser,
    logOutUser,
    registerUser,
    getCurrentUSer,
    updateUserAcountDetails,
    changeUserPassword,
    refreshAccessToken,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js"
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

/*......................................... All Request Start With /users Are Handle Here......................................*/
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/refreshAccessToken").post(refreshAccessToken)
// Secured Routes ..........Include MiddleWare...........
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/getcurrentuser").post(verifyJWT, getCurrentUSer)
router.route("/updateUserAcountDetails").patch(verifyJWT, updateUserAcountDetails)
router.route("/change-password").post(verifyJWT, changeUserPassword)
// Updating Images Endpoints...
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/channel-details/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)

export default router