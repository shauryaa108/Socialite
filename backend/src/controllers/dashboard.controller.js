import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    // get vidoes
    // for each video extract it's views and add it all in total views - nested query
    // total videos - easy(can be nested with total views one)
    // total likes - also can be nested with total views query
    const userId = req.user?._id
    const { channelId } = req.params
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }
    // total subscribers count
     const subscriberCount = await Subscription.countDocuments({
        channel: channelId
    })
    const totalVideos = await Video.countDocuments({
        owner: channelId
    })
    const Likes = await Video.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(channelId)
            }
        },{
            $lookup : {
                from : "likes",
                localField : "_id",
                foreignField: "video",
                as : "VideoLikes"
            }
        },{
            $project : {
                views : 1,
                likeCount : {$size : "$VideoLikes"}
            }
        },{
            $group: {
                _id : null,
                totalViews : {$sum : "$views"},
                totalLikes : {$sum : "$likeCount"}
            }
        }
    ])
    const totalLikes = Likes[0]?.totalLikes || 0
    const totalViews = Likes[0]?.totalViews || 0
    return res.status(200).json(
        new ApiResponse(200, {
                totalLikes,
                totalVideos,
                totalViews,
                subscriberCount
            },
            "Channel Analytics fetched successfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const { channelId } = req.params
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }
    const videos = await Video.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                duration: 1,
                views: 1
            }
        }
    ])
    return res.status(200).json(
        new ApiResponse(200, videos, "All videos fetched")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }