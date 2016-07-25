var mongo = require('mongodb').MongoClient;
var url = process.env.MONGOLAB_URI;
var ObjectId = require('mongodb').ObjectID;

function connect (callback){
    mongo.connect(url, function(err, db){
        if(err){callback(err)}
        else {
            callback(null,db);     
        }
        db.close();
    })
}

module.exports = {

    getAllPolls:function(callback){
        connect(function(err, db){
            if(err){
                console.log("error to get all db's questions")
            } else {
                db.collection('polls').find().toArray(function(err, data){
                    if (err){
                        callback(err);
                    } else {
                        callback(null,data);     
                    }
                });
            }
        })
    },

    deletePoll: function(idQuest){
        var o_id = new ObjectId(idQuest);
        connect(function(err, db){
            if(err){
                console.log("error to delete question")
            } else {
                db.collection('polls').remove({
                    "_id":o_id
                }, true);
                db.collection('answers').remove({
                    "id_question":idQuest
                })
            }
        })
    },

    countVotes: function (idQuest, callback){
        connect(function(err, db){
            if(err){
                console.log("error in the aggregate made for the counting of votes")}
            else {
                db.collection("answers").aggregate([
                    {$match: {'id_question': idQuest}},       
                    {$group: { _id : "$answer", count : {$sum : 1}}}]).toArray(function(err, count){
                    if(err){callback(err)}
                    else {callback(null, count);}
                })}
        })
    },

    getAllAnswers: function (id_question, callback){        
        connect(function(err, db){
            if(err){
                console.log("error to get all answers")
            } else {
                db.collection("answers").find({
                    'id_question' : id_question
                }).toArray(function(err, data){
                    if (err){
                        callback(err);
                    } else {
                        callback(null,data);     
                    }
                });
            }            
        });   
    },

    registerAnswer: function(id_question,id_answer, callback){
        connect(function(err, db){
            if(err){
                console.log("error in register answers")
            } else { 
                db.collection("answers").insert({
                    'id_question': id_question,
                    'answer' : id_answer,
                    'counter' :""+id_question+id_answer
                });
                callback(null, "message");
            }
        })      
    },

    registerPoll: function(question, options, id){
        connect(function(err, db){
            if(err){
                console.log("error in register your poll")
            } else { 
                db.collection("polls").insert({
                    'question': question,
                    'options' : options,
                    'user-id' : id
                });
            }
        });
    },

    returnPoll: function(userID, callback){
        connect(function(err, db){
            if(err){
                console.log("error in return your poll")
            } else { 
                var o_id = new ObjectId(userID);
                db.collection("polls").find({
                    'user-id' : o_id
                }).toArray(function(err, data){
                    if (err){
                        console.log("no polls found for this user" + err)
                        callback(err);
                    } else {
                        callback(null,data);     
                    }
                });
            }            
        });
    },

    getQuestion: function(questionID, callback){
        connect(function(err, db){
            if(err){
                console.log("error in get the question")
            } else { 
                var o_id = new ObjectId(questionID);
                db.collection("polls").find({
                    '_id' : o_id
                }).toArray(function(err, data){
                    if (err){
                        console.log("Question not found " + err)
                        callback(err);
                    } else {
                        callback(null,data);     
                    }
                });
            }            
        });
    },

    registerUser: function(data){
        connect(function(err, db){
            if(err){
                console.log("error in register user")
            } else { 
                db.collection("users").insert({
                    'name': data[1],
                    'email': data[0],
                    'password': data[2]
                });
            }
        })
    },  

    getUser: function(email, callback){
        connect(function(err, db){
            if(err){
                console.log("error in get the user")
            } else { 
                db.collection("users").find({
                    'email' : email
                }).toArray(function(err, data){
                    if (err){
                        console.log("user not found " +err)
                        callback(err);
                    } else {
                        callback(null,data);     
                    }
                });
            }            
        });
    },

    userByID: function(id, callback){
        var o_id = new ObjectId(id);
        connect(function(err, db){
            if(err){
                console.log("error in get the user by id")
            } else { 
                db.collection("users").find({
                    '_id' : o_id
                }).toArray(function(err,data){
                    if (err){
                        callback(err);
                    } else {
                        callback(null,data); 
                    }
                });
            }
        });
    }
}