//importation de mongoose pour utiliser son système de modèle
const mongoose = require("mongoose");

//importation de unique validator pour empecher les utilisateurs d'avoir le même email
const uniqueValidator = require("mongoose-unique-validator");

/*Optimise la structure du Back-end */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/*Empêche les utilisateur d'avoir la même adresse e-mail */
userSchema.plugin(uniqueValidator);

//exportation du schema
module.exports = mongoose.model("User", userSchema);
