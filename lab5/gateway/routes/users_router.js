const controller = require('../controllers/users_controller')
const Router=require('express')

const router=new Router();
router.post('/',controller.registration)
router.post('/login',controller.login)
router.post('/verify',controller.checkCode)
router.put('/update',controller.updateTokens)


module.exports=router