const http = require('http');
const express = require('express');
const Firebase = require("firebase");
const ejs = require('ejs');
const socketIo = require('socket.io');
const app = express();
const bodyParser = require('body-parser')
const generator = require('./lib/generator');
const pollBuilder = require('./lib/poll-builder')
var votes = {};

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/views/index.html');
});

app.get('/new-poll', function (req, res){
  res.sendFile(__dirname + '/public/views/poll.html');
});

app.post('/polls', function(req, res){
  var voterUrl = generator.generateVoterUrl(req);
  var adminUrl = generator.generateAdminUrl(req);
  var hash = generator.hash();
  var poll = pollBuilder.buildPoll(hash, req.body);
  var uniqueRef = new Firebase('https://burning-heat-1406.firebaseio.com/' + hash + '');
  uniqueRef.update({poll});
  res.render(__dirname + '/public/views/polls.ejs', {voter: voterUrl, admin: adminUrl, poll: poll})
});

app.get('/voter/:id', function (req, res){
  var pathId = req.originalUrl.split('/')[2]
  var ref = new Firebase('https://burning-heat-1406.firebaseio.com/' + pathId + '');

  ref.on("value", function(snapshot) {
    if (snapshot.val() === null) {
      res.sendFile(__dirname + '/public/views/error.html')
    } else {
      res.render(__dirname + '/public/views/voter.ejs', {poll: snapshot.val()})
    }
  }, function () {
    res.sendFile(__dirname + '/public/views/error.html')
  });
});

app.get('/admin/:id', function (req, res){
  var pathId = req.originalUrl.split('/')[2]
  var ref = new Firebase('https://burning-heat-1406.firebaseio.com/' + pathId + '');

  ref.on("value", function(snapshot) {
    if (snapshot.val() === null) {
      res.sendFile(__dirname + '/public/views/error.html')
    } else {
      res.render(__dirname + '/public/views/admin.ejs', {poll: snapshot.val()})
    }
  }, function () {
    res.sendFile(__dirname + '/public/views/error.html')
  });
});

const port = process.env.PORT || 3000;

const server = http.createServer(app)
server.listen(port, function () {
  console.log('Listening on port ' + port + '.');
});

const io = socketIo(server);

io.on('connection', function (socket) {
  socket.on('message', function (channel, message) {
    votes[socket.id] = message;
    socket.broadcast.emit(channel, countVotes(votes));
  });

  socket.on('disconnect', function () {
    delete votes[socket.id];
    socket.emit('voteCount', countVotes(votes));
  });
});

function countVotes(votes) {
  var voteCount = {
      A: 0,
      B: 0,
      C: 0
  };
    for (var vote in votes) {
      voteCount[votes[vote]]++
    }
    return voteCount;
}

module.exports = server;
