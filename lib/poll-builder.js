const pollBuilder = {
  buildPoll: (hash, body) => {
    return poll = {
      hash: hash,
      name: body.name,
      description: body.description,
      answers: body.answer
    }
  }
}

 module.exports = pollBuilder;
