var socket = io();

var buttons = $('button');
var yourVote = $('#your-vote');
var prompt = $('#prompt');

localStorage.setItem('hash', location.pathname.split("/")[2])

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    $.each(buttons, function(index, value) {value.remove()})
    socket.send('vote', localStorage.getItem('hash'), this.innerText, this.id);
    yourVote.append(this.innerText)
    prompt[0].innerHTML = "Thank you for your Vote!"
  });
}

var aVoteCount = $("#td-1");
var bVoteCount = $('#td-2');
var cVoteCount = $('#td-3');
var dVoteCount = $("#td-4");
var eVoteCount = $('#td-5');
var fVoteCount = $('#td-6');

socket.on('vote', function (votes) {
  console.log('woop');
  aVoteCount[0].innerHTML = votes[1];
  bVoteCount[0].innerHTML = votes[2];
  cVoteCount[0].innerHTML = votes[3];
  dVoteCount[0].innerHTML = votes[4];
  eVoteCount[0].innerHTML = votes[5];
  fVoteCount[0].innerHTML = votes[6];
});
