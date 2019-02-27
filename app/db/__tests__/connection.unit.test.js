import { v1 as neo4j } from 'neo4j-driver';
import config from '../../config.js';
import { getSession } from '../connection.js';

const sessionReturn = 'session-return';
const session = jest.fn().mockReturnValue(sessionReturn);

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

  test('call getSession once to initializes neo4j driver', () => {
    const ret = getSession();
    expect(ret).toBe(sessionReturn);
    expect(basic).toBeCalledWith(
      config.get('DB_AUTHB_USERNAME'),
      config.get('DB_AUTHB_PASSWORD')
    );
    expect(neo4j.driver).toBeCalledWith(config.get('DB_URI'), basicReturn);
    expect(session).toBeCalled();
  });

  test('call getSession again to check initialization happens once', () => {
    const ret1 = getSession();
    const ret2 = getSession();
    expect(ret1).toBe(sessionReturn);
    expect(ret2).toBe(sessionReturn);
    expect(basic).toBeCalledTimes(0);
    expect(neo4j.driver).toBeCalledTimes(0);
    expect(session).toBeCalledTimes(0);
  });
});
