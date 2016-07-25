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

module.exports ={ 
    login: function(req, res){
        res.render('login');   
    },
    
    loginProc: function(req,res){
        var email = req.body.email, psw = req.body.psw;
        
        getUser(email, function(err, userData){
            if (err){
                throw (err);
            }
            if (!userData[0]){
                flash(req, 'danger', 'Validation error!', 'The email address you entered was not valid.');
                return res.redirect(303, '/login');
            }
            var realPsw = userData[0]['password']; 
            if(psw === realPsw){
                req.session.user = userData[0]['_id'];
                flash(req, 'success', 'Logged with success!', 'You are now in your dashboard.');
                return res.redirect(303, '/myPolls');    
            } else {
                flash(req, 'danger', 'Validation error!', 'The password you entered was not valid.');
                return res.redirect(303, '/login');
            }
        });
    },
    
    logout: function(req, res){
        req.session.destroy(function(err) {
            res.redirect(303, '/');
        });
    },
}