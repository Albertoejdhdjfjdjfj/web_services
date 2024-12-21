const axios = require('axios');

class UsersController {

    async registration(req, res) { 
        const data = req.body;
        try {
            const response = await axios.post('http://localhost:5003', data);
                   
            return res.status(response.status).json({...response.data});
        }  catch (error) {
            if (error.response) {
                return res.status(error.response.status).json({ message: error.response.data.message });
            } else {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
 
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const response = await axios.post('http://localhost:5003/login', { email, password });
    
            return res.status(response.status).json({
                    ...response.data
            });
        }  catch (error) {
            if (error.response) {
                return res.status(error.response.status).json({ message: error.response.data.message });
            } else {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async checkCode(req, res) {
        const { email, code } = req.body;

        try {
            const response = await axios.post('http://localhost:5003/verify', { email, code });
    
            return res.status(response.status).json({
                ...response.data
            });
        } catch (error) {
            if (error.response) {
                return res.status(error.response.status).json({ message: error.response.data.message });
            } else {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async updateTokens(req, res) {
        const refreshToken = req.headers.authorization;
        
        try {
            const response = await axios.put('http://localhost:5003/update', { }, { 
                headers: {
                    Authorization: refreshToken,
                },
            }); 

            return res.status(response.status).json({
                ...response.data
            });
        }  catch (error) {
            if (error.response) {
                return res.status(error.response.status).json({ message: error.response.data.message });
            } else {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
 }
   
 module.exports = new UsersController();