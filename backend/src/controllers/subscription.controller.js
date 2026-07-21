import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { HandleAsync } from "../utils/HandleAsync.js"


const toggleSubscription = HandleAsync(async (req, res) => {
    const {channelId} = req.params
    const subscribe = await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(req.user?._id),
                channel : new mongoose.Types.ObjectId(channelId)
            }
        }
    ])
    if(subscribe.length === 0){
        const newSubscriber = await Subscription.create({
            subscriber : req.user?._id,
            channel : channelId
        })
        return res.status(201).json(
            new ApiResponse(201, newSubscriber, "Subscribed")
        )
    }
    const deletedSubscriber = await Subscription.findByIdAndDelete(subscribe[0]._id)
    return res.status(200).json(
        new ApiResponse(200, {}, "Unsuscribed")
    )

    // TODO: toggle subscription
    // channelId is just another user id
    // in case of subscription our query will be simple
    // if current user is subscribed, unsubscribe then else subscribe
    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = HandleAsync(async (req, res) => {
    const {channelId} = req.params
    if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel Id")
    }
    const subscribers = await Subscription.aggregate([
        {
            $match:{
                channel : new mongoose.Types.ObjectId(channelId)
            }
        },{
            $lookup:{
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as : "subscriberDetails"
            }
        },{
            $unwind: "$subscriberDetails"
        },{
            $project:{
                _id : 1,
                username: "$subscriberDetails.username",
                user_id: "$subscriberDetails._id",
                fullName: "$subscriberDetails.fullName",
                avatar: "$subscriberDetails.avatar",
                coverImage: "$subscriberDetails.coverImage"
            }
        }
    ])
    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    )





    // to get all subscribers we need to find documents with all of them having channel as channelId
    // then project the subscriber i.e. userId 
    // we will have an array of userIds
    // we can either make an query to have an array of object with all of the user documents which will be better for frontend
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = HandleAsync(async (req, res) => {
    const subscriberId = req.user?._id
    if(!mongoose.isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid User Id")
    }
    const channels = await Subscription.aggregate([
        {
            $match:{
                subscriber : new mongoose.Types.ObjectId(subscriberId)
            }
        },{
            $lookup:{
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as : "channelDetails"
            }
        },{
            $unwind: "$channelDetails"
        },{
            $project:{
                _id : 1,
                username: "$channelDetails.username",
                user_id: "$channelDetails._id",
                fullName: "$channelDetails.fullName",
                avatar: "$channelDetails.avatar",
                coverImage: "$channelDetails.coverImage"
            }
        }
    ])
    return res.status(200).json(
        new ApiResponse(200, channels, "Channels fetched successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}