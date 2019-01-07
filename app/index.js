const server = require('./server.js');
const config = require('./config');

const PORT = process.argv[2] || config.get('local:port');

server.listen(PORT, () => {
  console.log(`Service listens on port ${PORT}`);
});