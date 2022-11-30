const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
});

userSchema.methods.generateAuthToken=function(){
  const token=jwt.sign({_id:this._id},process.env.SECRET_KEY)
  return token
}


const User = mongoose.model("User", userSchema);

module.exports = User;
