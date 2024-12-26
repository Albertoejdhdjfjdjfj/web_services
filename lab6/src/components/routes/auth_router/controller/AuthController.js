const UserModel =require( "../models/User");
const TempCodeModel =require( "../models/TempCode");
const nodemailer =require( 'nodemailer')
const {accessSecret,refreshSecret,secretNumber,secretEmail} =require( '../../config')
const bcrypt =require( "bcryptjs");
const {validationResult} =require("express-validator");
const jwt =require( "jsonwebtoken");
 
function generateAccessToken(id){
  const payload={userId:id}
  return jwt.sign(payload,accessSecret.secret,{expiresIn:"24h"})
}

function generateRefreshToken(id){
  const payload={userId:id}
  return jwt.sign(payload,refreshSecret.secret,{expiresIn:"720h"})
}

class AuthController {
      async registation(req,res){ 
        try{
              const errors=validationResult(req)
              if(!errors.isEmpty()){
               res.status(400).json({message:'Ошибка при регистрации'});
               return;
              }
              const {username,birthday,email,password} = req.body
              const condidate = await UserModel.findOne({email:email});
              if(condidate){
               res.status(400).json({message:'Такой пользователь уже существует'});
               return;
              }
              const salt = bcrypt.genSaltSync(secretNumber.round); 
              const hashPassword= bcrypt.hashSync(password,salt)
              const user=new UserModel({username,birthday,email,password: hashPassword})
              await user.save()
              res.json({message:"Registration succesfully"});
              return;
        }
        catch(e){
         console.log(e) 
         res.status(400).json({message:'Registration error'})
        }
      }
 
      async login(req, res){
        try {
            const { email, password } = req.body;
    
            const user = await UserModel.findOne({ email: email });
            if (!user) {
                res.status(400).json({ message: 'Такой пользователь не найден' });
                return;
            }
            
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                res.status(400).json({ message: 'Введен неверный пороль' });
                return;
            }
    
            let tempCode = await TempCodeModel.findOne({ email: email });
            const code = Math.floor(100000 + Math.random() * 900000).toString();
    
            if (tempCode) {
                tempCode.code = code;
                await tempCode.save();
            } else {
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
                text: code 
            };
    
            await transporter.sendMail(mailOptions);
    
            res.status(200).json('ok');
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'login error' });
        }
    }

      async checkCode(req, res){
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
    
            const user= await UserModel.findOne({ email: email });
            if (!user) {
                res.status(400).json({ message: 'Пользователь не найден.' });
                return;
            }
    
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
    
            res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Ошибка при проверке кода.' });
        }
    }

      async verifyToken(req, res){
        try {
          const token = req.headers.authorization?.split(' ')[1];
          if (!token) {
            res.status(401).json({ message: 'Отсутствует токен авторизации' });
            return;
          }
          const decodedToken = jwt.verify(token, accessSecret.secret);
          res.status(200).json({ message: 'ok' });
        } catch (error) {
          res.status(401).json({ message: 'Недействительный токен авторизации' });
        }
      }

      async updateTokens(req, res){
        try { 
          console.log(req.headers.authorization)
          const refreshToken = req.headers.authorization?.split(' ')[1];
          if (!refreshToken) {
            res.status(401).json({ message: 'Отсутствует токен обновления' });
            return;
          }
          
          const decodedRefreshToken = jwt.verify(refreshToken, refreshSecret.secret);
          const userId = decodedRefreshToken.userId;

          const newAccessToken =generateAccessToken(userId);
          const newRefreshToken = generateRefreshToken(userId);
 
          res.json({accessToken:newAccessToken,refreshToken:newRefreshToken});
        } catch (error) {
          res.status(401).json({ message: 'Недействительный токен обновления' });
        }
      }
 }
   
 module.exports = new AuthController()