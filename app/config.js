import nconf from 'nconf';
import path from 'path';
import dotenv from 'dotenv';

// TODO: use -r dotenv/config in npm script instead of importing dotenv here

dotenv.config();

const env = process.env.ENV || 'local';
const commonConfig = path.join(process.cwd(), 'config/config.json');

nconf
  .argv()
  .env()
  .file('commonFile', { file: commonConfig });

nconf.set('env', env);

export default nconf;
