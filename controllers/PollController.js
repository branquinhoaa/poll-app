var flash = require('../utilities/flash.js').flash;
var dbConn = require("../dbConn.js");
var Model = require('../models/models.js');



module.exports = {

 deletePoll: function(req, res){
  var id= req.query.id;
  Model.PollsModel.remove({_id:id}, function(err, result){
   if (err) {
    flash(req, 'danger', 'poll was not deleted', 'try again');
    console.log ("I could not delete the poll!")}
   else{
    flash(req, 'success', 'poll deleted', 'your poll was deleted');
    res.redirect(302,'/polls/myPolls'); 
   }
  })  
 },   

 showQuestion:  function(req, res){
  var question_id = req.query.id;
  var question, options; 
  dbConn.getQuestion(question_id, function(err, data){
   if (err){ 
    console.log ('error: '+err)
    throw (err)
   } else {
    question = data[0]['question'];
    options = [];
    data[0]['options'].forEach(function(item,index){
     var id=""+index;
     options.push({option: item, option_id: id,question_id: question_id});
    });
    if (req.session.user){ var layout='logged'}
    else{ var layout='main'}
    res.render('registerAnswer', {layout: layout , question: question, options: options, question_id: question_id});  
   }
  })
 },

 allPolls: function(req, res){
  dbConn.getAllPolls(function(err, data){
   if (err){ 
    console.log ('error: '+err)
    throw (err)
   } else {
    res.render('allPolls', {questions: data});  
   }
  })
 },

 myPolls: function(req, res){
  var id = req.session.user;
  dbConn.returnPoll(id, function(err, data){
   if (err){ 
    console.log ('error: '+err)
    throw (err)
   } else {
    var questionList =[]
    for (var i in data){
     var question = {};
     question['question'] = data[i]['question'];
     question['options'] =  data[i]['options'];
     question['question_id'] = data[i]['_id'];
     questionList.push(question);
    }

    res.render('myPolls', {layout: 'logged', questions: questionList});  //--> put data dinamically        
   }           
  })
 },

 submitPolls: function(req, res){
  var question = req.body.question;
  var option= req.body.option;//mandar array
  var id = req.user;
  dbConn.registerPoll(question,option,id)
  flash(req, 'success', 'poll registered', 'your new poll is available');
  return res.redirect(303, '/polls/myPolls');
 },
}



