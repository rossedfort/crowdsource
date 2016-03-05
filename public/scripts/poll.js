var newAnswerButton = $('#newAnswer');
var removeAnswerButton = $('#removeAnswer');
var inputs = $('.inputs');
var alerts = $('.alerts');

newAnswerButton.click(function(){
  if ($('.answer').length === 6) {
    alerts.append(`<p class=" alert red-text">You can only have 6 answers to a poll</p>`);
    $('.alert').fadeOut(2000);
  } else {
    inputs.append(`<input class='answer' type="text" name="answer[]" placeholder="poll answer">`);
  }
});

removeAnswerButton.click(function(){
  if ($('.answer').length === 1) {
    alerts.append(`<p class=" alert red-text">You need to have at least 1 answer</p>`);
    $('.alert').fadeOut(2000);
  } else {
    $('.answer')[0].remove();
  }
});
