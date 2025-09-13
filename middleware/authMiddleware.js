import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next) =>{
    const authheader = req.header.authorization;

    if(!authheader || authheader.startsWith('Bearer')){
        return res.status(401).json("header not available");
    }

    const token = authheader.split(" ")[1];

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
    
        req.user = decoded;
        next();
    } catch (error) {
       return res.status(401).json("server error");
    }
}

export default authMiddleware;