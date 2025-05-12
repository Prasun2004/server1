import User from "../models/usermodels.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcryptjs";

export const register =async (req,res)=>{
    try {
        const {name,email,password}=req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success:false,
                message:"please enter all details"
            })
        }
            const user=await User.findOne({email});
            if (user) {
                return res.status(400).json({
                    success:false,
                    message:"user exist already"
                })
            }
            const hashpassword=await bcrypt.hash(password,5);
            await User.create({
                name,
                email,
                password:hashpassword
            });
            console.log(name,email);
            return res.status(201).json({
                data:{
                  name,
                  email,
                  hashpassword
                },
                success:true,
                message:"registration successfully completed"
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"failed  to registration"
        })
    }
}

export const login =async(req,res)=>{
    try {
        const {email,password}=req.body;
        if ( !email || !password) {
            return res.status(400).json({
                success:false,
                message:"please enter all details"
            })
        }
            const user=await User.findOne({email});
            if (!user) {
                return res.status(400).json({
                    success:false,
                    message:"user doesnot exist"
                })
            }
             const isPassword=await bcrypt.compare(password,user.password);
             if (!isPassword) {
                return res.status(400).json({
                    success:false,
                    message:"incorrect password"
                })
            }
            generateToken(res,user,`welcome back ${user.name}`);  
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"failed  to login"
        })
    }
}

export const logout =async(req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            success:true,
            message:"logout successful"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"failed  to logout"
        })
    }
}

export const getuserProfile=async(req,res)=>{
     try {
        const userId=req.id;
        const user =await User.findById(userId).select("-password").populate("enrolledCourses");
        if (!user) {
            return res.status(404).json({
                message:"profile not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
     } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"failed  to get user profile"
        })
     }
}

export const updateProfile =async(req,res)=>{
    try {
        const userId=req.id;
        const {name,role}=req.body;
        
        const profilePhoto =req.file;
       // console.log(profilePhoto,"117");
        const user =await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message:"user not found",
                success:false
            })
        }

        if (user.photoUrl) {
            const publicId=user.photoUrl.split("/").pop().split(".")[0];
            
            deleteMedia(publicId);
        }
        const cloudResponse= await uploadMedia(profilePhoto.path);
        const photoUrl =cloudResponse.secure_url;
      
        const updateData ={name,photoUrl,role};
        const updateUser=await User.findByIdAndUpdate(userId,updateData,{new:true}).select("-password");
       
        return res.status(200).json({
            message :"user profile updated",
            success:true,
            updateUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"failed  to update user profile"
        })
    }
}
