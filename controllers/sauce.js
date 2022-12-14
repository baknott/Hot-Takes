const Sauce = require('../models/sauce');

//Créer une sauce 
exports.createSauce = (req, res, next) => {
    const objetSauce = JSON.parse(req.body.sauce);
    delete objetSauce.userId;
    const sauce = new Sauce({
        ... objetSauce,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then((sauce) => { res.status(201).json({ sauce, message: 'Objet enregistré!'})})
        .catch(error => { res.status(400).json({ error})})
};

//Afficher une sauce en fonction d'un id dans l'url de la page 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {res.status(200).json(sauce)})
        .catch(error => {res.status(404).json({ error })});
};

//Modifier une sauce
exports.updateSauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({_id: req.params.id})
        .then(() => {res.status(200).json({message: 'Deleted!'})})
        .catch((error) => {res.status(400).json({error})});
};

//Afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

//Instruction switch utilisée pour couvrir tous les cas de like/dislike/annulation de like/dislikes
//Operateurs $inc (incrémentation) et $push(array) sont propres à la fonction updateOne de mongoose

exports.evaluateSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                // Si la sauce n'est pas aimée
                case -1:
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(201).json({ message: "Dislike" }))
                        .catch(error => res.status(400).json({ error }))
                    break;
                
                case 0:
                    // Si l'utilisateur veut retirer son like
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: "Annulation du like" }))
                            .catch(error => res.status(400).json({ error }))
                    }

                    // Si l'utilisateur veut retirer son dislike
                    else if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: "Annulation du dislike" }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    break;
                
                // Si la sauce est aimée
                case 1:
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(201).json({ message: "Votre avis est bien pris en compte (like) !" }))
                        .catch(error => res.status(400).json({ error }))
                    break;
                default:
                    return res.status(500).json({ error });
            }
        })
        .catch(error => res.status(500).json({ error }));
}