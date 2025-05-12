import express from "express";
import isAuthenticated from "../middlewares/Authinticate.js";
import upload from "../utils/multer.js";
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorCourse, getLectureById, getPublishedCourse, removeLecture, searchCourse, togglePublishCourse } from "../controller/courseController.js";


const router =express.Router();

router.route("/").post(isAuthenticated,createCourse);
router.route("/search").get(isAuthenticated,searchCourse);
router.route("/").get(isAuthenticated,getCreatorCourse);
router.route('/published-course').get(getPublishedCourse);
router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"),editCourse);
router.route("/:courseId").get(isAuthenticated,getCourseById);
router.route("/:courseId/lecture").post(isAuthenticated,createLecture);
router.route("/:courseId/lecture").get(isAuthenticated,getCourseLecture);
router.route("/lecture/:lectureId").get(isAuthenticated,getLectureById);
router.route("/lecture/:lectureId").delete(isAuthenticated,removeLecture);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated,editLecture);
router.route("/:courseId").patch(isAuthenticated,togglePublishCourse);


export default router;