let jwt = require('jsonwebtoken');
require('dotenv').config();


let authentication = (req, res, next) => {
  let token = req.headers.token;
  if(token){
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Invalid Token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    }
  )} else {
    return res.json({
      success: false,
      message: 'No Token'
    });
  }
}

module.exports = authentication;