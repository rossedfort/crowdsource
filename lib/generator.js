const crypto = require('crypto');

const generator = {
  generateUrl: (req) => {
    var hash = crypto.randomBytes(10).toString('hex');
    return `${req.protocol}://${req.get('host')}${req.originalUrl}/${hash}`
  }
}

module.exports = generator;
