var flash = require('../utilities/flash.js').flash;
var Model = require('../models/models.js')

module.exports ={ 
 login: function(req, res){
  res.render('login');   
 },

 loginProc: function(req,res){
  var email = req.body.email, 
      psw = req.body.psw;

  Model.UserModel.find({email:email}, function(err, data){
   if(err){
    flash(req, 'danger', 'Validation error!', 'The email address you entered was not valid.');
    return res.redirect('/login');
   }
   if(data[0]['password'] === psw){
    req.session.user = data[0]['_id'];
    flash(req, 'success', 'Logged with success!', 'You are now in your dashboard.');
    return res.redirect('/polls/myPolls');
   } else {
    flash(req, 'danger', 'Validation error!', 'The password you entered was not valid.');
    return res.redirect('/login');
   }
  })
 },

 logout: function(req, res){
  req.session.destroy(function(err) {
   res.redirect('/');
  });
 },
}