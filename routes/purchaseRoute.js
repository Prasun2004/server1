import express from 'express';
import isAuthenticated from "../middlewares/Authinticate.js";
import { createCheeckoutSession, getAllPurchasedCourse, getCourseDetailsPurchaseStatus, stripeWebhook } from '../controller/purchaseCourseController.js';

const router=express.Router();

router.route('/cheeckout/create-cheeckout-session').post(isAuthenticated,createCheeckoutSession);
router.route('/webhook').post(express.raw({type:'application/json'}),stripeWebhook);
router.route('/course/:courseId/details-with-status').get(isAuthenticated,getCourseDetailsPurchaseStatus);
router.route('/').get(isAuthenticated,getAllPurchasedCourse);

export default router;