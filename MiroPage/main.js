var express = require('express');
var app = express();
// var app = require('./routes/chat')
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

var http = require('http').Server(app); //1
var io = require('socket.io')(http);    //1


let room = ['room1', 'room2'];
let a = 0;



io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });


  socket.on('leaveRoom', (num, name) => {
    socket.leave(room[num], () => {
      console.log(name + ' leave a ' + room[num]);
      io.to(room[num]).emit('leaveRoom', num, name);
    });
  });


  socket.on('joinRoom', (num, name) => {
    socket.join(room[num], () => {
      console.log(name + ' join a ' + room[num]);
      io.to(room[num]).emit('joinRoom', num, name);
    });
  });


  socket.on('chat message', (num, name, msg) => {
    a = num;
    io.to(room[a]).emit('chat message', name, msg);
  });
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://sooohh6:tngus1127@ds143971.mlab.com:43971/miroinside', {useNewUrlParser : true})

app.all('*', function(req, res){
  res.status(404).send('404 Error!');
});

http.listen(3000, function(req, res){ //4
  console.log('잘했어');

});
