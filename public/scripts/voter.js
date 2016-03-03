var socket = io();

var buttons = $('button');
var yourVote = $('#your-vote');
var prompt = $('#prompt');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    $.each(buttons, function(index, value) {value.remove()})
    socket.send('voteCast', this.innerText);
    yourVote.append(this.innerText)
    prompt[0].innerHTML = "Thank you for your Vote!"
  });
}
