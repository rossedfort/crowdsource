const pollBuilder = {
  buildPoll: (hash, body) => {
    return poll = {
      active: true,
      hash: hash,
      name: body.name,
      description: body.description,
      answers: buildAnswersForPoll(body.answer)
    }
  }
}

function buildAnswersForPoll(answers) {
  completed = []
  answers.forEach(function(answer){
    completed.push({answer: answer, count: 0})
  });
  return completed
}

 module.exports = pollBuilder;
