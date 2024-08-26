import { Like } from "../models/like.model.js"
import { asyncHandlers } from "../utils/asyncHandlers.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResopnse } from "../utils/ApiResponse.js"

const toggleVideoLike = asyncHandlers(async (req, res) => {

    const { videoId } = req.params
    //TODO: toggle like on video

    if (!videoId) {
        throw new ApiError(400, "Video Id Required")
    }

    const vLike = await Like.create(
        {
            video: videoId,
            likedBy: req.user?._id
        }
    )

    return res.status(200)
        .json(
            new ApiResopnse(200, vLike, "Video Liked Succesfully")
        )
})

const toggleCommentLike = asyncHandlers(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    if (!commentId) {
        throw new ApiError(400, "Comment Id Required")
    }

    const cLike = await Like.create(
        {
            comment: commentId,
            likedBy: req.user?._id
        }
    )

    return res.status(200)
        .json(
            new ApiResopnse(200, cLike, "Comment Liked Succesfully")
        )

})

const toggleTweetLike = asyncHandlers(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet

    if (!tweetId) {
        throw new ApiError(400, "Tweet Id Required")
    }

    const TLike = await Like.create(
        {
            tweet: tweetId,
            likedBy: req.user?._id
        }
    )

    return res.status(200)
        .json(
            new ApiResopnse(200, TLike, "Tweet Liked Succesfully")
        )
}
)

const getLikedVideos = asyncHandlers(async (req, res) => {
    //TODO: get all liked videos

    // Finding All Likes  Done BY User
    try {
        console.log("liekd Videp")
        const allLikedByUser = await Like.find({ likedBy: req.user?._id })
            .populate({
                path: 'video',
                select: 'title views duration description thumbnail videoFile'
            })//Here we can add what feilds we want in video using select
    
        if (!(allLikedByUser || allLikedByUser.length === 0)) {
            throw new ApiError(400, "no Like video comment tweet available!!")
        }
    
        // Here We Use Filter Method AllLikedVideo Is array Of Object Fileter Methoda return Only Object With Video
    
        const allLikeVideo = allLikedByUser.filter(like => like.video)
    
        return res.status(200)
            .json(
                new ApiResopnse(200, allLikeVideo, "All Like Video Fetched Successfully")
            )
    } catch (error) {
        throw new ApiError(500,"Error While Finding Liked Video")
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}