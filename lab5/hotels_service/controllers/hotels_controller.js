const Hotels = require('../db/hotel_model');

class HotelsController {
    async getHotels(req, res) {
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
            return res.status(500).json({ message: 'Error retrieving hotels' });
        }
    }

    async checkHotelId(req, res) {
        try {
            const { hotelId } = req.body;
            const hotel = await Hotels.findById(hotelId);

            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            return res.status(200).json({}); 
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Error retrieving hotel' });
        }
    }
}

module.exports = new HotelsController();