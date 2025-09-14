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

router.post("/",authMiddleware,async (req,res)=>{
    const {title,content} = req.body;
    const authorId = req.user.userId;

    if(!title || !content){
        return res.status(400).json("Title and content are requird");
    }

    try {
        const newPost = await prisma.post.create({
            title,
            content,
            authorId
        });
        res.status(201).json(newPost);

    } catch (error) {
         res.status(500).json("server error");
    }
})

router.get("/",authMiddleware,async (req,res)=>{
    try {
        const posts =await prisma.post.findMany({
            include: { author: { select: { username: true } } }, 
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json("server error");
    }
})
export default router;



