import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { toggleVideoLike } from "../controllers/likes.controller.js";

const router = Router();

router.route("/video/:videoId)").post(verifyJWT, toggleVideoLike)

export default (router)
