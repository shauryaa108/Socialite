import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { toggleVideoLike, getLikedVideos, toggleCommentLike, toggleTweetLike } from "../controllers/likes.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getLikedVideos)
router.route("/video/:videoId").post(verifyJWT, toggleVideoLike)
router.route("/comment/:commentId").post(verifyJWT, toggleCommentLike)
router.route("/tweet/:tweetId").post(verifyJWT, toggleTweetLike)

export default router;
