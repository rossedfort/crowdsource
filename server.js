const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const app = express();
var bodyParser = require('body-parser')
var votes = {};
app.locals.polls = {};
const generateId = require('./lib/generate-id');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/views/index.html');
});

app.get('/poll', function (req, res){
  res.sendFile(__dirname + '/public/views/poll.html');
});

app.post('/polls', function(req, res){
  var id = generateId();
  
  res.sendFile(__dirname + '/public/views/polls.html')
});

app.get('/voter', function (req, res){
  res.sendFile(__dirname + '/public/views/voter.html')
});

app.get('/admin', function (req, res){
  res.sendFile(__dirname + '/public/views/admin.html')
});

const port = process.env.PORT || 3000;

const server = http.createServer(app)
server.listen(port, function () {
  console.log('Listening on port ' + port + '.');
});

const io = socketIo(server);

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('userConnection', io.engine.clientsCount);

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.broadcast.emit('voteCount', countVotes(votes));
      socket.emit('voteCount', countVotes(votes));
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    socket.emit('voteCount', countVotes(votes));
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });
});

function countVotes(votes) {
  var voteCount = {
      A: 0,
      B: 0,
      C: 0,
      D: 0
  };
    for (var vote in votes) {
      voteCount[votes[vote]]++
    }
    return voteCount;
}

module.exports = server;
