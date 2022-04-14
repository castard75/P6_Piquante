const express = require("express");

const helmet = require("helmet");

const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const userRoutes = require("./routes/user");

const sauceRoutes = require("./routes/sauce");
//Connectez votre API à votre cluster MongoDB
mongoose
  .connect(process.env.SECRET_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
app.use(helmet());

const bodyParser = require("body-parser");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "Images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
module.exports = app;
