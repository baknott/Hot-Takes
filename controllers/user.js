const User = require ('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const dotenv = require('dotenv');
dotenv.config();
const AUTH_TOKEN = process.env.SECRET_TOKEN;
const patternEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
//Inscription sur Hot Takes
exports.signup = (req, res, next) => {
    //Vérification de la syntaxe de l'email coté backend
    if(patternEmail.test(req.body.email)){
        bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }else{
        console.log("Erreur dans la syntaxe de l'email")
    };
    
  };

  //Connexion a son compte Hot Takes
  exports.login = (req, res, next) => {
    if(patternEmail.test(req.body.email)){
        User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur et/ou mot de passe incorrect' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Utilisateur et/ou mot de passe incorrect' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            AUTH_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }else{
        console.log("Erreur dans la syntaxe de l'email")
    };
    
 };