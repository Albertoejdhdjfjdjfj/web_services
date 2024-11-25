import {UserModel,User} from "../models/User";
import { Request ,Response} from "express";
import { ObjectId } from "mongoose";
import config from '../../config'
import bcrypt from "bcryptjs";
import {validationResult} from "express-validator";
import jwt from "jsonwebtoken";
 
function generateAccessToken(id:any):string{
  const payload={userId:id}
  return jwt.sign(payload,config.secret,{expiresIn:"24h"})
}

 export default class AuthController {
      AuthController(){};
      
      async registation(req:Request,res:Response):Promise<void>{ 
        try{
              const errors=validationResult(req)
              if(!errors.isEmpty()){
               res.status(400).json({message:'Ошибка при регистрации'});
               return;
              }
              const {username,birthday,email,password} = req.body
              const condidate: User|null = await UserModel.findOne({email});
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
         const {username,password} =req.body;
         console.log(username,password)
         console.log(req.body)
         const user:User|null = await UserModel.findOne({username});
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

         const token:string =generateAccessToken(user._id);
         res.json({token:token,username:user.username,birthday:user.birthday,email:user.email});
         return;
        }  
        catch(e){
         console.log(e)
         res.status(400).json({message:'login error'})
        } 
      } 

      async verifyToken(req: Request, res: Response):Promise<void> {
        try {
          const token = req.headers.authorization?.split(' ')[1];
          if (!token) {
            res.status(401).json({ message: 'Отсутствует токен авторизации' });
            return;
          }

          const decodedToken:any = jwt.verify(token, config.secret);
          res.status(200).json({ message: 'ok' });
        } catch (error) {
          res.status(401).json({ message: 'Недействительный токен авторизации' });
        }
      }
 }
   
 