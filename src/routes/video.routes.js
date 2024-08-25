import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideoById, publishAVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router()
router.use(verifyJWT) //Auth MiddleWare For All Request...

// Routes That Publish Video To Db It Requried Video Thumabnail 
router.route("/")
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]),
        publishAVideo
    )

router.route("/:videoId").get(getVideoById)
export default router