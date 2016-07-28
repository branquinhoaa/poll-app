var mongoose = require('mongoose');
var url = process.env.MONGOLAB_URI;
var db = mongoose.connection;

db.on('error', function(){
 console.log('There was an error connecting to the database');
});

db.once('open', function() {
 console.log('Successfully connected to database');
});

mongoose.connect(url)

var polls = new mongoose.Schema({
 question: String,
 options: [{type: mongoose.Schema.Types.ObjectId, ref:'answers'}],
 'user-id':{}
});

var answers = new mongoose.Schema({
 id_question: String,
 answer: String
}); 

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