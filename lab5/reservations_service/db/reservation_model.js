const { Schema, model }=require('mongoose')

const reservations =new Schema({
     userId:{type:String,required:true},
     reservations:{type:String,required:true},
})

module.exports=model('reservations',reservations)