const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  name: {
    type:String,
    require:true,
  },
  image: String,
  desc: String,
  price: Number,
  quantity: Number,
  cartOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
