import express from "express";
import { getuserProfile, login, logout, register, updateProfile } from "../controller/userController.js";
import isAuthenticated from "../middlewares/Authinticate.js";
import upload from "../utils/multer.js";


const router =express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated,getuserProfile);
router.route("/profile/update").put(isAuthenticated,upload.single("profilePhoto"),updateProfile);

export default router;