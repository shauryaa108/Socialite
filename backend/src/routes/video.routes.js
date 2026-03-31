import { Router } from "express";
import { publishAvideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/publish").post(verifyJWT, publishAvideo)

export default (router)