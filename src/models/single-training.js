const mongoose = require("mongoose");
const User = require("./user");

const SingleTraining = mongoose.model("SingleTraining", {
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
});

module.exports = SingleTraining;
