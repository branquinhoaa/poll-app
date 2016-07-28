/*Sessions are useful whenever you want to save a user preference that applies across
pages. Most commonly, sessions are used to provide user authentication information:
you log in, and a session is created. After that, you don’t have to log in again every time
you re-load the page.

It has become a standard to use POST for creating something, and
PUT for updating (or modifying) something. The English mean‐
ing of these words doesn’t support this distinction in any way, so
you may want to consider using the path to distinguish between
these two operations to avoid confusion.

*/

var main = require('./controllers/MainController.js'); 
var user = require('./controllers/UserController.js');
var login =require('./controllers/LoginController.js'); 
var polls = require('./controllers/PollController.js');
var answers = require('./controllers/AnswerController.js');
var filter= require('./filters/filter.js');

//ROUTES

module.exports = function (app){
 // FILTER
    app.use(filter.verifyCurrentUser);
 
 //MAIN ROUTE
    app.get("/",main.home);
 
 //USER ROUTES
    app.get("/register",user.register);
    app.post("/process", user.createUser);
    app.get("/dashboard", requireLogin, user.dashboard);
 
 
 //LOGIN ROUTES
    app.get("/login", login.login);    
    app.post("/login/proc", login.loginProc);
    app.get("/logout", login.logout); 
 
 //POLL ROUTES
    app.get("/polls/myPolls", polls.myPolls);
    app.post("/polls/submit", polls.submitPolls);
    app.get("/polls/allPolls", polls.allPolls);
    app.get("/polls/question", polls.showQuestion);
    app.get("/polls/deletepoll", polls.deletePoll);
 
 //ANSWER ROUTES
    app.get("/answers/vote",answers.registerVote);
    app.get("/answers/showResults",answers.showResults);
 
};


function requireLogin(req, res, next){
    if (!req.user){
        res.redirect('/login');
    } else {
        next();
    }
};
