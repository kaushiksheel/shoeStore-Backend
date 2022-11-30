const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  name: String,
  image: String,
  desc: String,
  price: Number,
  rating:Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const WishList = mongoose.model("WishList", wishlistSchema);

module.exports = WishList;
