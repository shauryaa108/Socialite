import { ApiError } from "../utils/ApiError.js";
import { HandleAsync } from "../utils/HandleAsync.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Video } from "../models/video.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import deletefromcloudinary from "../utils/deletefromcloudinary.js";

const getAllVideos = HandleAsync(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    // to filter videos on the basis of title containing the query word and owner ahving the same id as the certain user
    const filter = {
        isPublished:true,
        ...(userId && {owner : userId}),
        ...(query && {
            title : {$regex : query, $options : "i"}, // i helps in ignoring the casing
        }),
        
    }

    // let's now set up the sort functions to get either deswcending or ascending order of values on a page
    const sortOptions = {}
    if(sortBy){
        sortOptions[sortBy] = sortType === "asc" ? 1 : -1
    }

    const videos = await Video.find(filter)
    .sort(sortOptions)
    .skip((Number(page) - 1)*Number(limit))
    .limit(Number(limit))

    return res.status(200).json(new ApiResponse(200, videos , "All videos fetched successfully"))


})

const publishAvideo = HandleAsync(async (req, res) => {
    const {title, description} = req.body
    // to uplaod video use upload.single
    // to get video, i can't use the title as two videos can have same title and description
    // there should be the video in the req itsef
    if(!title || !description){
        throw new ApiError(400, {} , "need title, thumbnail and description")
    }


    
    //* get video file
    const videoFile = req.files?.videoFile?.[0];
    
    if(!videoFile){
        throw new ApiError(400, {} , "need video")
    }
    //* upload on cloudinary
    const uploadVideo = await uploadOnCloudinary(videoFile.path)
    
    if(!uploadVideo || !uploadVideo.secure_url){
        throw new ApiError(400, {} , "video upload on cloudinary failed")
    }
    const thumbnail = req.files?.thumbnail?.[0];
    if(!thumbnail){
        throw new ApiError(400, {}, "need thumbnail")
    }

    const uploadThumbnail = await uploadOnCloudinary(thumbnail.path)
    
    if(!uploadThumbnail || !uploadThumbnail.secure_url){
        throw new ApiError(400, {} , "Thumbnail upload on cloudinary failed")
    }
    //* create video document
    const video = await Video.create(
        {
            title,
            description,
            thumbnail : uploadThumbnail.secure_url,
            videoUrl : uploadVideo.secure_url,
            owner : req.user?._id
    }
    )
    return res
    .status(200)
    .json(new ApiResponse(200, video , "video uploaded successfully"))

})

const getVideoById = HandleAsync(async (req, res) => {
    const { videoId } = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, {} , "Invalid video id")
    }
    //TODO: get video by id
    const video = await Video.findById(videoId).populate("owner", "username avatar")
    if(!video){
        throw new ApiError(404, {} , "Video can't be fetched")
    }
    return res.status(200).json(new ApiResponse(200, video, "video fetched successfully"))
})

const updateVideo = HandleAsync(async (req, res) => {
    const { videoId } = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, {} , "Wrong/invalid video id")
    }
    const existingVideo = await Video.findById(videoId);

    if(!existingVideo){
        throw new ApiError(404, {}, "Video doesn't exists")
    }

    if(!existingVideo.owner.equals(req.user._id)){
        throw new ApiError(403, "Unauthorized");
    }
    //TODO: update video details like title, description, thumbnail
    const {newTitle, newDescription} = req.body
    const newThumbnailPath = req.file?.path
    let updatedthumbnail = null
    if(newThumbnailPath){
        updatedthumbnail = await uploadOnCloudinary(newThumbnailPath)
    }
    if(newThumbnailPath && !updatedthumbnail){
        throw new ApiError(400, {}, "Thumbnail upload failed")
    }
    const updateFields = {
        ...(newTitle && {title : newTitle}),
        ...(newDescription && {description : newDescription}),
        ...(updatedthumbnail && {
    thumbnail: updatedthumbnail.secure_url
})
    }
    if(Object.keys(updateFields).length === 0 ){
        throw new ApiError(400, {}, "There is nothing we can do [update] haha")
    }
    const video = await Video.findByIdAndUpdate(videoId, 
        {
            $set : updateFields
        },
        {new : true},
    )
    if(!video){
        throw new ApiError(400, {} , "Unable to update the video")
    }
    return res.status(200).json(new ApiResponse(200, video , "Video updated successfully"))
})

const deleteVideo = HandleAsync(async (req, res) => {
    const { videoId } = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, {} , "invalid video id")
    }
    const userId = req.user?._id
    if(!userId){
        throw new ApiError(403 , {} , "unverified user action")
    }
    const existingVideo = await Video.findById(videoId)
    if(!existingVideo){
        throw new ApiError(404 , {} , "video can't be fetched to perform the delete action")
    }
    if(!existingVideo.owner.equals(userId)){
        throw new ApiError(403 , {} , "you don't have the access to delete this video")
    }
    const deletedVideo = await Video.findByIdAndDelete(videoId)
    if(!deletedVideo){
        throw new ApiError(404 , {} , "video doesn't exist in the database")
    }
    if(deletedVideo.publicId){
        try {
            await deletefromcloudinary(deletedVideo.publicId)
        } catch (error) {
            console.log(error.message)
        }
    }
    return res.status(200).json(new ApiResponse(200, deletedVideo , "video is deleted from the databse successfully"))
})

const toggleUploadStatus = HandleAsync(async (req, res) => {
    // update toggle status means is it private or public , not including restricted for now
    // we will need to get the video after getting the video we only need to set it's isPublushed status to false or true weather what we want 
    /*
    isPublished:{
        type : Boolean,
        default:true
    }
    */
   // we can get videoId by req.params
   const { videoId } = req.params
   if(!videoId){
    throw new ApiError(400 , "can not get the video id or video id not found")
   }
   if(!mongoose.isValidObjectId(videoId)){
    throw new ApiError(400 , "can not get the video id or video id not found")
   }
   const toggledVideo = await Video.findOneAndUpdate(
	{
		_id : videoId,
		owner : req.user?._id
	} , [
		{
			$set: {
				isPublished : {$not : "$isPublished"}
			}
		}
	], {new : true}
   )
   if(!toggledVideo){
	throw new ApiError(400 , "video status can't be toggeled")
   }
   return res.status(200).json(new ApiResponse(200 , toggledVideo , "Video status toggled successfully"))
})

export {
    publishAvideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
	toggleUploadStatus
}