import { v1 as neo4j } from 'neo4j-driver';
import config from '../../config.js';
import { getSession } from '../connection.js';

// const neo4jmock = 
jest.mock('neo4j-driver');
// console.log('neo4jmock------------->', neo4jmock);
// console.log('-----------------------------------')
// console.log('neo4jmock.driver------------->', neo4jmock.driver);
// console.log('-----------------------------------')
// console.log('neo4j------------->', neo4j);
console.log('-----------------------------------');
console.log('neo4j.driver.mock--------->', neo4j.driver.mock);
console.log('-----------------------------------');
console.log('neo4j.driver--------->', neo4j.driver);

const session = jest.fn();

neo4j.driver = jest.fn((dbURI, authBasic) => {
  return {
    session,
  };
});

const basicReturn = { foo: 'bar' };

const basic = jest.fn().mockReturnValue(basicReturn);

neo4j.auth = {
  basic,
};

describe('connection', () => {
  beforeEach(() => {
    session.mockClear();
    basic.mockClear();
    neo4j.driver.mockClear();
  });

  test('initializes neo4j driver', () => {
    // require('../connection.js');
    getSession();
    // expect(neo4jmock.driver).toBeCalled();
    expect(basic).toBeCalledWith(
      config.get('DB_AUTHB_USERNAME'),
      config.get('DB_AUTHB_PASSWORD')
    );
    expect(neo4j.driver).toBeCalledWith(config.get('DB_URI'), basicReturn);
    expect(session).toBeCalled();
  });
});
