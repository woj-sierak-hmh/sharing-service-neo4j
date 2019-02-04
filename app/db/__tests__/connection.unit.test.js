import { v1 as neo4j } from 'neo4j-driver';
import config from '../../config.js';

const session = jest.fn();
const basic = jest.fn((username, password) => {
  expect(username).toBe(config.get('DB_AUTHB_USERNAME'));
  expect(password).toBe(config.get('DB_AUTHB_PASSWORD'));
});

neo4j.driver = jest.fn((dbURI, authBasic) => {
  expect(dbURI).toBe(config.get('DB_URI'));
  // expect(authBasic).toEqual(neo4j.auth.basic);
  return {
    session,
  };
});

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
    require('../connection.js');
    expect(session).toBeCalled();
    expect(basic).toBeCalled();
    expect(neo4j.driver).toBeCalled();
  });
});
