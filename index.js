const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cors = require("cors");
const DB = require("./database/database");
const signup = require("./routes/signup");
const login = require("./routes/login");
const cart = require("./routes/cart");
const wishlist = require("./routes/wishlist");

dotenv.config({ path: "./.env" });

app.use(cors());
app.use(express.json());

// Intializing Database
DB();

// Routes

app.use("/api", signup);
app.use("/api", login);
app.use("/api", cart);
app.use("/api", wishlist);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
