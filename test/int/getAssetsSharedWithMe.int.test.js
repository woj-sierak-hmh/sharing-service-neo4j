import { testRequest, createSeedData, removeAllData } from './utils';
// import config from '../../app/config.js';

// const host = `${config.get('test:int:host')}:${config.get('test:int:port')}/`;

describe('getShares', () => {
  beforeEach(async () => {
    await removeAllData();
    await createSeedData();
  });
  afterEach(async () => {
    await removeAllData();
  });
  describe('As a teacher recipient, I...', () => {
    it('should be able to retrieve assets shared with me', async () => {
      // GET /v2/access/tenant/{tenantRefId}/user/{userRefId}/asset/{assetType}/assets
      const district = 'districtA';
      const recipient = 'teacherA2';
      const resourceType = 'PLAN';

      const query =
        `v2/access/tenant/${district}/` +
        `user/${recipient}` +
        `/asset/${resourceType}/assets`;

      const fetchResult = await testRequest({ query, method: 'GET' });

      const parsedResult = await fetchResult.json();

      expect(fetchResult.status).toBe(200);

      expect(parsedResult).toMatchSnapshot({
        assets: [
          {
            assetRefId: 'plan2',
            assetType: 'PLAN',
            shareRefId: 'teacherA3B1',
            shareDate: expect.any(String),
          },
          {
            assetRefId: 'plan1',
            assetType: 'PLAN',
            shareRefId: 'teacherA1',
            shareDate: expect.any(String),
          },
        ],
      });
    });
  });
});
