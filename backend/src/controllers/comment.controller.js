import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {HandleAsync} from "../utils/HandleAsync.js"


// route :- /comment/:videoId {get}
const getVideoComments = HandleAsync(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const comments = await Comment.find({
        video : videoId
    })
    .sort({createdAt : -1})
    .skip(Number(page-1)*Number(limit))
    .limit(Number(limit))
    
    return res.status(200).json(
        new ApiResponse(
            200,
            comments,
            "All comments fetched successfully"
        )
    )

})


// route :- comment/:videoId {post}
const addComment = HandleAsync(async (req, res) => {
    // TODO: add a comment to a video
    // to add a comment on a video, i need the content of the comment from req.body, need the user from req.user and need the video id from req.params
    const {videoId} = req.params
    const userId = req.user?._id
    const { content } = req.body
    if(!content?.trim()){
        throw new ApiError(400, "Comment can not be empty");
    }
    if(!userId){
        throw new ApiError(401, "Unauthorised action");
    }
    const comment = await Comment.create({
        content : content.trim(),
        video : videoId,
        owner : userId
    })
    return res.status(201).json(
        new ApiResponse(201, comment, "commnet posted successfully")
    )
})


// route :- comment/:commentId {patch}
const updateComment = HandleAsync(async (req, res) => {
    // TODO: update a comment
    // we need commentId
    // we need videoId
    // we need userId
    // verify if current user is the owner
    const {content} = req.body
    const userId = req.user?._id;
    const { commentId } = req.params;

    if (!content?.trim()) {
        throw new ApiError(400, "Comment cannot be empty");
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404, "Comment not found");
    }

    if(!comment.owner.equals(userId)){
        throw new ApiError(403, "Unauthorised request")
    }
    comment.content = content.trim();
    await comment.save();
    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated")
    )
})


// route :- comment/:commentId {delete}
const deleteComment = HandleAsync(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const userId = req.user?._id
    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }
    if(!comment.owner.equals(userId)){
        throw new ApiError(403, "Unauthorised request");
    }
    await comment.deleteOne();
    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }