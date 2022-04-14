const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const checkSauceInput = require("../middleware/sauceInput");
//Importation de notre controller pour le sauces
const sauceCtrl = require("../controllers/sauce");

//on fait l'authentification puis on appel la sauce ou les sauces
router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, multer, checkSauceInput, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, checkSauceInput, sauceCtrl.updateSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);
module.exports = router;
