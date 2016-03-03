var socket = io();

var aVoteCount = $("#a");
var bVoteCount = $('#b');
var cVoteCount = $('#c');

var hashChannel = localStorage.getItem('hash')
socket.on(hashChannel, function (votes) {
  aVoteCount[0].innerHTML = votes.A;
  bVoteCount[0].innerHTML = votes.B;
  cVoteCount[0].innerHTML = votes.C;
});
