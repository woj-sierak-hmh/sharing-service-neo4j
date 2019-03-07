import { createShare, getShares } from '../shares.js';
import * as shares from '../../db/queries/shares.js';

jest.mock('../../db/queries/shares.js');

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
  log: {
    info: jest.fn(),
    error: jest.fn(),
  },
  status: null,
  body: 'grzyb',
};

const getSharesCtx = {
  params: {
    tenantRefId: 'districtA',
    userRefId: 'teacherA2',
    assetType: 'PLAN',
  },
  log: {
    info: jest.fn(),
    error: jest.fn(),
  },
  status: null,
  body: null,
};

describe('shares routes', () => {
  const dbError = { msg: 'some db error', code: 123 };

  describe('createShare', () => {
    afterEach(() => {
      createShareCtx.log.info.mockClear();
      createShareCtx.log.error.mockClear();
    });
  
    test('createShare success', async () => {
      shares.createShare = jest.fn().mockResolvedValue({
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
  
      await createShare(createShareCtx);
      expect(shares.createShare).toHaveBeenCalledWith({
        ...createShareCtx.params,
        recipients: createShareCtx.request.body.recipientRefIds,
      });
      expect(createShareCtx.log.info.mock.calls).toMatchSnapshot();
      expect(createShareCtx.log.error).toHaveBeenCalledTimes(0);
      expect(createShareCtx.status).toBe(202);
    });
  
    test('createShare db error', async () => {
      shares.createShare = jest.fn().mockRejectedValue(dbError);
      await createShare(createShareCtx);
      expect(shares.createShare).toHaveBeenCalledWith({
        ...createShareCtx.params,
        recipients: createShareCtx.request.body.recipientRefIds,
      });
      expect(createShareCtx.log.info.mock.calls).toMatchSnapshot();
      expect(createShareCtx.log.error.mock.calls[0][0]).toBe(dbError);
      expect(createShareCtx.status).toBe(500);
      expect(createShareCtx.body).toMatchSnapshot();
    });
  });

  describe('getShares', () => {
    afterEach(() => {
      getSharesCtx.log.info.mockClear();
      getSharesCtx.log.error.mockClear();
    });

    test('getShares success', async () => {
      const dbRes = [
        {
          assetRefId: 'plan2',
          assetType: 'PLAN',
          shareRefId: 'teacherA3B1',
          shareDate: '2019-01-13T12:01:11.356Z',
        },
        {
          assetRefId: 'plan1',
          assetType: 'PLAN',
          shareRefId: 'teacherA1',
          shareDate: '2019-01-13T12:01:11.153Z',
        },
      ];
      shares.getShares = jest.fn().mockResolvedValue(dbRes);
      await getShares(getSharesCtx);
      expect(shares.getShares).toHaveBeenCalledWith(getSharesCtx.params);
      expect(getSharesCtx.log.info.mock.calls).toMatchSnapshot();
      expect(getSharesCtx.log.error).toBeCalledTimes(0);
      expect(getSharesCtx.status).toBe(200);
      expect(getSharesCtx.body).toEqual({ assets: dbRes });
    });

    test('getShares db error', async () => {
      shares.getShares = jest.fn().mockRejectedValue(dbError);
      await getShares(getSharesCtx);
      expect(shares.getShares).toHaveBeenCalledWith(getSharesCtx.params);
      expect(getSharesCtx.log.info.mock.calls).toMatchSnapshot();
      expect(getSharesCtx.log.error.mock.calls[0][0]).toBe(dbError);
      expect(getSharesCtx.status).toBe(500);
      expect(getSharesCtx.body).toMatchSnapshot();
    });
  });
});
