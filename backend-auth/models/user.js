const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
  },
  refreshToken:{
      type: String
  }
},{
  timestamps:true
})

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign({
      _id: this._id,
      email: this.email
     },
     process.env.ACCESS_TOKEN_SECRET,
     {
       expiresIn: process.env.ACCESS_TOKEN_EXPIRY
     }
    )
}
UserSchema.methods.generateRefreshToken = function(){
 return jwt.sign({
    _id: this._id,
    email: this.email
   },
   process.env.REFRESH_TOKEN_SECRET,
   {
     expiresIn:process.env.REFRESH_TOKEN_EXPIRY
   }
  )
}


const User = mongoose.model("User",UserSchema);
module.exports = User;
