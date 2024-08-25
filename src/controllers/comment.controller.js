import { Comment } from "../models/comment.model.js"
import { asyncHandlers } from "../utils/asyncHandlers.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResopnse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

const getAllComments = asyncHandlers(async (req, res) => {

})

const getVideoComments = asyncHandlers(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

})

const addComment = asyncHandlers(async (req, res) => {
    // TODO: add a comment to a video
    console.log("request Params:-> ", req.params)
    // const { videoId } = req.params // videoId Same As You Define In Routes "Example: ("/:videoId")"
    let videoId
    const { content } = req.body
    const userId = req.user?._id

    console.log("VideoId :", videoId)
    console.log("Content :", content)
    console.log("User ID :", userId)

    if (!(videoId || content)) {
        throw new ApiError(401, "Video Id And Comment Content Require!!")
    }

    if (!userId) {
        throw new ApiError(400, "Unauhtorized Access!!!")
    }

    const comment = await Comment.create({
        content,
        // video: videoId||"",
        owner: userId
    })

    return res.status(200)
        .json(
            new ApiResopnse(200, comment, "Comment Added Successfully")
        )
})

const updateComment = asyncHandlers(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandlers(async (req, res) => {
    // TODO: delete a comment
})

export {
    getAllComments,
    addComment,
    updateComment,
    deleteComment
}