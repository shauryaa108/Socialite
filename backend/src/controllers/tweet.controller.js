import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const checkTweetOwnership = async (tweetId, userId) => {
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "tweet not found");
    }

    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to modify this tweet");
    }

    return tweet;
};

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if (!content?.trim()) {
        throw new ApiError(400, "Tweet content is required");
    }
    const userId = req.user?._id
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "invalid user id")
    }
    const tweet = await Tweet.create({
        owner : userId,
        content : content
    })
    if(!tweet){
        throw new ApiError(400, "Tweet can not be published")
    }
    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet published successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "invalid user id")
    }
    const tweets = await Tweet.aggregate([
        {
            $match : {
                owner : new mongoose.Types.ObjectId(userId)
            }
        }
    ])
    return res.status(200).json(
        new ApiResponse(200, tweets, "All tweets fetched sccessfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body
    if (!content?.trim()) {
        throw new ApiError(400, "Tweet content is required");
    }
    const userId = req.user?._id
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "invalid user id")
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "invalid tweet id")
    }
    await checkTweetOwnership(tweetId, userId)
    const updateResults = await Tweet.findByIdAndUpdate(
        tweetId, 
        {
            $set:{
                content
            }
        },
        {
            new : true
        }
    )
    return res.status(200).json(
        new ApiResponse(200, updateResults, "Tweet updated successfully")
    )

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    const userId = req.user?._id
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "invalid user id")
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "invalid tweet id")
    }
    await checkTweetOwnership(tweetId, userId)
    const deletedResults = await Tweet.findByIdAndDelete(tweetId)
    if(!deletedResults){
        throw new ApiError(404, "Tweet doesn't exists")
    }
    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet delete successful")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}