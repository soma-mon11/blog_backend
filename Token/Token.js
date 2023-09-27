import jwt from'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import generate from '../../server/REsponse/Response.js';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.ENC_KEY;

export const generateToken = async(data) => {
  return new Promise((resolve,reject)=>{
    try{
      let claims = {
        jwtid: uuidv4(),
        iat: Date.now(),
        exp: Math.floor(Date.now()/1000) + eval(process.env.SESSION),
        sub: 'auth_token',
        data: data
      }
      resolve(jwt.sign(claims,secretKey));      
    }catch(err){
      reject(err);
    }
  });
}
export const verifyClaimWithoutSecret = (req,res,next) => {

  const token = req.headers['token'];
  
  console.log(token)
  jwt.verify(token, secretKey, function (err, decoded) {
    if(err){
      res.status(203).send(generate(true, 'Token expired', err));
      console.log(err);
    }else{
      console.log(decoded);
      next();
    }
  });
}