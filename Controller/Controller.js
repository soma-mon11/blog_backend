// import bcrypt from "bcryptjs";
// import Jwt from "jsonwebtoken";
import path from "path";
import fs from 'fs'
import {hash} from "../../server/Password/password.js";
import {generateToken} from '../../server/Token/Token.js'

import { QueryTypes, Sequelize } from "sequelize";
import { verify } from "crypto";
const sequelize = new Sequelize('blog_project', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});


export const userRegister = async (req, res) => {
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
        const existingUser = await sequelize.query(
            `SELECT * FROM registration WHERE user_name = '${req.body.user_name}'`,
            { type: QueryTypes.SELECT }
        );

        if (existingUser.length > 0) {

            res.status(400).json({ error: 'User already exists' });
        }

        else {
            // const salt = bcrypt.genSaltSync(10);
            // const hash = bcrypt.hashSync("B4c0/\/", salt);
            const hashpassword = await hash(req.body.password)

            // const verifyPassword = await verify(req.body.password, hashpassword)
            // console.log(verifyPassword)
            // if (!verifyPassword) {
            //     return res.status(400).json({ error: "Invalid password" })

            // }

            const userDetails = await sequelize.query(
                `INSERT INTO registration(user_name, email,password,profile_photo,status_id) VALUES ('${req.body.user_name}','${req.body.email}','${hashpassword}','${uploaded.map((file) => file.originalname).join(',')}',${1})`,
                { type: QueryTypes.INSERT }
            );

            res.json({
                error: false,
                message: 'User registered successfully',
                data: uploaded,
            });
        }
    } catch (error) {
        console.error('Error executing the SQL query: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }



}

export const userLogin =async (req, res) =>{
        let details1 = await sequelize.query(`SELECT *from registration where email='${req.body.email}' AND status_id='${1}'`, { type: QueryTypes.SELECT });

        let userdata = details1;
        console.log(details1)
        delete userdata.password;

        if (userdata.length > 0) {
            const token = await generateToken()
            res.cookie("token", token) 
            res.send({
                error: false,
                message: "login successfull",
                data: userdata,
                token: token
            })


        } else {
            res.send({
                error: true,
                message: "Wrong email or password",
                data: userdata
            })
        }


    }



export const logout = (req, res) => {
    res.clearCookie("token", {
        sameSize: "none",
        secure: true

    }).status(200).json("user has logged out")
}



