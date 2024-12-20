const { Schema, model }=require('mongoose')

const user = new Schema({
      username: { type: String, required: true },
      birthday: { type: String, required: true },
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true },
})

module.exports=model('user',user)