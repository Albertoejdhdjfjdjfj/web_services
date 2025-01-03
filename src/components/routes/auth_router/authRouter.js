const {Router}=require('express');
const AuthController =require('./controller/AuthController');
const{ check }=require('express-validator');;

const router= Router(); 
const controller = new AuthController();
router.post('/registration',[
     check('username').isLength({min:3,max:20}), 
     check('birthday').custom((value) => {
          if (!new Date(value)) {
            throw new Error('Invalid date');
          }
          return true;
        }),
     check('email').isEmail(),
     check('password').isLength({min:4,max:20}),  
],controller.registation)
router.post('/login',controller.login),
router.post('/verify',controller.checkCode)
router.post('/check',controller.verifyToken)
router.put('/update',controller.updateTokens)

module.exports=router;

