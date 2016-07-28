var flash = require('../utilities/flash.js').flash;
var dbConn = require("../dbConn.js");
var Model = require('../models/models.js');


module.exports = {

 registerAnswer:  function(req, res){
  
  var id_question=req.query.question_id;
  var people_answer=req.body.option;
  var answer = new Model.AnswerModel({
   id_question:id_question,
   answer: people_answer
  });
  
  answer.save(function(error){
   if(error){
    flash(req, 'danger', 'registration error!', 'your vote was not registered! try again.');
   } else {
    flash(req, 'success', 'vote registered', 'Your vote was registered with success');
    res.redirect(302,'/answers/showResults/?id='+id_question); 
   }
  })
 },
 
 
 showResults:  function(req, res){        
  var idquest=req.query.id;
  var fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

  if (req.session.user){ var layout='logged'}
  else{ var layout='main'}

  dbConn.countVotes(idquest, function(err, data){
   if (err){console.log("error on vote counting")}
   else{
    dbConn.getQuestion(idquest, function(err, dataQues){
     if(err){console.log('Cannot get the question');}
     else{
      var question=dataQues[0]['question'];
      var options=dataQues[0]['options'];
      var votes=[];
      for (var i=0; i<options.length; i++){
       votes[i]=0;
      }
      for(item in data){                      
       var index=data[item]._id;
       votes[index]=data[item].count;
      }       

      res.render('votes', {
       layout: layout, 
       count: data, question: question, 
       labels: JSON.stringify(options), 
       votes: JSON.stringify(votes), 
       myurl:fullUrl
      })
     }
    })
   }   
  })
 },

}