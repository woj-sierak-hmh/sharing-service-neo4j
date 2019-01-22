import server from './server.js';
import config from './config.js';
import log from './utils/logger.js';

const PORT = process.argv[2] || config.get('local:port');

server.listen(PORT, () => {
  log.info(`Service listens on port ${PORT}`);
});
