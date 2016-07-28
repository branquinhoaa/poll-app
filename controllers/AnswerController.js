var flash = require('../utilities/flash.js').flash;
var dbConn = require("../dbConn.js");
var Model = require('../models/models.js');


module.exports = {

 registerAnswer:  function(req, res){

  var id_question=req.query.question_id,
      people_answer=req.body.option,
      answer = new Model.AnswerModel({
       id_question:id_question,
       answer: people_answer
      });
  console.log("people anser "+people_answer)

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
  var idQuest=req.query.id,
      fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl,
      layout = (req.session.user)? 'logged':'main';     
  count(idQuest, function(err, countData){
   if (err){console.log(err)}
   else{
    Model.PollsModel.find({_id:idQuest}, function(err, questionData){
     if (err){console.log(err)}
     else {
      var question = questionData[0]['question'],
          options=questionData[0]['options'],
          votes=[];

      for (var i=0; i<options.length; i++){
       votes[i]=0;
      }
      for(item in countData){                      
       var index=countData[item]._id;
       votes[index]=countData[item].count;
      }       
      res.render('votes', {
       layout: layout, 
       question: question, 
       labels: JSON.stringify(options), 
       votes: JSON.stringify(votes), 
       myurl:fullUrl
      })

     }
    })
   }
  })
 }
}

function count (idQuest,callback){
 Model.AnswerModel.aggregate([
  {$match: {'id_question': idQuest}},     
  {$group: { _id : '$answer', count : {$sum : 1}}}], 
                             function(err, data){
  if (err){ callback(err)}
  else{
   callback(null,data);
  }
 });
}