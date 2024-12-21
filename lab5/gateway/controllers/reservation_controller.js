const axios = require('axios');

class ReservationsController {
    async reserve(req, res) {
        const { hotelId } = req.body;
        const token = req.headers.authorization;

        try {
            const response = await axios.post('http://localhost:5004/', {
                    hotelId:hotelId
                }, {  
                    headers: { 
                        Authorization: token, 
                    },
            });

            return res.status(response.status).json({...response.data});
        } catch (error) {
            if (error.response) {
                return res.status(error.response.status).json({ message: error.response.data.message });
            } else {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async delete_reserve(req, res) {
        const token = req.headers.authorization;
        try {
            const response = await axios.delete('http://localhost:5004/',
            {  
                    headers: { 
                        Authorization: token, 
                    },
            });

            return res.status(response.status).json({...response.data});
        }catch (error) {
            if (error.response) {
                return res.status(error.response.status).json({ message: error.response.data.message });
            } else {
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}

module.exports = new ReservationsController();