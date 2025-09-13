import { Router } from "express";
import authMiddleware from "../middleware/authmiddleware";
const router = Router();

router.get("/test",authMiddleware,(req,res)=>{
     res.json({
        message: 'You have accessed a protected route!',
        user: req.user 
    });
})

export default router;



