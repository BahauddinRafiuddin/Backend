import { Router } from "express";
import { addComment, deleteComment, getAllComments, updateComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT) //Apply MiddleWare To all Routes To This File
router.route("/:videoId",getAllComments).post(addComment)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment)

export default router