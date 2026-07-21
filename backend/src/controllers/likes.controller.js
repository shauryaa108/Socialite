import mongoose , {isValidObjectId} from "mongoose";
import { HandleAsync } from "../utils/HandleAsync";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = HandleAsync(async (req, res) => {
    // user wants to like a video, we will get the video id from the params
    // userId can be found in req.user
    // toggle like on a video
    const {videoId} = req.params
    const userId = req.user?._id
    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "video not found") 
    }
    if(!userId){
        throw new ApiError(401, "User not found") 
    }
    // i have the video id and i have the user id
    // just find the like document
    const alreadyLiked = await Like.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
                likedBy: new mongoose.Types.ObjectId(userId)
            },
        },
    ]);
    if(alreadyLiked.length >0){
        const deletedLike = await Like.findOneAndDelete({
            _id: alreadyLiked[0]._id
        });
        if(!deletedLike){
            throw new ApiError(
                404,
                "Unable to remove the like"
            )
        }
        return res.status(200).json(
            new ApiResponse(200, deletedLike, "Like by remvoed successfully")
        )
    }

    const newLike = await Like.create({
        video: new mongoose.Types.ObjectId(videoId),
        likedBy: new mongoose.Types.ObjectId(userId)
    })

    if(!newLike){throw new ApiError(400, "can't like this video")}
    return res.status(200).json(
        new ApiResponse(200, newLike, "video liked successfully")
    )

})

const toggleCommentLike = HandleAsync(async (req, res) => {
    //TODO: toggle like on comment
    
    const {commentId} = req.params
    const userId = req.user?._id
    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400, "Not a valid comment id")
    }
    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Not a valid user id")
    }

    const likedComment = await Like.aggregate([
        {
            $match:{
                comment : new mongoose.Types.ObjectId(commentId),
                likedBy : new mongoose.Types.ObjectId(userId)
            }
        }
    ])
    if(likedComment.length > 0){
        const deletedLike = await Like.findByIdAndDelete(likedComment[0]._id)
        if(!deletedLike){throw new ApiError(400, "Cannot remove the like from the comment")}
        return res.status(200).json(
            new ApiResponse(
                200,
                deletedLike,
                "Like from the comment is deleted successfully"
            )
        )
    }
    const newLike = await Like.create({
        comment : commentId,
        likedBy : userId
    })
    if(!newLike){throw new ApiError(400, "Cannot like the comment")}
        return res.status(200).json(
            new ApiResponse(
                200,
                newLike,
                "Comment Liked successfully"
            )
        )

})

const toggleTweetLike = HandleAsync(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user?._id
    if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(400, "Not a valid tweet id")
    }
    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Not a valid user id")
    }

    const likedtweet = await Like.aggregate([
        {
            $match:{
                tweet : new mongoose.Types.ObjectId(tweetId),
                likedBy : new mongoose.Types.ObjectId(userId)
            }
        }
    ])
    if(likedtweet.length > 0){
        const deletedtweet = await Like.findByIdAndDelete(likedtweet[0]._id)
        if(!deletedtweet){throw new ApiError(400, "Cannot remove the like from the tweet")}
        return res.status(200).json(
            new ApiResponse(
                200,
                deletedtweet,
                "Like from the tweet is deleted successfully"
            )
        )
    }
    const newLike = await Like.create({
        tweet : tweetId,
        likedBy : userId
    })
    if(!newLike){throw new ApiError(400, "Cannot like the tweet")}
        return res.status(200).json(
            new ApiResponse(
                200,
                newLike,
                "tweet Liked successfully"
            )
        )
}
)

const getLikedVideos = HandleAsync(async (req, res) => {
    //TODO: get all liked videos
    const userid = req.user?._id
    if(!mongoose.isValidObjectId(userid)){
        throw new ApiError(400,"Wrong type of user id or invalid user id")
    }
    const likedVideos = await Like.aggregate([
        {
            $match:{
                likedBy: new mongoose.Types.ObjectId(userid),
                video: { $ne : null }
            },
            
        },
        {
            $lookup:{
                from: "videos",
                localField:"video",
                foreignField:"_id",
                as:"VideoDetails"
            }
        },
        {
            $unwind:"$VideoDetails"
        },
        {
            $replaceRoot:{
                newRoot:"$VideoDetails"
            }
        }
    ])
    return res.status(200).json(
    new ApiResponse(
            200,
            likedVideos,
            "Liked videos fetched successfully"
        )
    );
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}