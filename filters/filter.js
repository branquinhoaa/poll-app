var dbConnection = require("../handlers/dbConn.js");

module.exports = {
  verifyCurrentUser:function(req, res, next){
        console.log("verifyCurrentUser", req.session);
        if(req.session && req.session.user){
            dbConnection.userByID(req.session.user, function(err, userData){
                if(userData){
                    req.user=userData[0]['_id'];
                    req.session.user=userData[0]['_id'];
                    res.locals.user_name = userData[0]['name'];
                }
                next();
            });
        } else {
            next();
        }
    },
}