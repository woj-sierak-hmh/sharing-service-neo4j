const nconf = require('nconf');
const path = require('path');

const env = process.env.ENV || 'local';
const commonConfig = path.join(process.cwd(), 'config/config.json');

nconf.file('commonFile', {file: commonConfig});

nconf.set('env', env);

module.exports = nconf;