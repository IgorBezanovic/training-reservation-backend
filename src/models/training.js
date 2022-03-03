const mongoose = require("mongoose");
const validator = require("validator");


const Training = mongoose.model("Training", {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false
    }
  })

module.exports = Training;