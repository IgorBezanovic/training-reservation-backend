const mongoose = require("mongoose");

const singleTraining = new mongoose.Schema({
    day: {
      type: String,
      required: true,
      trim: true,
    },
    startHours: {
      type: String,
      required: true,
      trim: true,
    },
    freeSpace: {
      type: Number,
      default: 16,
    },
    extraTermin: {
      type: Boolean,
    },
    members: {
      type: Array,
      default: []
    },
  }, {
      timestamps: true
  }

)
const SingleTraining = mongoose.model("SingleTraining", singleTraining);

module.exports = SingleTraining;
