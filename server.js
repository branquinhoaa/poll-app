require('dotenv').config({silent: true});
var express = require('express');
var route = require('./route.js');
var app = express();
var helper = ('./helpers/helper.js')
var port = process.env.PORT || 3000;

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
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGOLAB_URI
  })
}));

app.use(function(req, res, next){
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

route(app);

app.listen(port, function() {
  console.log('listening on port '+port);
})