import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/")
    .post(verifyJWT, createPlaylist);

router.route("/user/:userId")
    .get(verifyJWT, getUserPlaylists);

router.route("/:playlistId")
    .get(verifyJWT, getPlaylistById)
    .patch(verifyJWT, updatePlaylist)
    .delete(verifyJWT, deletePlaylist);

router.route("/add/:videoId/:playlistId")
    .patch(verifyJWT, addVideoToPlaylist);

router.route("/remove/:videoId/:playlistId")
    .patch(verifyJWT, removeVideoFromPlaylist);

export default router;