var express = require('express');
var app = express();
var ejs = require('ejs');
var session = require('express-session')
var bodyParser = require('body-parser')
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.set('trust proxy', 1)   //trust first froxy

app.set('views', __dirname + '/public');

app.use(express.static(__dirname + '/src'));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const routes = require('./routes');

app.use('/', routes);


var mongoose = require('mongoose');
mongoose.connect('mongodb://sooohh6:tngus1127@ds143971.mlab.com:43971/miroinside',{useNewUrlParser: true})

app.all('*', function(req, res){
  res.status(404).send('404 Error!');
});

app.listen(3000, function(req, res){
  console.log('켬');
});
