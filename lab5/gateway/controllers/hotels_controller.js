const axios = require('axios');

class HotelsController {
     async getHotels(req, res) {
          try {
              const { sort, page, limit } = req.query; 
      
              const response = await axios.get('http://localhost:5002/', {
                  params: {
                      sort: sort, 
                      page: page,
                      limit: limit,
                  }
              }); 

              return res.status(200).json(response.data);
          } catch (e) {
              console.error(e);
              return res.status(500).json({ message: 'Error retrieving hotels' });
          }
      }
}

module.exports = new HotelsController();