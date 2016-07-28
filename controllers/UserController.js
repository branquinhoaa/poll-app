var flash = require('../utilities/flash.js').flash;
var Model = require('../models/models.js');

module.exports = {

 register: function(req,res){
  res.render('register');
 },

 createUser: function(req, res){
  var email = req.body.email,
      nome = req.body.name,
      password = req.body.password,
      user = new Model.UserModel({
       name: nome,
       email: email,
       password: password
      });

  Model.UserModel.find({email:email}, function (err, data){
   console.log(data);
   if (!data[0]){
    user.save(function(error){
     if(error){
      flash(req, 'danger', 'not registered!', 'I could not register your user, try again.');
      res.redirect(303, '/register');
     } else {
      flash(req, 'success', 'Congratulations!', 'Registered with success.');
      return res.redirect(303, '/login'); 
     }
    });
   } else {
    flash(req, 'danger', 'Error!','User already exist.');
    return res.redirect(303, '/login');
   }
  });
 },

 dashboard: function(req,res) {
  res.render('dashboard', {layout: 'logged'});
 },

}