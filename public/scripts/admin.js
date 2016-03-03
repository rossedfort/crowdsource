var socket = io();

var aVoteCount = $("#a");
var bVoteCount = $('#b');
var cVoteCount = $('#c');
var dVoteCount = $('#d');

socket.on('voteCount', function (votes) {
  aVoteCount[0].innerHTML = votes.A;
  bVoteCount[0].innerHTML = votes.B;
  cVoteCount[0].innerHTML = votes.C;
  dVoteCount[0].innerHTML = votes.D;
});
