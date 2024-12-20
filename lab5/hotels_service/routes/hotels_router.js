const Router=require('express')

const controller = require('../controllers/hotels_controller')
const router=new Router();
router.get('/',controller.getHotels)

module.exports=router