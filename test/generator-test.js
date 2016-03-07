const assert = require('assert');
const generator = require('../lib/generator');

describe('hash generator', () => {
  it('should generate a hash', () => {
    hash = generator.hash();
    console.log(hash);
    assert(hash);
  });
});
