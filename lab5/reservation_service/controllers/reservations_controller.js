const axios = require('axios');
const Reservations = require('../db/reservation_model');

class ReservationsController {
  async reserve(req, res) {
    try {
        const { hotelId } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Токен авторизации отсутствует' });
        }

        let userId;

        try {
            const response = await axios.post('http://localhost:5003/check', {}, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            userId = response.data.userId;
        } catch (err) {
            return res.status(401).json({ message: 'Недействительный токен авторизации' });
        }

        
      try {
          const hotelResponse = await axios.post('http://localhost:5002/check', { hotelId: hotelId });
          if (!hotelResponse.data) {
              return res.status(404).json({ message: 'Отеля не существует' });
          }
      } catch (err) {
          return res.status(404).json({ message: 'Ошибка при проверке отеля' });
      }

        const existingReservation = await Reservations.findOne({ userId });

        if (existingReservation) {
            return res.status(400).json({ message: 'У вас уже есть бронирование.' });
        }

      
        const newReservation = new Reservations({
            userId,
            reservations: hotelId,
        });

        await newReservation.save();

        return res.status(200).json({ message: 'Бронирование успешно' });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ message: 'Ошибка при бронировании' });
    }
}
}

module.exports = new ReservationsController();