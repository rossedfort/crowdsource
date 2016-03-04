var socket = io();

var buttons = $('button');
var yourVote = $('#your-vote');
var prompt = $('#prompt');

localStorage.setItem('hash', location.pathname.split("/")[2])

for (var i = 0; i < buttons.length; i++) {
  if (sessionStorage.getItem('session') === null) {
    buttons[i].addEventListener('click', function () {
      sessionStorage.setItem('session', '87dcbwHLBS312o7bxads')
      $.each(buttons, function(index, value) {value.remove()})
      socket.send(localStorage.getItem('hash'), this.id);
      yourVote.append(this.innerText)
      prompt[0].innerHTML = "Thank you for your Vote!"
    });
  }
  else {
    yourVote.remove()
    $.each(buttons, function(index, value) {value.remove()})
    prompt[0].innerHTML = "You've already cast your vote, you cheater"
  }
}

console.log(sessionStorage);
