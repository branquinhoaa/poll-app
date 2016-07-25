var flash = require('./flash.js').flash;
var dbConn = require("../dbConn")

module.exports = {

    register: function(req,res){
        res.render('register')
    },

    registerProcess: function(req, res){
        var email = req.body.email;
        var nome = req.body.name;
        var password = req.body.password;
        var data = [email, nome, password];
        dbConn.getUser(email, function(err, userData){
            if (!userData[0]){
                dbConn.registerUser(data);
                flash(req, 'success', 'Congratulations!', 'Registered with success.');
                return res.redirect(303, '/login');
            } else {
                flash(req, 'danger', 'Register error!','Email already exist.');
                return res.redirect(303, '/login');
            }
        });
    },

    dashboard: function(req,res) {
        res.render('dashboard', {layout: 'logged'});
    },

}