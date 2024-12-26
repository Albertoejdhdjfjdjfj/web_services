import express, { Express,Request,Response,NextFunction } from "express";
import cors from 'cors'
import mongoose from 'mongoose'
import authRouter from './components/routes/auth_router/authRouter'
import booksRouter from './components/routes/books_router/booksRouter'
const PORT:number|string=process.env.PORT || 5000

const app:Express = express(); 
app.use((req: Request, res: Response, next: NextFunction) => {
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
   app.use("/auth",authRouter);
   app.use("/books",booksRouter)

const start = async()=> {
     try{
          mongoose.connect('mongodb+srv://albert:albert26102003@cluster1.ecre7jl.mongodb.net/?retryWrites=true&w=majority').then(() => {
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


