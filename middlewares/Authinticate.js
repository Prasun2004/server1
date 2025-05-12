import  Jwt  from "jsonwebtoken";

const isAuthenticated =async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message:"user not login",
                success:false
            })
        }
        const decode=await Jwt.verify(token,process.env.SECRET_KEY);
        if (!decode) {
            return req.status(401).json({
                message:"invaild token",
                success:false
            })
        }
        req.id= decode.userId;
        next();
    } catch (error) {
        console.log(error)
    }
}

export default isAuthenticated;