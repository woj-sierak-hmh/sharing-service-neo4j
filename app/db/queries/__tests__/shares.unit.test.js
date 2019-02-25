import { getSession } from '../../connection.js';
import { createShare } from '../shares.js';

const runRet = { foo: 'bar' };
const mockRun = jest.fn(() => runRet);
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
    // getSession.mockImplementation(() => {
    //   return {
    //     run: mockRun,
    //     close: mockClose,
    //   };
    // });
    //console.log(getSession);
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

    const res = await createShare(inputObj);
    console.log('--->', getSession.mock.calls);

    expect(mockRun).toBeCalled();
    console.log('aa->', mockRun.mock.calls[0]);
    expect(mockRun.mock.calls[0][0]).toMatchSnapshot();
    expect(mockRun.mock.calls[0][1]).toMatchSnapshot({
      createdDate: expect.any(String),
    });

    expect(mockClose).toBeCalled();
    expect(res).toBe(runRet);

    // expect(res).toBe('-done-');
    // expect(run).toHaveBeenCalled(); // With(inputObj);
    // expect(close).toHaveBeenCalled();
  });
});
