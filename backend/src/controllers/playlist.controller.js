import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { HandleAsync } from "../utils/HandleAsync.js"
import { User } from "../models/user.model.js"

const checkPlaylistOwnership = async (playlistId, userId) => {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist");
    }

    return playlist;
};

const createPlaylist = HandleAsync(async (req, res) => {
    const {name, description} = req.body
    if(!name){
        throw new ApiError(400, "A name is required")
    }
    const playlist = await Playlist.create({
        name : name,
        description: description,
        videos : [],
        owner: req.user?._id
    })
    if(!playlist){
        throw new ApiError(400, "Unable to create the playlist")
    }
    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully")
    )
    //TODO: create playlist
})

const getUserPlaylists = HandleAsync(async (req, res) => {
    const {userId} = req.params
    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Need a valid userId")
    }
    const UserPlaylist = await Playlist.aggregate([
        {
            $match:{
                owner : new mongoose.Types.ObjectId(userId)
            }
        }
    ])
    return res.status(200).json(
        new ApiResponse(200, UserPlaylist, "User playlists fetched successfully")
    )
    //TODO: get user playlists
})

const getPlaylistById = HandleAsync(async (req, res) => {
    const {playlistId} = req.params
    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id");
    }
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(400, "playlist not found or unable to fetch the playlist");
    }
    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetch successful")
    )
    //TODO: get playlist by id
})

const addVideoToPlaylist = HandleAsync(async (req, res) => {

    /* MAJOR EDGE CASE
        One remaining logical issue: a valid videoId doesn't guarantee that the video actually exists. 
        Depending on route design, you may want to check Video.findById(videoId) before adding it.
    */

   
   const {playlistId, videoId} = req.params
   if(!mongoose.isValidObjectId(playlistId)){
       throw new ApiError(400, "Invalid playlist id");
    }
    await checkPlaylistOwnership(playlistId, req.user._id)
    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId, 
        {
            $addToSet:{
                videos : videoId
            }
        },
        {
            new: true
        }
    )
    if(!updatedPlaylist){
        throw new ApiError(404, "Cannot update the playlist or playlist not found")
    }
    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    )
})

const removeVideoFromPlaylist = HandleAsync(async (req, res) => {
    /* MAJOR EDGE CASE
        It returns true even if the video wasn't in the playlist
        <----handle it on frontend but add membership check on backend too later for security---->
    */

    const {playlistId, videoId} = req.params
    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id");
    }
    await checkPlaylistOwnership(playlistId, req.user._id)
    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId, 
        {
            $pull:{
                videos : videoId
            }
        },
        {
            new: true
        }
    )
    if(!updatedPlaylist){
        throw new ApiError(404, "Cannot update the playlist or playlist not found")
    }
    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    )
    // TODO: remove video from playlist


})

const deletePlaylist = HandleAsync(async (req, res) => {
    const {playlistId} = req.params
    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id");
    }
    await checkPlaylistOwnership(playlistId, req.user._id)
    const deleteResponse = await Playlist.findByIdAndDelete(playlistId)
    if(!deleteResponse){
        throw new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(
        new ApiResponse(200, {}, "Playlist deleted successfully")
    )
    // TODO: delete playlist

})

const updatePlaylist = HandleAsync(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id");
    }
    await checkPlaylistOwnership(playlistId, req.user._id)
    const update = {}
    if(name != undefined){
        if (!name.trim()) {
            throw new ApiError(400, "Playlist name cannot be empty");
        }
        update.name = name
    }
    if(description != undefined){
        update.description = description
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId, 
        {
            $set: update
        },
        {
            new : true
        }
    )
    if(!updatedPlaylist){
        throw new ApiError(400, "Cannot update the playlist")
    }
    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    )
    //TODO: update playlist
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