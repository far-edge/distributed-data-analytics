const chai = require('chai');
const like = require('chai-like');

chai.use(require('chai-http'));

chai.use((_chai, utils) => {
  utils.addChainableMethod(_chai.Assertion.prototype, 'bodyProperty', function bodyProperty(prop) {
    return this.have.property('body').that.is.an('object').with.property(prop);
  });
});

like.extend({
  match: (object, expected) => {
    return typeof object === 'string' && expected instanceof RegExp;
  },
  assert: (object, expected) => {
    return expected.test(object);
  }
});
chai.use(like);

chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

chai.should();

module.exports = chai;
