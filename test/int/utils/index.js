const intSetup = require('./intSetup.js');
const {requestLocalDB} = require('./testRequest.js');
const {createSeedData, removeAllData} = require('./prepData.js');

module.exports = {
  intSetup,
  testRequest: requestLocalDB,
  createSeedData,
  removeAllData
};