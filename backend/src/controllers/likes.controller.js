import { HandleAsync } from '../utils/HandleAsync.js'
import {Video} from '../models/video.model.js'
import { Like } from '../models/like.model.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'

const toggleVideoLike = HandleAsync(async (req, res) => {
    const { videoId } = req.params
    const user = req.user
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400 , {} ,"video not found")
    }
    const existingLike = await Like.findOne(
        {video : video._id, likedBy : user._id}
    )
    if(existingLike){
        const UpdatedVideo = await Like.deleteOne(
            {   video : video._id,
                likedBy : user._id
            }
        )
        return res.status(200).json(new ApiResponse(200, UpdatedVideo , "Like removed successfully"))
    }
    const UpdatedVideo = await Like.create({
        video : video._id,
        likedBy : user._id
    })
    return res.status(200).json(new ApiResponse(200, UpdatedVideo , "Like added successfully"))
})


export default {
    toggleVideoLike
}