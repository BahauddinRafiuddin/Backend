import { asyncHandlers } from "../utils/asyncHandlers.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResopnse } from "../utils/ApiResponse.js"
import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandlers(async (req, res) => {
    const { name, description } = req.body
    if (!(name || description)) {
        throw new ApiError(400, "Name And Description Are Required!!")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })

    if (!playlist) {
        throw new ApiError(400, "Error While Creating Playlist!!")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, playlist, "PlayList Create Successfully")
        )
})

const getUserPlaylists = asyncHandlers(async (req, res) => {
    const { userId } = req.params || req.user?._id
    if (!userId) {
        throw new ApiError(400, "User Id Required!!")
    }
    //TODO: get user playlists
    const userPlayList = await Playlist.findById(userId)

    if (!userPlayList) {
        throw new ApiError(400, "User PlayList Is Not Available")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, userPlayList, "User PlayList Fetched Successfully")
        )

})

const getPlaylistById = asyncHandlers(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId) {
        throw new ApiError(400, "playlistId Required!!")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, " PlayList Is Not Available")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, playlist, " PlayList Fetched Successfully")
        )
})

const addVideoToPlaylist = asyncHandlers(async (req, res) => {
    const { playlistId, videoId } = req.params
    try {
        const playlist = await Playlist.findById(playlistId)
        const video = await Video.findById(videoId)

        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        if (!video) {
            throw new ApiError(404, "Video not found")
        }

        // Check If Video Already Present in playlist if not Add the playlist
        if (!playlist.videos.includes(videoId)) {
            playlist.videos.push(videoId)
            await playlist.save()
        } else {
            throw new ApiError(404, "Video Already Present In Playlist!!")
        }

        return res.status(200)
            .json(
                new ApiResopnse(200, {}, "Video Added To Playlist Successfully")
            )
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Server Error While Adding video to playlist")
    }
})

const removeVideoFromPlaylist = asyncHandlers(async (req, res) => {
    const { playlistId, videoId } = req.params
    try {
        const playlist = await Playlist.findById(playlistId)
        const video = await Video.findById(videoId)

        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        if (!video) {
            throw new ApiError(404, "Video not found")
        }

        // check If video is present in playlist if present removing it..
        if (!playlist.videos.includes(videoId)) {
            throw new ApiError(404, "video Is Not Present In Playlist")
        }
        playlist.videos = playlist.videos.filter(id => id.toString() !== videoId);
        await playlist.save()

        return res.status(200)
            .json(
                new ApiResopnse(200, {}, "Video Removed From Playlist Successfully")
            )

    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Error While Removing video from playlist")
    }


})

const deletePlaylist = asyncHandlers(async (req, res) => {
    const { playlistId } = req.params

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if (!playlist) {
        throw new ApiError(404, "PlayList Not Found!!")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, {}, " Playlist Deleted Successfully")
        )

})

const updatePlaylist = asyncHandlers(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!(name || description)) {
        throw new ApiError(400, "Name And Description Required!!!")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {
            new: true
        }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist Not Found!!!")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, playlist, " Playlist Updated Successfully")
        )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}