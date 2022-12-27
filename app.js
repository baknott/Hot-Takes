const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce')
const path = require('path');
const app = express();

//Configuration mongoose
mongoose.connect('mongodb+srv://baknott:Mushroom@cluster.5bzt2w5.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  //Headers pour éviter les erreurs de CORES
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
  //L'api utilise express
  app.use(express.json());

  //on récupères les différentes routes
  app.use('/api/auth', userRoutes);
  app.use('/api/sauces', sauceRoutes);
  app.use('/images', express.static(path.join(__dirname , 'images')));
  module.exports = app;