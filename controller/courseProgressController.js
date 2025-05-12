import { Course } from "../models/coursemodels.js";
import { CourseProgress } from "../models/courseProgressmodels.js";

export const getCourseProgress =async(req,res)=>{
    try {
        const {courseId} =req.params;
        const userId =req.id;

     
        
        let courseProgress =await CourseProgress.findOne({courseId,userId}).populate("courseId");
        

        const courseDetails =await Course.findById(courseId).populate("lectures");


        if (!courseDetails) {
            return res.status(404).json({
                message:"course not found"
            })
        }

        if (!courseProgress) {
            return res.status(200).json({
                message:"get course details",
                data:{
                    courseDetails,
                    progress:[],
                    completed:false
                }
            })
        }

        return res.status(200).json({
            message:"get course progress details",
            data:{
                courseDetails,
                progress:courseProgress.lectureProgress,
                completed:courseProgress.completed
            }
        })
    } catch (error) {
       console.log(error);
       return res.status(500).json({
         message:"course progress not found"
       }) 
    }
}

export const updateLectureProgress =async(req,res)=>{
    try {
        const {lectureId,courseId} =req.params;
        const userId =req.id;
       
        let courseProgress =await CourseProgress.findOne({courseId,userId});
       
        
        if (!courseProgress) {
                courseProgress =  new CourseProgress({
                    userId,
                    courseId,
                    completed:false,
                    lectureProgress:[]
                });
        }
        
        const lectureIndex =courseProgress.lectureProgress.findIndex((lecture)=>lecture.lectureId === lectureId);
       
        if (lectureIndex !== -1) {
            courseProgress.lectureProgress[lectureIndex].viewed=true;
        }else{
            courseProgress.lectureProgress.push({
                lectureId,
                viewed:true
            });
        }

        const lectureProgressLength  = courseProgress.lectureProgress.filter((lectureProg)=> lectureProg.viewed).length;

        const course =await Course.findById(courseId);

        if (course.lectures.length === lectureProgressLength) {
            courseProgress.completed=true
        }

        await courseProgress.save();

        res.status(200).json({
            message:"lecture progress update successful"
        })

    } catch (error) {
        console.log(error);
       return res.status(500).json({
         message:"fail to update lecture progress"
       }) 
    }
}

export const  markAsCompleted =async(req,res)=>{
    try {
        const userId =req.id;

        const {courseId} =req.params;

        const courseProgress = await CourseProgress.findOne({courseId,userId});

        if (!courseProgress) {
            return res.status(404).json({
                message:"course progress not found for mark as complete"
            });
        }
        courseProgress.lectureProgress.map((lectureProg)=>lectureProg.viewed = true);

        courseProgress.completed=true;
        await courseProgress.save();

        return res.status(200).json({
            message:"successfully course mark as comlete"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          message:"fail to mark as complete lecture progress"
        }) 
    }
}

export const  markAsIncompleted =async(req,res)=>{
    try {
        const userId =req.id;

        const {courseId} =req.params;

        const courseProgress = await CourseProgress.findOne({courseId,userId});

        if (!courseProgress) {
            return res.status(404).json({
                message:"course progress not found for mark as Incomplete"
            });
        }
        courseProgress.lectureProgress.map((lectureProg)=>lectureProg.viewed = false);

        courseProgress.completed=false;
        await courseProgress.save();

        return res.status(200).json({
            message:"successfully course mark as Incomlete"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          message:"fail to mark as complete lecture progress"
        }) 
    }
}