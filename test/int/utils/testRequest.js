import fetch from 'node-fetch';
import config from '../../../app/config.js';

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

export const requestLocalDB = setupRequest(
  config.get('test:local:host'),
  config.get('test:local:port')
);