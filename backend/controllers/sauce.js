const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    // j'ajoute les element de like dislike etc... car il ne sont pas crée grace au formulaire
    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersdisLiked: [" "],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.updateSauce = (req, res, next) => {
  /*Dans cette version modifiée de la fonction, on crée un objet thingObject qui regarde si req.file existe ou non.
 S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant */
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(res.status(200).json({ message: "Sauce modifiée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({
          error: new Error("Sauce non trouvée"),
        });
      }
      /*après avoir passé l'userId dans la req on verifie si il correspond bien a celui apparenté a la sauce 
      
      */
      if (sauce.userId !== req.auth.userId) {
        res.status(404).json({
          error: new Error("No such Thing!"),
        });
      }

      const filename = sauce.imageUrl.split("/images/")[1];
      //je supprime le fichier
      fs.unlink(`images/${filename}`, () => {
        //je supprime de la base de données
        Sauce.deleteOne({ _id: req.params.id })
          .then(res.status(200).json({ message: "Sauce supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })

    .catch((error) => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

  switch (like) {
    //Si mon like renvoie 1
    case 1:
      /*on verifie que l'id est egale a l'id de la sauce de la base de donnée
       ensuite on ajoute dans le tableau l'id de l'utilisateur qui a liker et on incremente le like de1*/
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersLiked: userId }, $inc: { likes: +1 } }
      )

        .then(res.status(200).json({ message: "j'aime" }))
        .catch((error) => res.status(400).json({ error }));
      break;
    //On verifie que la sauce a été liker par l'utulisateur en verifiant son userId dans le tableau et si cest le cas on décremente ou incremente

    case 0:
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          //Si dans le tableau userliked de la sauce il y a l'userId on retire le likes
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
            )
              .then(res.status(200).json({ message: "annulation" }))
              .catch((error) => res.status(400).json({ error }));
          }
          //Si dans le tableau userDisliked de la sauce il y a l'userId on retire le likes
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
            )
              .then(res.status(200).json({ message: "annulation" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    //on stock l'id de l'utilisateur dans le tableau usersdisliked
    case -1:
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
      )
        .then(res.status(200).json({ message: "j'aime pas" }))
        .catch((error) => res.status(400).json({ error }));
      break;
  }
};
