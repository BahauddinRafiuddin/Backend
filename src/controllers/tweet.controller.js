import { Tweet } from "../models/tweet.model.js"
import { asyncHandlers } from "../utils/asyncHandlers.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResopnse } from "../utils/ApiResponse.js"
import { populate } from "dotenv"

const createTweet = asyncHandlers(async (req, res) => {
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Content Required!!")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })

    if (!tweet) {
        throw new ApiError(400, "Error While Doing Tweet!!")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, tweet, "Tweet Added Successfully")
        )
})

const getUserTweets = asyncHandlers(async (req, res) => {

    const userAllTweet = await Tweet.find({ owner: req.user?._id })
        .populate({
            path: 'owner',
            select: 'username fullname email'
        })

    if (userAllTweet.length === 0) {
        throw new ApiError(404, "User Tweets Not Found!!")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, userAllTweet, "User All Tweets Fetch Successfully")
        )
})

const updateTweet = asyncHandlers(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Content Required!!")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        { new: true }
    )

    if (!tweet) {
        throw new ApiError(404, "Tweet Not Found!!")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, tweet, " Tweet Updated Successfully")
        )
})

const deleteTweet = asyncHandlers(async (req, res) => {
    const { tweetId } = req.params

    const tweet = await Tweet.findByIdAndDelete(tweetId)
    
    if (!tweet) {
        throw new ApiError(404, "Tweet Not Found!!")
    }

    return res.status(200)
        .json(
            new ApiResopnse(200, {}, " Tweet Deleted Successfully")
        )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}