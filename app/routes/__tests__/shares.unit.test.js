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
  body: null,
};

describe('shares routes', () => {
  beforeAll(() => {
    // ?
  });

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

  test('createShare db failure', async () => {
    const dbError = { msg: 'some db error', code: 123 };
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
