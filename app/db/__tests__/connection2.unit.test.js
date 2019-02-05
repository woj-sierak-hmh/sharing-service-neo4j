import { v1 as neo4j } from 'neo4j-driver';
// import connection from '../connection.js';
import config from '../../config.js';

const neo4jmock = jest.mock('neo4j-driver');

// why console.log doesn't work?
console.log('AAAAAA--->', neo4j.mock);

const session = jest.fn();
const driver = {
  session,
};

neo4j.auth.basic = jest.fn();

neo4j.driver.mockImplementation(() => {
  return driver;
});

describe('connection', () => {
  beforeEach(() => {
    neo4jmock.clearAllMocks();
  });
  it('initializes neo4j driver', () => {
    require('../connection.js');
    expect(neo4j.driver).toBeCalled(); // with what?
    expect(neo4j.auth.basic).toBeCalledWith(
      config.get('DB_AUTHB_USERNAME'),
      config.get('DB_AUTHB_PASSWORD')
    );
    expect(session).toBeCalledTimes(1);
  });
});
