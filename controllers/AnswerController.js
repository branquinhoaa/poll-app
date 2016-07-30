var flash = require('../utilities/flash.js').flash;
var Model = require('../models/models.js');

module.exports = {
 registerAnswer: function(req, res) {
  var id_question=req.query.question_id,
      people_answer=req.body.option,
      answer = new Model.AnswerModel({
       id_question:id_question,
       answer: people_answer
      });
  answer.save(function(error){
   if(error){
    flash(req, 'danger', 'registration error!', 'your vote was not registered! try again.');
    res.redirect('/');
   } else {
    flash(req, 'success', 'vote registered', 'Your vote was registered with success');
    res.redirect('/answers/showResults/?id='+id_question); 
   }
  })
 }, 

 showResults:  function(req, res){        
  var idQuest=req.query.id,
      fullUrl =  req.protocol + '://' + req.get('host') + req.originalUrl,
      layout = (req.session.user)? 'logged':'main';     
  Model.AnswerModel.countByQuestionId(idQuest, function(err, countData){
   if (err){
    flash(req, 'danger', 'It was not possible show the results', ' try again.');
    res.redirect('/');
   }
   else{
    Model.PollsModel.find({_id:idQuest}, function(err, questionData){
     if (err){
      flash(req, 'danger', 'Not possible find this question results', 'try again.');
      res.redirect('/');
     }
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
    });
   };
  });
 }
}