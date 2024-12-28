const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./components/routes/auth_router/authRouter');
const booksRouter = require('./components/routes/books_router/booksRouter');
const PORT = process.env.PORT || 5000;

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/books", booksRouter);

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://albert:albert26102003@cluster1.ecre7jl.mongodb.net/?retryWrites=true&w=majority')
            .then(() => {
                console.log('Connected to MongoDB');
            })
            .catch((err) => {
                // console.error('Error connecting to MongoDB', err);
            });

        if (require.main === module) {
            app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
        }
    } catch (e) {
        console.log(e);
    }
};

start();

module.exports = app