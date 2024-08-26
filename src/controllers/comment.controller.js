import { Comment } from "../models/comment.model.js"
import { asyncHandlers } from "../utils/asyncHandlers.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResopnse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"

const getAllComments = asyncHandlers(async (req, res) => {

    // We Can Get All Comments using .find() Method
    const allComments = await Comment.find().select("-createdAt -updatedAt")
    if (!allComments) {
        throw new ApiError(400, "No Comments Are There!!")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, allComments, "All Comments Finded..")
        )
})

const getVideoComments = asyncHandlers(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    // const { page = 1, limit = 10 } = req.query
    const comment = await Comment.find({ video: videoId })
        // .populate('video', 'title')
        .exec()
    if (!comment) {
        throw new ApiError(404, "Comments not found for this video");
    }

    const commentContent = comment.map(comments => ({
        content: comments.content
    }))

    return res.status(200).json(
        new ApiResopnse(200, commentContent, "Comments retrieved successfully")
    );
})

const addComment = asyncHandlers(async (req, res) => {
    // TODO: add a comment to a video
    // console.log("request Params:-> ", req.params)
    const { videoId } = req.params // videoId Same As You Define In Routes "Example: ("/:videoId")"
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
        video: videoId,
        owner: userId
    })

    return res.status(200)
        .json(
            new ApiResopnse(200, comment, "Comment Added Successfully")
        )
})

const updateComment = asyncHandlers(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body
    if (!content) {
        throw new ApiError(400, "Content For Comment Is Required!! ")
    }
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        { new: true }
    )

    if (!comment) {
        throw new ApiError(400, "Cant Find Comment!!")
    }
    return res.status(200)
        .json(
            new ApiResopnse(200, comment, "Comment Updated Successfully")
        )
})

const deleteComment = asyncHandlers(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params
    await Comment.findByIdAndDelete(commentId)
    return res.status(200)
        .json(
            new ApiResopnse(200, {}, "Comment Deleted Successfully")
        )
})

export {
    getAllComments,
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}