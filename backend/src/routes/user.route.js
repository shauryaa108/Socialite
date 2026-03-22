import { Router } from "express";
import { registerUser, loginUser, loggedout, refreshAccessToken, changeCurrentPassword, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory, getCurrentUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        { 
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, loggedout)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").patch(verifyJWT , changeCurrentPassword)
router.route("/users/me").patch(verifyJWT , updateAccountDetails)
router.route("/users/me").get(verifyJWT, getCurrentUser);
router.route("/update-avatar").patch(verifyJWT , upload.single("avatar"), updateUserAvatar)
router.route("/update-cover-image").patch(verifyJWT , upload.single("coverImage") , updateUserCoverImage)
router.route("/c/:username").get(getUserChannelProfile)
router.route("/watch-history").get(verifyJWT , getWatchHistory)


export {router}