var socket = io();
var aVoteCount = $("#1");
var bVoteCount = $('#2');
var cVoteCount = $('#3');
var dVoteCount = $("#4");
var eVoteCount = $('#5');
var fVoteCount = $('#6');
var closeAndSavePollButton = $('#closeAndSavePollButton')

socket.on('vote', function (votes) {
  aVoteCount[0].innerHTML = votes[1];
  bVoteCount[0].innerHTML = votes[2];
  cVoteCount[0].innerHTML = votes[3];
  dVoteCount[0].innerHTML = votes[4];
  eVoteCount[0].innerHTML = votes[5];
  fVoteCount[0].innerHTML = votes[6];
});

closeAndSavePollButton.click(function(){
  socket.emit('savePoll', location.pathname.split("/")[2]);
});
