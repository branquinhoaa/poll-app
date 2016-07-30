var Model = require('../models/models.js');

module.exports = {
 verifyCurrentUser: function(req, res, next){
  if(req.session && req.session.user){
   Model.UserModel.find({'_id': req.session.user}, function(err, data){
    if(data){
     req.user=data[0]['_id'];
     req.session.user=data[0]['_id'];
     res.locals.user_name=data[0]['name'];     
    }
    next();
   })
  } else {
   next();
  }
 }
}