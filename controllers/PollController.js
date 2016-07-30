var flash = require('../utilities/flash.js').flash;
var Model = require('../models/models.js');

module.exports = {
 deletePoll: function(req, res){
  var id= req.query.id;
  Model.PollsModel.remove({_id:id}, function(err, result){
   if (err) {
    flash(req, 'danger', 'poll was not deleted', 'try again');
    res.redirect('/');
   }
   else{
    flash(req, 'success', 'poll deleted', 'your poll was deleted');
    res.redirect(302,'/polls/myPolls'); 
   }
  })  
 },   

 showQuestion:  function(req, res){
  var question_id = req.query.id;
  var question, options; 
  var layout = (req.session.user)? 'logged':'main';
  Model.PollsModel.find({_id:question_id}, function(err, data){
   if(err){throw (err)}
   else{
    question = data[0]['question'];
    options = [];
    data[0]['options'].forEach(function(item,index){
     var id=""+index;
     options.push({option: item, option_id: id,question_id: question_id});
    });
   }
   res.render('registerAnswer', {layout: layout , question: question, options: options, question_id: question_id});  
  })
 },

 allPolls: function(req, res){
  Model.PollsModel.find(function(err, data){
   if (err){ 
    res.redirect('/');
    throw (err)
   } else {
    res.render('allPolls', {questions: data});  
   }
  })
 },

 myPolls: function(req, res){
  var id = req.session.user;
  Model.PollsModel.find({'user-id':id}, function(err, data){
   if(err){
    res.redirect('/');
   }
   else {
    var questionList =data
    res.render('myPolls', {layout: 'logged', questions: questionList});   
   }
  })
 },

 addPoll: function(req, res){ 
  var question = req.body.question;
  var options= req.body.option;
  var id = req.user;

  //create the object poll
  var poll = new Model.PollsModel({
   question: question,
   options: options,
   'user-id': id
  }).save(function(error, data){
   if (error){
    res.redirect('/'); 
   }else{
    flash(req, 'success', 'poll registered', 'your new poll is available');
    return res.redirect( '/polls/myPolls'); 
   }
  })
  }
}