const express=require('express');
const WishList = require('../models/Wishlist');
const auth=require('../middleware/auth');

const router=express.Router();

router.post("/add-to-wishlist", auth, async (req, res) => {
    const { name, image, desc, price,rating} = req.body;
    const newItem = new WishList({
      name,
      image,
      desc,
      price,
      rating,
      owner: req.user._id,
    });
    try {
      const existedItem = await WishList.findOne({ name });
      if (existedItem) return res.status(200).json("item already added to cart");
      const addedItem = await newItem.save();
      return res.status(200).json(addedItem);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  });
  


  router.get("/get-wishlist-item", auth, async (req, res) => {
    try {
      const wishlistItems = await WishList.find({ owner: req.user._id });
      return res.status(200).json(wishlistItems);
    } catch (error) {
      throw new Error(error);
    }
  });
  


  router.post("/remove-wishlist-item", auth, async (req, res) => {
    try {
      const wishlistItem = await WishList.findOne({ itemName: req.body.name });
      const filteredItem = await WishList.findByIdAndDelete({ _id: wishlistItem._id });
      return res.status(200).json(filteredItem);
    } catch (error) {
      throw new Error(error);
    }
  });
module.exports=router