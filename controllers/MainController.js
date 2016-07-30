module.exports={    
    home : function(req,res){
        var layout = (req.session.user)? 'logged':'main';     
        res.render('index', {layout:layout});
    },    
}