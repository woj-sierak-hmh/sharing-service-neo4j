// $ npm run test:unit -- -- app/db/queries/__tests__/shares.unit.test.js

import { getSession } from '../../connection.js';
import { createShare, getShares } from '../shares.js';

const runRet = { foo: 'bar' };
let mockRun;
const mockClose = jest.fn();

jest.mock('../../connection.js', () => {
  return {
    getSession: jest.fn().mockImplementation(() => {
      return {
        run: mockRun,
        close: mockClose,
      };
    }),
  };
});

describe('shares', () => {
  beforeAll(() => {
    getSession.mockClear();
  });

  afterEach(() => {
    getSession.mockClear();
  });

  test('createShare', async () => {
    mockRun = jest.fn(() => Promise.resolve(runRet));
    const inputObj = {
      tenantRefId: 'tenantRefId',
      sharerRefId: 'sharerRefId',
      assetType: 'assetType',
      assetRefId: 'assetRefId',
      recipients: 'recipients',
    };

    const res = await createShare(inputObj);

    expect(mockRun).toBeCalled();
    expect(mockRun.mock.calls[0][0]).toMatchSnapshot();
    expect(mockRun.mock.calls[0][1]).toMatchSnapshot({
      createdDate: expect.any(String),
    });

    expect(mockClose).toBeCalled();
    expect(res).toBe(runRet);
  });

  test('getShares', async () => {
    const dbRetObj = i => ({
      get: v => v + i,
    });
    mockRun = jest.fn().mockResolvedValue({
      records: [dbRetObj(0), dbRetObj(1), dbRetObj(2)],
    });
    const inputObj = {
      tenantRefId: 'tenantRefId',
      userRefId: 'userRefId',
      assetType: 'assetType',
    };
    const res = await getShares(inputObj);

    expect(mockRun.mock.calls[0]).toMatchSnapshot();
    expect(mockClose).toBeCalled();
    expect(res).toMatchSnapshot();
  });
});
