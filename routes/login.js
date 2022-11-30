const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Validate = require("../Validations/Validation");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const newUser = new User({
    email,
    password,
  });


  const error = Validate.LoginValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);


  try {
    const user = await User.findOne({ email });

    if (user) {
      const validPassword = await bcrypt.compare(
        newUser.password,
        user.password
      );
      if (validPassword) {
        const token = jwt.sign(
          {
            _id: user._id,
            fullname:user.fullname,
            username: user.username,
            email: user.email,
          },
          process.env.SECRET_KEY
        );
        res.status(200).json(token);
      } else {
        res.status(400).json("Invalid credentials");
      }
    } else if (!user) {
      res.status(400).json("Invalid credentials");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;