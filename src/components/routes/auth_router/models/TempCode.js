const { Schema, model} = require("mongoose");

const TempCodeSchema = new Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
});

module.exports = model ("TempCode", TempCodeSchema);