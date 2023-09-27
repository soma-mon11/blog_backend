import express from "express"
import { Sequelize } from 'sequelize';
import userDetails from "./Router/Route.js";
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import serveStatic from 'serve-static';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const sequelize=new Sequelize('blog_project','root','',{
    host:"localhost",
    dialect:"mysql"

});

 const app=express();


 app.use(express.json({ limit: "10mb" }))
 app.use(express.urlencoded({ limit: "10mb",extended: true }));
 app.use(cors({
    origin:["http://localhost:3000","http://localhost:3001"],
    methods:["POST","GET","DELETE","PUT"],
    credentials:true
 }
 
 ))
 app.use(cookieParser())
 app.use(serveStatic(join(__dirname, 'multiple-uploads')));
 


 userDetails(app)

 async function Start_database(){
    try{
        await sequelize.authenticate();
        console.log("connectionhas been established successfully")
        app.listen(8000,()=>{
            console.log('our server is connecting on port 8000')

        })
 
    }
    catch(error){
        console.log('unable to connect')
    }
 }
 Start_database();