const Router=require('express')

const controller = require('../controllers/hotels_controller')
const router=new Router();
router.get('/',controller.getHotels)
router.post('/check',controller.checkHotelId)

module.exports=router