import {UserModel,User} from "../models/User";
import { Request ,Response} from "express";
import { ObjectId } from "mongoose";
import config from '../../config'
import bcrypt from "bcryptjs";
import {validationResult} from "express-validator";
import jwt from "jsonwebtoken";
 
function generateAccessToken(id:string):string{
  const payload={userId:id}
  return jwt.sign(payload,config.secret,{expiresIn:"24h"})
}

function generateRefreshToken(id:string):string{
  const payload={userId:id}
  return jwt.sign(payload,config.secret,{expiresIn:"720h"})
}

 export default class AuthController {
      async registation(req:Request,res:Response):Promise<void>{ 
        try{
              const errors=validationResult(req)
              if(!errors.isEmpty()){
               res.status(400).json({message:'Ошибка при регистрации'});
               return;
              }
              const {username,birthday,email,password} = req.body
              const condidate: User|null = await UserModel.findOne({email:email});
              if(condidate){
               res.status(400).json({message:'Такой пользователь уже существует'});
               return;
              }
              const salt:string = bcrypt.genSaltSync(config.salt); 
              console.log(salt,password)
              const hashPassword:string = bcrypt.hashSync(password,salt)
              const user:User=new UserModel({username,birthday,email,password: hashPassword})
              await user.save()
              res.json({message:"Registration succesfully"});
              return;
        }
        catch(e){
         console.log(e) 
         res.status(400).json({message:'Registration error'})
        }
      }
 
      async login(req:Request,res:Response):Promise<void>{
        try{
         const {email,password} =req.body;
         console.log(email,password)
         console.log(req.body)
         const user:User|null = await UserModel.findOne({email:email});
         console.log(user)
         if(!user){
          res.status(400).json({message:'Такой пользователь не найден'});
          return;
         }
         const validPassword:boolean=bcrypt.compareSync(password,user.password)
         if(!validPassword){
           res.status(400).json({message:'Введен неверный пороль'});
           return
          }

         const accessToken:string =generateAccessToken(user._id);
         const refreshToken:string = generateRefreshToken(user.id);

         res.json({accessToken:accessToken,refreshToken:refreshToken,username:user.username});
         return;
        }  
        catch(e){
         console.log(e)
         res.status(400).json({message:'login error'})
        } 
      } 

      async verifyToken(req: Request, res: Response):Promise<void> {
        try {
          console.log(req.headers.authorization)
          const token = req.headers.authorization?.split(' ')[1];
          console.log(token)
          if (!token) {
            res.status(401).json({ message: 'Отсутствует токен авторизации' });
            return;
          }
          const decodedToken:any = jwt.verify(token, config.secret);
          console.log(decodedToken)
          res.status(200).json({ message: 'ok' });
        } catch (error) {
          res.status(401).json({ message: 'Недействительный токен авторизации' });
        }
      }

      async updateTokens(req: Request, res: Response):Promise<void> {
        try { 
          console.log(req.headers.authorization)
          const refreshToken = req.headers.authorization?.split(' ')[1];
          console.log(refreshToken)
          if (!refreshToken) {
            res.status(401).json({ message: 'Отсутствует токен обновления' });
            return;
          }
          
          const decodedRefreshToken:any = jwt.verify(refreshToken, config.secret);
          const userId = decodedRefreshToken.userId;

          const newAccessToken:string =generateAccessToken(userId);
          const newRefreshToken:string = generateRefreshToken(userId);
 
          res.json({accessToken:newAccessToken,refreshToken:newRefreshToken});
        } catch (error) {
          res.status(401).json({ message: 'Недействительный токен обновления' });
        }
      }
 }
   
 