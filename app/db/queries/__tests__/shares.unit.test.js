import { getSession } from '../../connection.js';
import { createShare } from '../shares.js';

const runRet = { foo: 'bar' };
const mockRun = jest.fn(() => runRet);
const mockClose = jest.fn();

jest.mock('../../connection.js');
//, () => {
  // return {
  //   getSession: jest.fn(),
  // };
//});

describe('shares', () => {
  beforeAll(() => {
    getSession.mockImplementation(() => {
      return {
        run: mockRun,
        close: mockClose,
      };
    });
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
    //expect(mockRun).toBeCalledWith(inputObj);
    expect(mockClose).toBeCalled();
    expect(res).toBe(runRet);

    // expect(res).toBe('-done-');
    // expect(run).toHaveBeenCalled(); // With(inputObj);
    // expect(close).toHaveBeenCalled();
  });
});
