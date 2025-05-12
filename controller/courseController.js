import { Course } from "../models/coursemodels.js";
import { Lecture } from "../models/lecturemodels.js";
import { deleteMedia, deleteVideo, uploadMedia } from "../utils/cloudinary.js";

export const createCourse =async(req,res)=>{


    //console.log(req,res);
    try {
        const {courseTitle,category}=req.body;
        if(!courseTitle || !category){
            return res.status(400).json({
                message:"enter all details",
                success:false
            })
        }
        const course= await Course.create({
            courseTitle,
            category,
            creator:req.id
        });
        return res.status(201).json({
            course,
            message:"course creted",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to create course",
            success:false
        })
    }
}

export const getPublishedCourse= async(req,res)=>{
    try {
        const courses=await Course.find({isPublish:true}).populate({path:'creator',select:"name photoUrl"});
        if (!courses) {
            return res.status(404).json({
                message:"course not found",
                success:false
            });
        }
        return res.status(200).json({
            courses,
            message:"succesfully fetch",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to get course",
            success:false
        })
    }
}

export const  searchCourse =async(req,res)=>{
    try {
        const {query="",categories=[], sortByPrice =""} =req.query;
        const searchCriteria ={
            isPublish:true,
            $or:[
                {courseTitle :{$regex:query, $options:"i"}},
                {subTitle :{$regex:query, $options:"i"}},
                {category :{$regex:query, $options:"i"}}
            ]
        }

        if (categories.length >0) {
            searchCriteria.category ={$in : categories}
        }
        const sortOptions={};
       
        if (sortByPrice ==="low") {
            sortOptions.coursePrice= -1; // sort by price in asending order
        } else if (sortByPrice ==="high") {
            sortOptions.coursePrice = 1 //decending order
        }

        let courses =await Course.find(searchCriteria).populate({path:"creator",select:"name photoUrl"}).sort(sortOptions);

         return res.status(200).json({
            success:true,
            courses:courses || [],
            message:"sucessful find search course"
         })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to get course following search",
            success:false
        })
    }
}
export const getCreatorCourse= async (req,res)=>{
    try {
        const userId =req.id;
        const course=await Course.find({creator :userId});
        if (!course) {
            return res.status(404).json({
                courses:[],
                message :"course not found"
            })
        };
        return res.status(200).json({
            course,
            message:"course successfully create"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to create course",
            success:false
        })
    }
}

export const editCourse =async(req,res)=>{

    try {

        const courseId=req.params.courseId;
       
        const {courseTitle, subTitle,description,category,courseLevel,coursePrice} =req.body; 
        
       
        const thumbnail=req.file;
    
        let course =await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({
                message:"course not found",
                
            })
        };
        let courseThumbnail;

        if (thumbnail) {
            if (course?.courseThumbnail) {
                const publicId=course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMedia(publicId);
            }

            courseThumbnail =await uploadMedia(thumbnail.path);
        }
        
        const updateData={courseTitle, subTitle,description,category,courseLevel,coursePrice,courseThumbnail:courseThumbnail?.secure_url};
        
        course=await Course.findByIdAndUpdate(courseId,updateData,{new:true});
      //  console.log(course);

        return res.status(200).json({
            course,
            message:"course update successfully",
           
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to create course",
            success:false
        })
    }
}

export const getCourseById =async(req,res)=>{
   
    try {
        
        
        const course= await Course.findById(req.params.courseId);
        // console.log(course);

        if (!course) {
            return res.status(404).json({
                message:"course not found",
                success:false
            }) 
        };

        return res.status(200).json({
            course,
            message:"course  found",
            
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to get course",
            success:false
        }) 
    }
}

export const createLecture =async(req,res)=>{
    try {
        const{lectureTitle} =req.body;
        const {courseId} =req.params;

       

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"lecture id and lecturetitle not found"
            });
        };
       
        const lecture= await Lecture.create({lectureTitle});

        const course =await Course.findById(courseId);

        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }
       
        return res.status(201).json({
            course,
            message:"lecture create successful",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to create lecture",
            success:false
        }) 
    }
}

export const getCourseLecture =async(req,res)=>{
    try {
        const {courseId}=req.params;
        // console.log(courseId);
        const course =await Course.findById(courseId).populate("lectures");

        //console.log(course);
        if (!course) {
            return res.status(404).json({
                message:"course not found",
            });
        }
        return res.status(200).json({
            lectures:course.lectures,
            message:"lecture found"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to get lecture",
            success:false
        }) 
    }
}

export const editLecture =async(req,res)=>{
    try {
        const {lectureTitle,ispreviewFree,videoInfo}=req.body;
        const {courseId,lectureId}=req.params;
       
        const lecture =await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message:"lacture not found"
            })
        };
        if (lectureTitle) {
            lecture.lectureTitle=lectureTitle
        }
        if (videoInfo) {
            lecture.videoUrl=videoInfo.videoUrl
            lecture.publicId=videoInfo.publicId
        }
        if (ispreviewFree) {
            lecture.isPreviewFree=ispreviewFree
        }
        
        await lecture.save();

        const course =await Course.findById(courseId);

        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save()
        };
       
        
        return res.status(201).json({
            message:"lecture update succfully",
            lecture,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to edit lecture",
            success:false
        })
    }
}

export const removeLecture=async(req,res)=>{
    try {
        const {lectureId}=req.params;
        const lecture=await Lecture.findByIdAndDelete(lectureId);
        if (!lectureId) {
            return res.status(404).json({
                message:"lecture not found"
            });
        }

        if (lecture.publicId) {
            await deleteVideo(lecture.publicId);
        }
        
        await Course.updateOne(
            {lectures:lectureId},
            {$pull:{lectures:lectureId}} // pull use for remove lectureid form course collection
        );

        return res.status(200).json({
            message:"lecture remove successful",
            success:true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to remove lecture",
            success:false
        })
    }
}

export const getLectureById=async(req,res)=>{
    try {
        const {lectureId}=req.params;
        
        const lecture=await Lecture.findById(lectureId);
        if (!lectureId) {
            return res.status(404).json({
                message:"lecture not found"
            });
        }
        return res.status(201).json({
            message:"lecture found",
            lecture,
            success:true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to get lecture by id",
            success:false
        })
    }
}

export const togglePublishCourse =async(req,res)=>{
    try {
         const {courseId} =req.params;
         const {publish}=req.query;
         
         const course =await Course.findById(courseId);
         if (!courseId) {
            return res.status(404).json({
                message:"course not found"
            });
        }
        
        course.isPublish=publish==="true";

        await course.save();
        
        const statusmessage=course.isPublish?"Published" :"unpublished"

        return res.status(200).json({
            message: `course is ${statusmessage}`,
            course,
            success:true
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"fail to update status",
            success:false
        })
    }
}