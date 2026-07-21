import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js";

const router = Router();

router.route("/c/:channelId")
    .post(verifyJWT, toggleSubscription);

router.route("/c/:channelId/subscribers")
    .get(verifyJWT, getUserChannelSubscribers);

router.route("/subscribed-channels")
    .get(verifyJWT, getSubscribedChannels);

export default router;