// import express from "express"
import { userRegister,  userLogin, logout}  from "../Controller/Controller.js"
import {EditUser, getComments, getPost, getPosts, postComments, userDelete, writePost} from '../../server/Controller/PostController.js'
import multer from'multer';
import { getAllPost,DeleteAllAdminPost, DeleteAllAdminPost1, ActiveStatus} from "../../server/Controller/AdminController.js";
import {verifyClaimWithoutSecret}  from "../../server/Token/Token.js";
const upload = multer({ dest: "multiple-uploads/" });


  const userDetails=(app)=>{
        app.post('/register',upload.array("profile_photo"),userRegister )    
        app.post('/login', userLogin)    
        app.post('/logout',logout)
        app.get('/getposts',verifyClaimWithoutSecret ,getPosts)
        app.get('/getpost/:writeid',getPost)
        app.delete('/deleteUser',userDelete)
        app.post('/write',upload.array("Photo_upload"),writePost)
        app.put('/write',upload.array("Photo_upload"),EditUser)
        app.get('/getall',getAllPost)
        app.delete('/deladmin',DeleteAllAdminPost)
        app.delete('/deladmin1',DeleteAllAdminPost1)
        app.post('/postcoment',postComments)
        app.get('/getcomment',getComments)
        app.put('/mode',ActiveStatus)
       
      
  } 
export default userDetails