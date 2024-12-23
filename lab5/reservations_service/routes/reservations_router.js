const Router=require('express')

const controller = require('../controllers/reservations_controller')
const router=new Router();
router.post('/',controller.reserve)
router.delete('/',controller.delete_reserve)
module.exports=router