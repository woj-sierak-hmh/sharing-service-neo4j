import bunyan from 'bunyan';
import pjson from '../../package.json';

// TODO: read from package.json through env vars
const log = bunyan.createLogger({
  level: 'debug',
  name: pjson.name,
  serializers: bunyan.stdSerializers,
  status: 'InDevelopment',
});

export default log;
