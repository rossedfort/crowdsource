const crypto = require('crypto');

const generator = {
  hash: () => {
    return crypto.randomBytes(10).toString('hex');
  },
  generateVoterUrl: (req) => {
    return `${req.protocol}://${req.get('host')}/voter/`
  },
  generateAdminUrl: (req) => {
    return `${req.protocol}://${req.get('host')}/admin/`
  }
}

module.exports = generator;
