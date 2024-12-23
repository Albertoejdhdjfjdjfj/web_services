const axios = require('axios');
const Reservations = require('../db/reservation_model');

class ReservationsController {
    async reserve(req, res) {
        try {
            const { hotelId } = req.body;
            const token = req.headers.authorization;

            const response = await axios.post('http://localhost:5003/check', {}, { 
                headers: {
                    Authorization: token,
                },
            });

            const userId = response.data.userId;
            
            await axios.post('http://localhost:5002/check', { hotelId: hotelId });
           
            const existingReservation = await Reservations.findOne({ userId });

            if (existingReservation) {
                return res.status(400).json({ message: 'You already have a reservation.' });
            }

            const newReservation = new Reservations({
                userId,
                reservations: hotelId,
            });

            await newReservation.save();

            return res.status(200).json({ message: 'Reservation successful' });
        }catch (error) {
            if (error.response) {
                return res.status(error.response.status).json({ message: error.response.data.message });
            } else {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async delete_reserve(req, res) {
        try {
            const token = req.headers.authorization;

            const response = await axios.post('http://localhost:5003/check', {}, { 
                headers: {
                    Authorization: token,
                },
            });

            const userId = response.data.userId; 
           
            await Reservations.deleteOne({ userId:userId });
            return res.status(200).json({ message: 'Deleting reservation successful' });
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