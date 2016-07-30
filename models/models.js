var mongoose = require('mongoose');
var url = process.env.MONGOLAB_URI;
var db = mongoose.connection;
mongoose.connect(url)

var polls = new mongoose.Schema({
 question: String,
 options: [String],
 'user-id':{}
});

var answers = new mongoose.Schema({
 id_question: String,
 answer: String
}); 

answers.statics.countByQuestionId = function (idQuest,callback){
 return this.aggregate([
  {$match: {'id_question': idQuest}},     
  {$group: { _id : '$answer', count : {$sum : 1}}}], 
                       function(err, data){
  if (err){ callback(err)}
  else{
   callback(null,data);
  }
 });
}

var users = new mongoose.Schema({
 name: String,
 email: String,
 password: String
});

var PollsModel = mongoose.model('polls', polls);
var AnswerModel = mongoose.model('answers', answers);
var UserModel = mongoose.model('users', users);

module.exports = {
 PollsModel: PollsModel,
 AnswerModel: AnswerModel,
 UserModel: UserModel
};