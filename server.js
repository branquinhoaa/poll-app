var express = require('express');
var route = require('./route.js');
var app = express();
var helper = ('./helpers/helper.js')
var port = process.env.PORT || 3000;
//var Chart = require('chart.js')
//var myChart = new Chart({...})

//não tá funcionando pegar as variaveis locais do env
//var credentials = process.env.COOKIE_SECRET;
// set up handlebars view engine

var handlebars = require('express3-handlebars').create({
  defaultLayout:'main',
  helpers: {
    section: function(name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'SECRET',
  store: new MongoStore({
    url: 'mongodb://branqui:branqui@ds023485.mlab.com:23485/pollusers' 

  })
}));

// TODO: FIX secret
//app.use(require('cookie-parser')('SECRET'));
//app.use(require('express-session')());

app.use(function(req, res, next){
  // if there's a flash message, transfer
  // it to the context, then clear it

  res.locals.flash = req.session.flash;
  delete req.session.flash;

  next();
});

route(app);

app.listen(port, function() {
  console.log('listening on port '+port);
})