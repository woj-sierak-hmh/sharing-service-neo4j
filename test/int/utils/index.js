const intSetup = require('./intSetup.js');
const {requestLocalDB} = require('./testRequest.js');

module.exports = {
  intSetup,
  testRequest: requestLocalDB
};