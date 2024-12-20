const express=require("express");
const cors=require('cors');
const auth_router =require('./routes/auth_router');
const reservation_router =require('./routes/reservation_router');
const hotels_router =require('./routes/hotels_router');
const PORT = process.env.PORT || 5000

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
   app.use("/",hotels_router);
   app.use("/auth",auth_router);
   app.use("/reservation",reservation_router);

const start = async()=> {
     try{
          app.listen(PORT,()=>console.log(`server started on port ${PORT}`)); 
     }
     catch(e){  
          console.log(e)    
     }
}

start()


