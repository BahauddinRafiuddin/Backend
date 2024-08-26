import { Router } from "express";
import {
    addComment,
    deleteComment,
    getAllComments,
    getVideoComments,
    updateComment
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT) //Apply MiddleWare To all Routes To This File
router.route("/").get(getAllComments)
router.route("/:videoId").get(getVideoComments).post(addComment)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment)

export default router