const buble = require('buble');
const pkg = require('../package.json');

module.exports = {
  process: src => buble.transform(src, pkg.buble).code
};
