import bunyan from 'bunyan';
import pjson from '../package.json';

console.log(process.env);

const log = bunyan.createLogger({ name: pjson.name });

log.error({ grzyb: 'wielki' }, 'jakis blad');
log.warn({ grzyb: 'maly' }, 'jakies ostrzezenie');
log.info({ grzyb: 'wielki' }, 'jakas informacja');

log.info({ grzyb: 'wielki', req: 'zapytanie do serwera' }, 'specjalne formatowanie?');
log.info({ grzyb: 'maly', res: 'odpowiedz serwera' }, 'specjalne formatowanie?');

// $ npx babel-node index.js | npx bunyan -c 'this.grzyb == "maly"'
// $ npx babel-node index.js | npx bunyan -l warn

const printLogs = () => {
  console.log('log level', log.level());

  log.fatal('this is fatal');
  log.error('this is error');
  log.warn('this is warning');
  log.info('this is info');
  log.debug('this is debug');
  log.trace('this is trace');
};

printLogs();
log.level(bunyan.TRACE);
printLogs();
