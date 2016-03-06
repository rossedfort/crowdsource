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
