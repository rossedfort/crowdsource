const http = require('http');
const express = require('express');
const ejs = require('ejs');
const socketIo = require('socket.io');
const app = express();
const bodyParser = require('body-parser')
const generator = require('./lib/generator');
const postBuilder = require('./lib/post-builder')
var votes = {};
app.locals.polls = {};

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
  var post = postBuilder.buildPost(req.body);
  res.render(__dirname + '/public/views/polls.ejs', {voter: voterUrl, admin: adminUrl, hash: hash, post: post})
});

app.get('/voter/:id', function (req, res){
  res.sendFile(__dirname + '/public/views/voter.html')
});

app.get('/admin/:id', function (req, res){
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
