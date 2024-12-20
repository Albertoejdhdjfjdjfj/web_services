const Router = require('express')
const router=new Router()
const controller=require('../controllers/users_controller')
const{check}=require("express-validator")


router.post('/',[
     check('username').isLength({min:3,max:20}), 
     check('birthday').custom((value) => {
          if (!new Date(value)) {
            throw new Error('Invalid date');
          }
          return true;
        }),
     check('email').isEmail(),
     check('password').isLength({min:4,max:20}),  
],controller.registration)
router.post('/login',controller.login),
router.post('/verify',controller.checkCode)
router.post('/check',controller.verifyToken)
router.put('/update',controller.updateTokens)

module.exports = router