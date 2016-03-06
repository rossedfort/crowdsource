const ejs = require('ejs');
const http = require('http');
const express = require('express');
const parseurl = require('parseurl');
const Firebase = require("firebase");
const socketIo = require('socket.io');
const bodyParser = require('body-parser')
const session = require('express-session')
const generator = require('./lib/generator');
const pollBuilder = require('./lib/poll-builder')

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: generator.hash(),
  resave: false,
  saveUninitialized: true
}))

app.locals.votes = {};

app.use(function (req, res, next) {
  var views = req.session.views

  if (!views) {
    views = req.session.views = {}
  }

  var pathname = parseurl(req).pathname

  views[pathname] = (views[pathname] || 0) + 1

  next()
})

app.get('/', function (req, res, next){
  res.sendFile(__dirname + '/public/views/index.html');
});

app.get('/new-poll', function (req, res, next){
  res.sendFile(__dirname + '/public/views/poll.html');
});

app.post('/polls', function(req, res, next){
  var voterUrl = generator.generateVoterUrl(req);
  var adminUrl = generator.generateAdminUrl(req);
  var hash = generator.hash();
  var poll = pollBuilder.buildPoll(hash, req.body);
  var uniqueRef = new Firebase('https://burning-heat-1406.firebaseio.com/' + hash + '');
  uniqueRef.update({poll});
  res.render(__dirname + '/public/views/polls.ejs', {voter: voterUrl, admin: adminUrl, poll: poll})
});

app.get('/voter/:id', function (req, res, next){
  var pathId = req.originalUrl.split('/')[2]
  if (req.session.views['/voter/' + pathId] > 1) {
    res.sendFile(__dirname + '/public/views/duplicate-vote.html')
  } else {
    var ref = new Firebase('https://burning-heat-1406.firebaseio.com/' + pathId + '');
    ref.on("value", function(snapshot) {
      if (snapshot.val() === null) {
        res.sendFile(__dirname + '/public/views/error.html')
      } else if (snapshot.val().poll.active === false) {
        res.sendFile(__dirname + '/public/views/closed.html')
      } else {
        res.render(__dirname + '/public/views/voter.ejs', {poll: snapshot.val()})
      }
    }, function () {
      res.sendFile(__dirname + '/public/views/error.html')
    });
  }
});

app.get('/admin/:id', function (req, res, next){
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
  sessionHash = generator.hash();
  socket.on('message', function (channel, hash, message, id) {
    if (channel === 'vote') {
      app.locals.votes[socket.id] = id;
      socket.broadcast.emit(channel, countVotes(app.locals.votes, id, message, hash));
    }
  });
  socket.on('disconnect', function () {
    delete app.locals.votes[socket.id];
  });
  socket.on('savePoll', function(hash){
    var ref = new Firebase('https://burning-heat-1406.firebaseio.com/' + hash + '/poll');
    ref.update({active: false})
  });
});

function countVotes(votes, id, message, channel) {
  var newId = (parseInt(id) - 1);
  var voteCount = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
  };
    for (var vote in votes) {
      voteCount[votes[vote]]++
    }
    var ref = new Firebase('https://burning-heat-1406.firebaseio.com/' + channel + '/poll/answers/' + newId);
    ref.update({ answer: message, count: voteCount[votes[vote]] });
    return voteCount;
}


module.exports = server;
