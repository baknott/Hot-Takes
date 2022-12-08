const Sauce = require('../models/sauce');


//CREATE PAS FINI (ne peut pas creer de deuxieme sauce)
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

//getOneSauce OK
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(sauce => {res.status(200).json(sauce)})
  .catch(error => {res.status(404).json({ error })});
};

//updateSauce OK
exports.updateSauce = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

//delateSauce OK
exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({_id: req.params.id})
  .then(() => {res.status(200).json({message: 'Deleted!'})})
  .catch((error) => {res.status(400).json({error})});
};

//getAllSauce OK
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

