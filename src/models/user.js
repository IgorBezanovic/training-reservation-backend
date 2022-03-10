const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
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
  role: {
    type: String,
    required: true,
    trim: true
  },
  numTrainings: {
    type: Number,
    required: true,
    default: 0
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value)) {
        throw new Error("Email is invalid")
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
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({"id": user._id.toString(), "role": user.role}, 'igorbezanoviclevi9')

  user.tokens = user.tokens.concat({token})
  await user.save()

  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email})

  if(!user){
    throw new Error('Unable to login, i can\'t find email')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    throw new Error('Unable to login, i can\'t find password')
  }

  return user;
}

userSchema.pre('save', async function(next) {
  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model("User", userSchema);
  
module.exports = User;