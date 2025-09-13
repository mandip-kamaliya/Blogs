import express from "express";
import "dotenv/config";

import AuthRoute from "./routes/AuthRoute.js";
import postRoute from "./routes/postRoute.js"

const app = express();

app.use(express.json());

app.use("/api/auth",AuthRoute);

app.use("/api/posts",postRoute);

const port = process.env.PORT || 3000 ; 

app.get("/",(req,res)=>{
    res.status(200).json("Api is running!!");
})



app.listen(port, ()=>{
    console.log(`server is runnign on ${port} port`);
})