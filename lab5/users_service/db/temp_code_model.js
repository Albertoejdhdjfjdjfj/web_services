const { Schema, model }=require('mongoose')

const temp_code = new Schema({
     email: { type: String, required: true },
     code: { type: String, required: true },
})

module.exports=model('temp_codes',temp_code)