const stripe = require("stripe")(
    "sk_test_51K6viUSEi48qcQQWAQ5gQFyw9EyU26d4YB8ucVG2eCo1lrsuVAlOgMKUOJFnlznebfqMBGS0AWkJ9RKTmu1DSD6700VwVek6g3"
  );
  
  const express = require("express");
  const router = express.Router();
  const auth = require("../middleware/auth");
  const Cart = require("../models/Cart");
  
  router.post("/add-to-cart", auth, async (req, res) => {
    const { name, image, desc, price, quantity } = req.body;
    const newItem = new Cart({
      name,
      image,
      desc,
      price,
      quantity,
      cartOwner: req.user._id,
    });
    try {
      const existedItem = await Cart.findOne({ name });
      if (existedItem) return res.status(200).json("item already added to cart");
      const addedItem = await newItem.save();
      return res.status(200).json(addedItem);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  });
  
  router.get("/get-cart-item", auth, async (req, res) => {
    try {
      const cartItems = await Cart.find({ cartOwner: req.user._id });
      return res.status(200).json(cartItems);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  router.post("/remove-cart-item", auth, async (req, res) => {
    try {
      const cartItem = await Cart.findOne({ itemName: req.body.name });
      const filteredItem = await Cart.findByIdAndDelete({ _id: cartItem._id });
      return res.status(200).json(filteredItem);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  router.put("/increase-cart-quantity", auth, async (req, res) => {
    const qty = req.body.quantity;
    if (qty >= 5) return;
    const item = await Cart.findOne({ itemName: req.body.name });
    Cart.findByIdAndUpdate(
      { _id: item._id },
      {
        $set: {
          quantity: qty + 1,
        },
      }
    ).exec((err, result) => {
      if (err) {
        console.log(error);
        res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
  });
  
  async function payment_success() {
    const { paymentIntent, error } = await stripe.confirmCardPayment("sk_test_51K6viUSEi48qcQQWAQ5gQFyw9EyU26d4YB8ucVG2eCo1lrsuVAlOgMKUOJFnlznebfqMBGS0AWkJ9RKTmu1DSD6700VwVek6g3");
    if (error) {
      // Handle error here
      console.log(error);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Handle successful payment here
      console.log("success");
    }
  }
  
  router.post("/checkout", auth, async (req, res) => {
    try {
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: req.body.email,
        submit_type: "pay",
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: ["US", "CA"],
        },
        shipping_options: [{ shipping_rate: "shr_1M9N6vSEi48qcQQWQVHnuumn" }],
        line_items: req.body.items.map((item) => {
          const img = item.image;
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
                images: [img],
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
              maximum: 5,
            },
            quantity: item.quantity,
          };
        }),
      
        success_url: "https://shoes-store-frontend-typescript.vercel.app/order-success",
        cancel_url: "https://shoes-store-frontend-typescript.vercel.app/order-failed",
  
  
  
      });
  
  
      res.json({ url: session.url });
      
      // payment_success()
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  });
  
  
  
  module.exports = router;
  