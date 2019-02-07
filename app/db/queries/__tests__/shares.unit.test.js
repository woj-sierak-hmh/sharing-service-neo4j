import { getSession } from '../../connection.js';
import { createShare } from '../shares.js';
jest.mock('../../connection.js', () => {
  return {
    getSession: jest.fn(),
  };
});

describe('shares', () => {
  beforeAll(() => {
    getSession.mockImplementation(() => {
      
    })
    console.log(getSession);
  });
  afterEach(() => {
    // getSession.mockClear();
  });
  test('createShare', async () => {
    const inputObj = {
      tenantRefId: 'tenantRefId',
      sharerRefId: 'sharerRefId',
      assetType: 'assetType',
      assetRefId: 'assetRefId',
      recipients: 'recipients',
    };

    // const res = await createShare(inputObj);
    // console.log(getSession.mock.calls);
    // expect(res).toBe('-done-');
    // expect(run).toHaveBeenCalled(); // With(inputObj);
    // expect(close).toHaveBeenCalled();
  });
});