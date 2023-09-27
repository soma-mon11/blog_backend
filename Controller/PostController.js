import { QueryTypes, Sequelize } from "sequelize";
import Jwt from "jsonwebtoken";
import path from 'path';
import fs from 'fs';

const sequelize = new Sequelize('blog_project', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});


export const getPosts = async (req, res) => {
    const { postCategory } = req.query;
    try {
        if (postCategory !== undefined && postCategory.trim() !== '') {

            const postUser = await sequelize.query(`SELECT * FROM write_post INNER JOIN registration ON registration.user_id=write_post.user_id WHERE postCategory='${postCategory}'`, { type: QueryTypes.SELECT })
            if (postUser.length > 0) {
                res.status(200).json(postUser)
            }
            else {
                res.json({
                    error: false,
                    message: 'No category selected',
                    data: postUser,
                });

            }
        } else {
            const postUser = await sequelize.query(`SELECT * FROM write_post INNER JOIN registration ON registration.user_id=write_post.user_id`, { type: QueryTypes.SELECT })

            if (postUser.length > 0) {
                res.status(200).json(postUser)

            }
            else {
                res.json({
                    error: false,
                    message: 'No user found',
                    data: postUser,
                });

            }
        }

    } catch (error) {
        console.error('Error executing the SQL query: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const getPost = async (req, res) => {
  
    try {

        const posSingleUser = await sequelize.query(`SELECT * from write_post INNER JOIN registration ON registration.user_id=write_post.user_id WHERE writeid="${req.params.writeid}"`, { type: QueryTypes.SELECT })
        console.log(posSingleUser)
        if (posSingleUser.length > 0) {
            res.status(200).json(posSingleUser)
        }
        else {
            res.json({
                error: false,
                message: 'No user found',
                data: posSingleUser,
            });

        }

    } catch (error) {
        console.error('Error executing the SQL query: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }


}
export const userDelete = async (req, res) => {
    // const token = req.header("token")
    // console.log(token)

    // if (!token) {
    //     return res.status(401).json("User Not Authenticated")
    // }
    // else {
    try {
        // const verifyToken = Jwt.verify(token, "jwtkey")
        // console.log(verifyToken)
        // const tokenExpirationTime = new Date(verifyToken.exp * 1000);
        //console.log("Token Expiration Time:", tokenExpirationTime);
        const delteUserPost = await sequelize.query(`DELETE from registration WHERE user_id="${req.query.user_id}"`, { type: QueryTypes.DELETE })
        res.status(200).json({ message: "Post deleted successfully." });


    }
    catch (err) {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        }

        // else {
        //     res.status(500).json({ err: 'Internal server error' });
        // } console.error('Error executing the SQL query: ', err);

    }
}
// }

export const writePost = async (req, res) => {

    if (!req.files || req.files.length === 0) {
        return res.status(400).send("no images uploaded")
    }
    const uploaded = req.files.map((file) => {
        const newfilename = file.originalname;
        const filepath = path.join("multiple-uploads/", newfilename)
        fs.renameSync(file.path, filepath)
        return {
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        }
    })

    try {
        await sequelize.query(`INSERT INTO write_post (post_title,postWrite,postCategory,user_id,postDate,Photo_upload)VALUES('${req.body.post_title}','${req.body.postWrite}','${req.body.postCategory}','${req.body.user_id}','${req.body.postDate}','${uploaded.map((file) => file.originalname).join(',')}') `, { type: QueryTypes.INSERT })

        res.send({
            message: "entered successfully",
            data: uploaded
        })

    }
    catch (error) {
        res.send({
            message: "opps error",
            data: error
        })
    }

}
export const EditUser = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send("no images uploaded")
    }
    const uploaded = req.files.map((file) => {
        const newfilename = file.originalname;
        const filepath = path.join("multiple-uploads/", newfilename)
        fs.renameSync(file.path, filepath)
        return {
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        }
    })
    try {

        await sequelize.query(`UPDATE write_post SET post_title ='${req.body.post_title}', postWrite = '${req.body.postWrite}', postCategory ='${req.body.postCategory}', Photo_upload ='${uploaded.map((file) => file.originalname).join(',')}'  WHERE writeid ='${req.body.writeid}'`, { type: QueryTypes.UPDATE });
        res.send({
            message: "Updated Successfully",
            data: uploaded
        })
        console.log(uploaded)

    }


    catch (err) {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        }


    }
}
export const getAllPost = async (req, res) => {
    try {
        const getall = await sequelize.query(`SELECT * from registration`, { type: QueryTypes.SELECT })
        if (getall.length > 0) {
            res.status(200).json(getall)

        }
        else {
            res.json({
                error: false,
                message: 'No user found',
                data: getall,
            })
        }
    }
    catch (err) {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        }

    }

}
export const postComments = async (req, res) => {
    try {
        const { writeComment, Comment_date, user_id } = req.body;

        if (!writeComment || !Comment_date || !user_id) {
            return res.send({
                message: "Please fill all fields"
            });
        }

        const postcomments = await sequelize.query(
            `INSERT INTO comment(writeComment, Comment_date, user_id) VALUES ('${req.body.writeComment}','${req.body.Comment_date}','${req.body.user_id}')`,
            { type: QueryTypes.INSERT }
        );

        res.send({
            message: "Fill-up successful",
            data: postcomments
        });
    } catch (err) {
        res.send({
            message: "Oops, an error occurred",
            data: err
        });
    }
}

export const getComments = async (req, res) => {
  
    try {
        const getcomment = await sequelize.query(`SELECT * FROM comment INNER JOIN registration ON registration.user_id=comment.user_id`, { type: QueryTypes.SELECT })
        console.log(getcomment)

        res.send({
            message: "Fill-up successful",
            data: getcomment
        });
    }
    catch (err) {
        res.send({
            message: "Oops, an error occurred",
            data: err
        });

    }
}
