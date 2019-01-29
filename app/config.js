import nconf from 'nconf';
import path from 'path';
import log from './utils/logger.js';

const commonConfig = path.join(process.cwd(), 'config/config.json');
nconf
  .argv()
  .env()
  .file('commonFile', { file: commonConfig });

// fix for nconf not being able to set env vars correctly
if (!nconf.get('DB_URI')) {
  log.error('nconf error', {
    msg: 'nconf did not set the env vars, setting manually',
    DB_URI: nconf.get('DB_URI'),
  });
  nconf.set('DB_URI', process.env.DB_URI);
  nconf.set('DB_AUTHB_USERNAME', process.env.DB_AUTHB_USERNAME);
  nconf.set('DB_AUTHB_PASSWORD', process.env.DB_AUTHB_PASSWORD);
}

export default nconf;
