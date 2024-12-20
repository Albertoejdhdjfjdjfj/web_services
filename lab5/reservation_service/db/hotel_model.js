const { Schema, model }=require('mongoose')

const hotel =new Schema({
     name:{type:String,required:true},
     location:{type:String,required:true},
     rating:{type:Number,required:true},
     price_per_night:{type:Number,required:true},
      category:{type:String,required:true},
})

module.exports=model('hotel',hotel)