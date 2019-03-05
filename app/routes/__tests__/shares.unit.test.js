import { createShare, getShares } from '../shares.js';
import * as shares from '../../db/queries/shares.js';

const mockDbCreateShare = jest.fn().mockResolvedValue({
  summary: {
    statement: {
      parameters: {
        tenantRefId: 'districtA',
        sharerRefId: 'teacherA3B1',
        assetType: 'PLAN',
        assetRefId: 'plan2',
        createdDate: '2019-03-05T21:51:50.609Z',
        recipients: ['teacherA1', 'teacherA2'],
      },
    },
  },
});
// const mockDbGetShares = jest.fn();

jest.mock('../../db/queries/shares.js', () => {
  return {
    createShare: mockDbCreateShare,
    // getShares: mockDbGetShares,
  };
});

const createShareCtx = {
  request: {
    body: {
      recipientRefIds: ['teacherA2', 'teacherA3B1'],
    },
  },
  params: {
    tenantRefId: 'districtA',
    sharerRefId: 'teacherA3B1',
    assetType: 'PLAN',
    assetRefId: 'plan2',
  },
};

describe('shares routes', () => {
  beforeAll(() => {
    createShare.mockClear();
    getShares.mockClear();
  });

  afterAll(() => {
    createShare.mockClear();
    getShares.mockClear();
  });

  test('createShare success', async () => {
    await createShare(createShareCtx);
    expect(mockDbCreateShare).toHaveBeenCalledWith({
      ...createShareCtx.params,
      recipients: createShareCtx.request.body.recipientRefIds,
    });
  });
});
