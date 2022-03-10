const mongoose = require("mongoose");

const DayTraining = mongoose.model("DayTraining", {
    day: {
      type: String,
      required: true,
      trim: true,
    }
  })

module.exports = DayTraining;