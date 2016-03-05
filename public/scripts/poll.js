var newAnswerButton = $('#newAnswer');
var inputs = $('.inputs');

newAnswerButton.click(function(){
  if ($('.answer').length === 6) {
    alert('Only 6 answers Allowed')
  } else {
    inputs.append(`<input class='answer' type="text" name="answer[]" placeholder="poll answer">`);
  }
});
