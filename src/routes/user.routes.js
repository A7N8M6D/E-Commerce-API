import { Router } from "express";
import { loginUser, registerUser,GetCurrentUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/SignUp").post(registerUser);
router.route("/SignIn").post(loginUser);
router.route("/GetProfile").get( verifyJWT, GetCurrentUser);

export default router;