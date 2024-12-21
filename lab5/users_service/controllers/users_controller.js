const Users = require("../db/user_model");
const TempCodes = require("../db/temp_code_model");
const nodemailer = require('nodemailer');
const { accessSecret, refreshSecret, secretNumber, secretEmail } = require('./config');
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

function generateAccessToken(id) {
    const payload = { userId: id };
    return jwt.sign(payload, accessSecret.secret, { expiresIn: "24h" });
}

function generateRefreshToken(id) {
    const payload = { userId: id };
    return jwt.sign(payload, refreshSecret.secret, { expiresIn: "720h" });
}

class UsersController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Registration error', errors: errors.array() });
            }
            const { username, birthday, email, password } = req.body;
            const candidate = await Users.findOne({ email: email });
            if (candidate) {
                return res.status(409).json({ message: 'User already exists' });
            }
            const salt = bcrypt.genSaltSync(secretNumber.round);
            const hashPassword = bcrypt.hashSync(password, salt);
            const user = new Users({ username, birthday, email, password: hashPassword });
            await user.save();
            return res.status(201).json({ message: "Registration successful" });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Registration error' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(403).json({ message: 'Incorrect password' });
            }

            let tempCode = await TempCodes.findOne({ email: email });
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            if (tempCode) {
                tempCode.code = code;
                await tempCode.save();
            } else {
                tempCode = new TempCodes({ email: email, code: code });
                await tempCode.save();
            }

            const transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465,
                secure: true,
                auth: {
                    user: secretEmail.email,
                    pass: secretEmail.pass
                }
            });

            const mailOptions = {
                from: secretEmail.email,
                to: email,
                subject: 'modnikky_shop',
                text: code
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: 'Code sent to email' });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Login error' });
        }
    }

    async checkCode(req, res) {
        try {
            const { email, code } = req.body;
            const tempCode = await TempCodes.findOne({ email: email });

            if (!tempCode) {
                return res.status(400).json({ message: 'Code not found, please check your email.' });
            }

            if (tempCode.code !== code) {
                return res.status(400).json({ message: 'Incorrect code.' });
            }

            await TempCodes.deleteOne({ email: email });

            const user = await Users.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            return res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Error verifying code.' });
        }
    }

    async verifyToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Authorization token is missing' });
            }
            const decodedToken = jwt.verify(token, accessSecret.secret);
            return res.status(200).json({ userId: decodedToken.userId });
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authorization token' });
        }
    }

    async updateTokens(req, res) {
        try {
            const refreshToken = req.headers.authorization?.split(' ')[1];
            
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token is missing' });
            }
            
            const decodedRefreshToken = jwt.verify(refreshToken, refreshSecret.secret);
            const userId = decodedRefreshToken.userId;

            const newAccessToken = generateAccessToken(userId);
            const newRefreshToken = generateRefreshToken(userId);

            return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (error) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
    }
}

module.exports = new UsersController();