import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResopnse } from "../utils/ApiResponse.js"
import { asyncHandlers } from "../utils/asyncHandlers.js"
import { uploadCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandlers(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const videos=await Video.find()
    if(!videos){
        throw new ApiError(400,"No Videos Are Available")
    }

    return res.status(200)
    .json(
        new ApiResopnse(200,videos,"All Videos Finded")
    )
})

const publishAVideo = asyncHandlers(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video

    // Extracting Deatils That We Need To Create Video Document...

    const { title, description } = req.body
    const owner = req.user?._id
    // console.log(owner)

    const videoLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!owner) {
        throw new ApiError(400, "Unauthorized Access!!!")
    }

    if (!(title || description)) {
        throw new ApiError(400, "Title And Descriptino Is Required!!")
    }
    if (!(videoLocalPath || thumbnailLocalPath)) {
        throw new ApiError(400, "Video And Thumabnail Required!!!")
    }

    // Uploading On CLoudinary.....
    const videoFile = await uploadCloudinary(videoLocalPath)
    const thumbnail = await uploadCloudinary(thumbnailLocalPath)

    if (!(videoFile || thumbnail)) {
        throw new ApiError(500, "Server Error While Uploading Video And Thumbnail!!")
    }

    // console.log("files Saved On Cludinary:->: ", videoFile)
    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        owner,
        duration: videoFile.duration,
    })

    return res.status(200)
        .json(
            new ApiResopnse(200, video, "Video Added SuccessFully")
        )
})

const getVideoById = asyncHandlers(async (req, res) => {
    //TODO: get video by id

    const { videoId } = req.params

    const video = await Video.findById(videoId).select("-videoFile -thumbnail")
    if (!video) {
        throw new ApiError(400, "Video Does Not Exist!!")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, video, "Video Founded SuccessFully")
        )
})

const updateVideo = asyncHandlers(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description
    const { title, description } = req.body
    if (!(title || description)) {
        throw new ApiError(400, "Title And Description Required!!")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description
            }
        },
        {
            new: true
        }
    ).select("-videoFile -thumbnail")

    if (!video) {
        throw new ApiError(400, "video Not Foud!!")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, video, "Title Description Updated Successfully")
        )
})

const deleteVideo = asyncHandlers(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findByIdAndDelete(videoId)

    return res.status(200)
        .json(
            new ApiResopnse(200, video, "Video Deleted SuccessFully")
        )
})

const togglePublishStatus = asyncHandlers(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId).select("-videoFile -thumbnail")

    if (!video) {
        throw new ApiError(400, "Video Does Not Exist!!")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res.status(200)
        .json(
            new ApiResopnse(200, video, "Video Status Is Changed Successfully")
        )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}