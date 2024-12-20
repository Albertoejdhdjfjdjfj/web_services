const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const users_router = require('./routes/users_router');
const PORT = process.env.PORT || 5003

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
   
   app.use(cors())
   app.use(express.json()); 
   app.use("/",users_router);

const start = async()=> {
     try{
          mongoose.connect('mongodb://localhost:27017/userservice').then(() => {
          console.log('Connected to MongoDB');
     }).catch((err) => {
        console.error('Error connecting to MongoDB', err);
     });
          app.listen(PORT,()=>console.log(`server started on port ${PORT}`));
          
     }
     catch(e){  
          console.log(e)    
     }
}

start()


