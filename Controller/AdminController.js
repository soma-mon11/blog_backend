import { QueryTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize('blog_project', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export const getAllPost=async(req,res)=>{
    try{
     const getall=await sequelize.query(`SELECT * from registration INNER JOIN status_table ON status_table.status_id=registration.status_id`,{type:QueryTypes.SELECT})
     if (getall.length > 0) {
        res.status(200).json(getall)

    }
    else {
        res.json({
            error: false,
            message: 'No user found',
            data: getall,
        })
    }}
    catch(err){
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        }

    }

 }
 export  const DeleteAllAdminPost=async(req,res)=>{
    try{
        const delwritepost=await sequelize.query(`DELETE from write_post WHERE writeid=${req.query.writeid}`,{type:QueryTypes.DELETE})
        res.status(200).json({ message: "Post deleted successfully." });
    }
    catch(err){
        if(err){
            res.status(500).json({error:'Internal server error' })
        }

    }
 }
 export  const DeleteAllAdminPost1=async(req,res)=>{
    try{
        const delwritepost1=await sequelize.query(`DELETE from registration WHERE user_id=${req.query.user_id}`,{type:QueryTypes.DELETE})
        res.status(200).json({ message: "Post deleted successfully." });
    }
    catch(err){
        if(err){
            res.status(500).json({error:'Internal server error' })
        }

    }
 }
 export const EditAdminUser=async(req,res)=>{
    if(!req.files || req.files.length===0){
        return res.status (400).send ("no images uploaded")
      }
      const uploaded=req.files.map((file)=>{
        const newfilename=file.originalname;
        const filepath=path.join("multiple-uploads/",newfilename)
        fs.renameSync(file.path,filepath)
        return{
          filename:file.filename,
          originalname:file.originalname,
          mimetype:file.mimetype,
          size:file.size
        }
      })
    try {
        
        await sequelize.query(`UPDATE write_post SET post_title ='${req.body.post_title}', postWrite = '${req.body.postWrite}', postCategory ='${req.body.postCategory}', Photo_upload ='${uploaded.map((file) => file.originalname).join(',')}'  WHERE writeid ='${req.body.writeid}'`,{type:QueryTypes.UPDATE});
        res.send({
            message:"Updated Successfully",
            data:  uploaded
        })
        console.log( uploaded)

    }
       
    
    catch (err) {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        }

       
    }
}

export const ActiveStatus=async(req,res)=>{
    try{
        const ActiveMode=await sequelize.query(`UPDATE registration SET status_id=${req.body.status_id} WHERE user_id=${req.body.user_id}`,{type:QueryTypes.UPDATE})
        
        if (ActiveMode.length > 0) {
           res.status(200).json(ActiveMode)
   
       }
       else {
           res.json({
               error: false,
               message: 'No user found',
               data:ActiveMode,
           })
       }}
       catch(err){
           if (err) {
               res.status(500).json({ error: 'Internal server error' });
           }
   
       }
   
}
  

