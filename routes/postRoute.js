import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
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
            data:{
            title,
            content,
            authorId
        }});
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

router.put("/:id",authMiddleware,async (req,res)=>{
    const {title,content} = req.body;
    const userId = req.user.userId;
    const postId = parseInt(req.params.id);

    try {

        const post = await prisma.post.findUnique({where:{id:postId}});

        if(!post){
            return res.status(404).json("post not found");
        }
        if(post.authorId !== userId){
            return res.status(403).json("FORBIDDEN:you do not have access to this post");
        }
        const updatedpost = await prisma.post.update({
            where:{id:postId},
            data:{
                title,
                content
            },
        });
        res.status(200).json(updatedpost);
    } catch (error) {
        res.status(500).json("server error");
    }

    router.delete("/:id",authMiddleware,async (req,res)=>{
        const postId = parseInt(req.params.id);
        const authorId = req.user.userId;
        const loggedInUser = req.user;

        try {
            const post = await prisma.post.findUnique({where:{id:postId}});

            const isAuthor = post.authorId === loggedInUser.userId;
            const isAdmin = loggedInUser.role === "ADMIN";
            if(!post){
                return res.status(404).json("post not found");
            }
            if(post.authorId !== userId){
                return res.status(403).json("FORBIDDEN:you do not have access to this post");
            }
            const deleted = await prisma.post.delete({
                where:{id:postId}
            })
            res.status(200).json("post deleted");
        } catch (error) {
            res.status(500).json("server error");
        }
    })

})
export default router;



