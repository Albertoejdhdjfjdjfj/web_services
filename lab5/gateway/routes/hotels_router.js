const controller = require('../controllers/hotels_controller')
const Router=require('express')

const router=new Router();
router.get('/',controller.getHotels)

module.exports=router