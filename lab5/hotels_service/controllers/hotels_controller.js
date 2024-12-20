const Hotels = require('../db/hotel_model');

class HotelsController{
    
     async getHotels(req,res){
          try {  
               const { sort,page,limit } = req.query;
               const pageNumber = parseInt(page) || 1;
               const limitNumber = parseInt(limit);
               const skip = (pageNumber - 1) * limitNumber;
               const regex = new RegExp(sort, "i");
               const hotels = await Hotels.find(
                 {
                   $or: [
                     { name: { $regex: regex } },
                     { location: { $regex: regex } }, 
                     { category: { $regex: regex } },
                   ]
                 }
               )
               .skip(skip) 
               .limit(limitNumber)
               .exec();
               return res.status(200).json(hotels);
             } catch (e) {
               console.log(e);
               res.status(400).json({ message: 'Ошибка при получении отелей' });
             }
     }
}     

     module.exports=new HotelsController() 
