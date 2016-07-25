var flash = require('./flash.js').flash;
var dbConn = require("../dbConn.js");


module.exports = {
    
    deletePoll: function(req, res){
        questionId= req.query.id;
        dbConn.deletePoll(questionId);
        res.redirect(302,'/myPolls'); 
    },   
    
    success:  function(req, res){        
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
    
    registerVote:  function(req, res){
        var id_question=req.query.question_id;
        var people_answer=req.query.option_id;
        var question, options, numOptions;

        dbConn.registerAnswer(id_question,people_answer, function(err, data){
            console.log('registering your question');
            if (err){
                console.log('error registering your vote' + err);
                flash(req, 'danger', 'registration error!', 'your vote was not registered! try again.');
                throw(err)
            }
            else{
                flash(req, 'success', 'vote registered', 'Your vote was registered with success');
                res.redirect(302,'/success/?id='+id_question); 
            }        
        }); 
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
                res.render('question_page', {layout: layout , question: question, options: options});  
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
        return res.redirect(303, '/myPolls');
    },
}



