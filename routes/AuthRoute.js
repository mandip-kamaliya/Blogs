import express from "express";
import  { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient  } from "@prisma/client";
import "dotenv/config"
const router = Router();

const prisma = new PrismaClient();

router.post("/register",async (req,res)=>{
    const {username , password} = req.body;

    if(!username || !password){
        return res.status(400).json("username or password not found");
    }

  try {
      const existinguser = await prisma.user.findUnique(
          {where : {username}}
      )
  
      if(existinguser){
          return res.status(401).json("user is already existed!!");
      }
  
      const hashedpassword = await bcrypt.hash(password,10);

      const NewUser = await prisma.user.create({
        data:{
            username,
            password:hashedpassword
        }
      })
      res.status(200).json({
        id:NewUser.id,
        username:NewUser.username,
        role:NewUser.role
      })
  } catch (error) {
        console.error(error);
        res.status(500).json("Server Error");
  }

})

router.post("/login",async (req,res)=>{
    const {username,password} = req.body;

    if(!username || !password){
        return res.status(400).json("username or password is not existed!!!");
    }

   try {
     const user = await prisma.user.findUnique({
         where : {username}
     })
     if(!user){
        return res.status(400).json("Invalid Credientials");
     }

     const isPasswordValid  = await bcrypt.compare(password,user.password);
     if(!isPasswordValid){
        return res.status(400).json("Invalid password");
     }

     const token = jwt.sign(
        {
            userId : user.id,
            role:user.role
        },
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
     )
     res.status(200).json({token});
   } catch (error) {
    console.error(error);
    res.status(500).json("server error");
   }
})

export default router;