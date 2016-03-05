var newAnswerButton = $('#newAnswer');
var inputs = $('.inputs');

newAnswerButton.click(function(){
  inputs.append(`<input type="text" name="answer[]" placeholder="poll answer">`);
})
