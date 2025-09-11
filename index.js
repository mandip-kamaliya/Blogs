import express from "express";
import "dotenv/config";

import AuthRoute

const app = express();

const port = process.env.PORT || 3000 ; 

app.get("/",(req,res)=>{
    res.status(200).json("Api is running!!");
})

app.listen(port, ()=>{
    console.log(`server is runnign on ${port} port`);
})