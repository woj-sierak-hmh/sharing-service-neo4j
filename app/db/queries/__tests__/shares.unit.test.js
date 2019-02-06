import { getSession } from '../../connection.js';
import { createShare } from '../shares.js';

jest.mock('../../connection.js');

const run = jest.fn().mockResolvedValue('-done-');
const close = jest.fn();
const session = jest.fn(() => {
  return {
    run,
    close,
  };
});
console.log('getSession---->', getSession);
getSession = jest.fn(() => {
  return {
    session,
  };
});

describe('shares', () => {
  test('createShare', async () => {
    const inputObj = {
      tenantRefId: 'tenantRefId',
      sharerRefId: 'sharerRefId',
      assetType: 'assetType',
      assetRefId: 'assetRefId',
      recipients: 'recipients',
    };
    const res = await createShare(inputObj);
    expect(res).toBe('-done-');
    expect(run).toHaveBeenCalled(); // With(inputObj);
    expect(close).toHaveBeenCalled();
  });
});
