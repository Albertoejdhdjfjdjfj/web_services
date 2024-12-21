const controller = require("../controllers/reservation_controller")
const Router=require('express')

const router=new Router();
router.post('/',controller.reserve);
router.delete('/',controller.delete_reserve)

module.exports=router