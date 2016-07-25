/*Sessions are useful whenever you want to save a user preference that applies across
pages. Most commonly, sessions are used to provide user authentication information:
you log in, and a session is created. After that, you don’t have to log in again every time
you re-load the page.*/



//conexao com handlers
var main = require('./handlers/main.js'); //(home)
var user = require('./handlers/user.js');//(register, registerproces)
var login =require('./handlers/login.js'); //(login, logproc)
var polls = require('./handlers/polls.js');//(polls)
var filter= require('./filters/filter.js')

module.exports = function (app){
    app.use(filter.verifyCurrentUser);
    app.get("/",main.home);
    app.get("/register",user.register);
    app.post("/process", user.registerProcess);
    app.get("/login", login.login);    
    app.post("/logproc", login.loginProc);
    app.get("/dashboard", requireLogin, user.dashboard);
    app.get("/myPolls", polls.myPolls);
    app.post("/submitPoll", polls.submitPolls);
    app.get("/allPolls", polls.allPolls);
    app.get("/question", polls.showQuestion);
    app.get("/vote",polls.registerVote);
    app.get("/success",polls.success);
    app.get("/deletepoll", polls.deletePoll);
    app.get("/logout", login.logout); 
};


function requireLogin(req, res, next){
    if (!req.user){
        res.redirect('/login');
    } else {
        next();
    }
};

function flash(req, typ, intr, messag){
    return (
        req.session.flash = {
            type: typ,
            intro: intr,
            message: messag,
        }
    )
}

