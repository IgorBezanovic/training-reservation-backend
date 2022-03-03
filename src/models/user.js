const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("User", {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase:true,
      validate(value){
        if(!validator.isEmail(value)) {
          throw new Error("Email is invalid")
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if(value.includes('password')){
          throw new Error("Password cannot includes string 'password'")
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if(value < 0){
          throw new Error("Godine moraju biti pozitivan broj")
        }
      }
    },
  });
  
module.exports = User;