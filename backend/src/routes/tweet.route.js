import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from '../controllers/tweet.controller.js';

import { Router } from 'express';
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route('/publish').post(verifyJWT, createTweet);
router.route('/user/:userId').get(verifyJWT, getUserTweets);
router.route('/:tweetId')
.patch(verifyJWT, updateTweet)
.delete(verifyJWT, deleteTweet);

export default router