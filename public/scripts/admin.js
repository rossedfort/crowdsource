var socket = io();

var aVoteCount = $("#a");
var bVoteCount = $('#b');
var cVoteCount = $('#c');

socket.on(location.pathname.split("/")[2], function (votes) {
  aVoteCount[0].innerHTML = votes.A;
  bVoteCount[0].innerHTML = votes.B;
  cVoteCount[0].innerHTML = votes.C;
});
