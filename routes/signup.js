const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Validate = require("../validations/Validation");
const jwt=require('jsonwebtoken')

router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  const newUser = new User({
    fullname,
    email,
    password,
  });

  const error = Validate.SignupValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  try {
    const isExisted = await User.findOne({ email });
    if (isExisted) return res.status(400).send("user already registered");
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const user = await newUser.save();
    const token = jwt.sign(
      {
        _id: user._id,
        fullname:user.fullname,
        username: user.username,
        email: user.email,
      },
      process.env.SECRET_KEY
    );
    return res.status(200).json(token);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
