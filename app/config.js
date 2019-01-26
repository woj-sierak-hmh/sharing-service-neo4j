import nconf from 'nconf';
import path from 'path';

const env = process.env.ENV || 'local';
const commonConfig = path.join(process.cwd(), 'config/config.json');

nconf
  .argv()
  .env()
  .file('commonFile', { file: commonConfig });

nconf.set('env', env);

export default nconf;
