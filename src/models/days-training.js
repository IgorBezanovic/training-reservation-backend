const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    trim: true,
  }
}, {
  timestamps: true
})

const DayTraining = mongoose.model("DayTraining", daySchema)

module.exports = DayTraining;