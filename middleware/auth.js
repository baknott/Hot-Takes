const jwt = require('jsonwebtoken');
 
const dotenv = require('dotenv');
dotenv.config();
const AUTH_TOKEN = process.env.SECRET_TOKEN;

module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, AUTH_TOKEN);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};