import { Router } from "express";
import authMiddleware from "../middleware/authmiddleware";
const router = Router();
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

router.get("/test",authMiddleware,(req,res)=>{
     res.json({
        message: 'You have accessed a protected route!',
        user: req.user 
    });
});

router.post("/post")

export default router;



