const fetch = require('node-fetch');
const config = require('../../../app/config.js');

const setupRequest = (host, port) => async ({
  method,
  query,
  additionalHeaders,
  body
}) => {
  const reqMethod = method || 'POST';
  const path = `${host}:${port}/${query}`;
  body = body ? JSON.stringify(body) : undefined;
  const fetchResult = await fetch(path, {
    method: reqMethod,
    headers: {
      'Content-Type': 'application/json',
      ...additionalHeaders
    },
    body
  });

  return fetchResult;
};

module.exports.requestLocalDB = setupRequest(
  config.get('test:local:host'),
  config.get('test:local:port')
)