import { Router } from "express";
import { loginUser, logOutUser, registerUser, getCurrentUSer, updateUserAcountDetails } from "../controllers/user.controller.js"
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

// Secured Routes ..........Include MiddleWare...........
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/getcurrentuser").post(verifyJWT, getCurrentUSer)
router.route("/updateUserAcountDetails").post(verifyJWT, updateUserAcountDetails)
export default router