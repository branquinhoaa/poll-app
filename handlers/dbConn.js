var mongo = require('mongodb').MongoClient;
var url = 'mongodb://branqui:branqui@ds023485.mlab.com:23485/pollusers';
//PS.: COLOCAR DADOS NO ARQUIVO .ENV
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
                console.log("erro ao pegar todas as questoes do db")
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
        mongo.connect(url, function(err, db){
            var o_id = new ObjectId(idQuest);
            if(err){callback(err)}
            else {
                db.collection('polls').remove({
                    "_id":o_id
                }, true);
                db.collection('answers').remove({
                    "id_question":idQuest
                })
            }
            db.close();
        })
    },

    countVotes: function (idQuest, callback){
        mongo.connect(url, function(err, db){
            if(err){callback(err)}
            else {
                db.collection("answers").aggregate([
                    {$match: {'id_question': idQuest}},       
                    {$group: { _id : "$answer", count : {$sum : 1}}}]).toArray(function(err, count){
                    if(err){callback(err)}
                    else {callback(null, count);}
                })}
            db.close();   
        })},

    getAllAnswers: function (id_question, callback){
        mongo.connect(url, function(err,db){
            if (err) {
                console.log("tentei conectar e nao consegui"+err);
                throw(err);
                callback(err);
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
            db.close();
        });   
    },

    registerAnswer: function(id_question,id_answer, callback){
        var toCount=""+id_question+""+id_answer
        mongo.connect(url, function(err,db){
            if(err){
                callback(err)
            }else{ 
                db.collection("answers").insert({
                    'id_question': id_question,
                    'answer' : id_answer,
                    'counter' : toCount
                });
                callback(null, "message");
            }
            db.close();
        })      
    },

    registerPoll: function(question, options, id){
        mongo.connect(url, function(err,db){
            db.collection("polls").insert({
                'question': question,
                'options' : options,
                'user-id' : id
            });
            db.close();
        })         
    },

    returnPoll: function(userID, callback){
        mongo.connect(url, function(err,db){
            if (err) {
                console.log("tentei conectar e nao consegui"+err);
                throw(err);
                callback(err);
            } else {
                var o_id = new ObjectId(userID);
                db.collection("polls").find({
                    'user-id' : o_id
                }).toArray(function(err, data){
                    if (err){
                        console.log("não encontrei polls pertencentes a este usuario " + err)
                        callback(err);
                    } else {
                        console.log("Polls deste usuario encontrados. ");
                        callback(null,data);     
                    }
                });
            }            
            db.close();
        });
    },

    getQuestion: function(questionID, callback){
        mongo.connect(url, function(err,db){
            if (err) {
                console.log("tentei conectar e nao consegui"+err);
                throw(err);
                callback(err);
            } else {
                var o_id = new ObjectId(questionID);
                db.collection("polls").find({
                    '_id' : o_id
                }).toArray(function(err, data){
                    if (err){
                        console.log("não encontrei questions com esse id" + err)
                        callback(err);
                    } else {
                        console.log("question encontrada");
                        callback(null,data);     
                    }
                });
            }            
            db.close();
        });
    },

    registerUser: function(data){
        mongo.connect(url, function(err,db){
            if (err) {
                console.log("tentei conectar e nao consegui"+err);
                throw(err);
            } else {
                db.collection("users").insert({
                    'name': data[1],
                    'email': data[0],
                    'password': data[2]
                });
            }
            db.close();
        })
    },  

    getUser: function(email, callback){
        mongo.connect(url, function(err,db){
            if (err) {
                console.log("tentei conectar no bd e nao consegui "+err);
                callback(err);
            } else {
                db.collection("users").find({
                    'email' : email
                }).toArray(function(err, data){
                    if (err){
                        console.log("não encontrei usuario com esse email " +err)
                        callback(err);
                    } else {
                        callback(null,data);     
                    }
                });
            }            
            db.close();
        });
    },

    userByID: function(id, callback){
        var o_id = new ObjectId(id);
        mongo.connect(url, function(err,db){
            if (err) {
                console.log("tentei conectar no bd e nao consegui "+err);
                callback(err);
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
            db.close();
        });
    }
}



/*replace repetition with these functions:


function find(email){

}




function connect_users(){
    return (mongo.connect(url, function(err,db){
            if (err) {
                console.log(err);
            } else {
              return 
            var col = db.collection("users");
            }
        }));
}
*/