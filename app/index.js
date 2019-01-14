import server from './server.js';
import config from './config';

const PORT = process.argv[2] || config.get('local:port');

server.listen(PORT, () => {
  console.log(`Service listens on port ${PORT}`);
});