module.exports = (req, res, next) => {
  //Recuperation des informations pour la route post
  if (JSON.parse(req.body.sauce !== undefined)) {
    const sauce = JSON.parse(req.body.sauce);
    let { name, manufacturer, description, mainPepper } = sauce;

    let TabToTrim = [];

    function toTrim(...element) {
      TabToTrim = element.map((elt) => elt.trim());
    }
    toTrim(name, manufacturer, description, mainPepper);

    // Vérification du nombre de caractères après avoir trim()
    const Characters = (currentValue) => currentValue.length >= 4;
    if (TabToTrim.every(Characters)) {
      next();
    } else {
      throw new Error("Tous les champs doivent faire au moins 4 caractères");
    }
  } else {
    // Si il s'agit de la route put
    const sauce = req.body;
    let { name, manufacturer, description, mainPepper } = sauce;
    let TabToTrim = [];

    function toTrim(...element) {
      TabToTrim = element.map((elt) => elt.trim());
    }
    toTrim(name, manufacturer, description, mainPepper);

    // Vérification du nombre de caractères après avoir trim()
    const Characters = (currentValue) => currentValue.length >= 4;
    if (TabToTrim.every(Characters)) {
      next();
    } else {
      throw new Error("Tous les champs doivent faire au moins 4 caractères");
    }
  }
};
