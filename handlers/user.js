//retirar desnecessarios depois

var flash = require('./flash.js').flash;

var getUser = require("./dbConn.js").getUser;
var register = require("./dbConn.js").registerUser;
var byID = require("./dbConn.js").userByID;
var registerPoll=require("./dbConn.js").registerPoll;
var returnPoll= require("./dbConn.js").returnPoll;
var getQuestion = require("./dbConn.js").getQuestion;
var registerAnswer = require("./dbConn.js").registerAnswer;
var getAllAnswers =  require("./dbConn.js").getAllAnswers;
var countVotes = require("./dbConn.js").countVotes;


module.exports = {

    register: function(req,res){
        res.render('register')
    },

    registerProcess: function(req, res){
        var email = req.body.email;
        var nome = req.body.name;
        var password = req.body.password;
        var data = [email, nome, password];
        getUser(email, function(err, userData){
            if (!userData[0]){
                register(data);
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