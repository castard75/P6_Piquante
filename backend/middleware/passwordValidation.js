const passwordToValidate = require("../models/passwordValidation");

module.exports = (req, res, next) => {
  if (!passwordToValidate.validate(req.body.password)) {
    res.status(400).json({
      error:
        "Votre mot de passe doit faire 10 caractère au moins, avec une maj, une min et un chiffre au moins.",
    });
  } else {
    next();
  }
};
