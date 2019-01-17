import server from '../../../app/server.js';
import config from '../../../app/config.js';

let runningServer;

const setupIntTest = async () => {
  return new Promise(resolve => {
    runningServer = server.listen(config.get('test:int:port'), resolve);
  });
};

const teardownIntTest = async () => {
  return new Promise(resolve => {
    runningServer.close(resolve);
  });
};

export { setupIntTest, teardownIntTest };

// TODO: https://github.com/koajs/koa/issues/328
