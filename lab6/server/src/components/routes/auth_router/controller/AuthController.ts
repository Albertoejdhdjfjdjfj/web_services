import {UserModel,User} from "../models/User";
import { TempCodeModel,TempCode } from "../models/TempCode";
import { Request ,Response} from "express";
import nodemailer from 'nodemailer'
import {accessSecret,refreshSecret,secretNumber,secretEmail} from '../../config'
import bcrypt from "bcryptjs";
import {validationResult} from "express-validator";
import jwt from "jsonwebtoken";
 
function generateAccessToken(id:string):string{
  const payload={userId:id}
  return jwt.sign(payload,accessSecret.secret,{expiresIn:"24h"})
}

function generateRefreshToken(id:string):string{
  const payload={userId:id}
  return jwt.sign(payload,refreshSecret.secret,{expiresIn:"720h"})
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
              const salt:string = bcrypt.genSaltSync(secretNumber.round); 
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
 
      async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
    
            const user: User | null = await UserModel.findOne({ email: email });
            if (!user) {
                res.status(400).json({ message: 'Такой пользователь не найден' });
                return;
            }
            
            const validPassword: boolean = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                res.status(400).json({ message: 'Введен неверный пороль' });
                return;
            }
    
            // Check for an existing verification code
            let tempCode = await TempCodeModel.findOne({ email: email });
            const code = Math.floor(100000 + Math.random() * 900000).toString();
    
            if (tempCode) {
                // If it exists, update the code
                tempCode.code = code;
                await tempCode.save();
            } else {
                // If it doesn't exist, create a new record
                tempCode = new TempCodeModel({ email: email, code: code });
                await tempCode.save();
            }
    
            const transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465,
                secure: true,
                auth: {
                    user: secretEmail.email,
                    pass: secretEmail.pass
                }
            });
    
            const mailOptions = {
                from: secretEmail.email,
                to: email,
                subject: 'modnikky_shop',
                text: code // Send the new code
            };
    
            await transporter.sendMail(mailOptions);
    
            res.status(200).json('ok');
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'login error' });
        }
    }

      async checkCode(req: Request, res: Response): Promise<void> {
        try {
            const { email, code } = req.body;
            const tempCode = await TempCodeModel.findOne({ email: email });
    
            if (!tempCode) {
                res.status(400).json({ message: 'Код не найден, проверьте свою почту.' });
                return;
            }
           console.log(tempCode.code)
            if (tempCode.code !== code) {
                res.status(400).json({ message: 'Неверный код.' });
                return;
            }
    
            
            await TempCodeModel.deleteOne({ email: email });
    
            const user: User | null = await UserModel.findOne({ email: email });
            if (!user) {
                res.status(400).json({ message: 'Пользователь не найден.' });
                return;
            }
    
            const accessToken: string = generateAccessToken(user._id);
            const refreshToken: string = generateRefreshToken(user._id);
    
            res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Ошибка при проверке кода.' });
        }
    }

      async verifyToken(req: Request, res: Response):Promise<void> {
        try {
          const token = req.headers.authorization?.split(' ')[1];
          if (!token) {
            res.status(401).json({ message: 'Отсутствует токен авторизации' });
            return;
          }
          const decodedToken:any = jwt.verify(token, accessSecret.secret);
          res.status(200).json({ message: 'ok' });
        } catch (error) {
          res.status(401).json({ message: 'Недействительный токен авторизации' });
        }
      }

      async updateTokens(req: Request, res: Response):Promise<void> {
        try { 
          console.log(req.headers.authorization)
          const refreshToken = req.headers.authorization?.split(' ')[1];
          if (!refreshToken) {
            res.status(401).json({ message: 'Отсутствует токен обновления' });
            return;
          }
          
          const decodedRefreshToken:any = jwt.verify(refreshToken, refreshSecret.secret);
          const userId = decodedRefreshToken.userId;

          const newAccessToken:string =generateAccessToken(userId);
          const newRefreshToken:string = generateRefreshToken(userId);
 
          res.json({accessToken:newAccessToken,refreshToken:newRefreshToken});
        } catch (error) {
          res.status(401).json({ message: 'Недействительный токен обновления' });
        }
      }
 }
   
 