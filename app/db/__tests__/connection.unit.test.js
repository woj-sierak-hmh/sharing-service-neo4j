import { v1 as neo4j } from 'neo4j-driver';
import config from '../../config.js';
import { getSession } from '../connection.js';

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
    expect(basic).toBeCalledWith(
      config.get('DB_AUTHB_USERNAME'),
      config.get('DB_AUTHB_PASSWORD')
    );
    expect(neo4j.driver).toBeCalledWith(config.get('DB_URI'), basicReturn);
    expect(session).toBeCalled();
  });
});
