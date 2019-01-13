const fetch = require('node-fetch');
const { testRequest, removeAllData } = require('./utils');
const config = require('../../app/config.js');

const host = `${config.get('test:int:host')}:${config.get('test:int:port')}/`;

// todo - do we need async here?
describe('createShare', () => {
  beforeAll(async () => {
    //await setupIntTest();
    await removeAllData();
  });
  afterAll(async () => {
    //await teardownIntTest();
    await removeAllData();
  });

  describe('As a teacher owner of an asset, I...', async () => {
    it('should be able to share asset with other teachers in the same district A', async () => {
      const district = 'districtA';
      const creator = 'teacherA1';
      const resourceType = 'PLAN';
      const resourceId = 'plan1';

      const query = `v2/control/${district}/` +
        `user/${creator}` +
        `/assetType/${resourceType}/${resourceId}/sharerSettings`;
      
      const body = {"recipientRefIds": ["teacherA2", "teacherA3B1"]};

      const fetchResult = await testRequest({query, body});

      expect(fetchResult.status).toBe(202);
    });

    it('should be able to share asset with other teachers in the same district A', async () => {
      const district = 'districtA';
      const creator = 'teacherA3B1';
      const resourceType = 'PLAN';
      const resourceId = 'plan2';

      const query = `v2/control/${district}/` +
        `user/${creator}` +
        `/assetType/${resourceType}/${resourceId}/sharerSettings`;

      const body = {"recipientRefIds": ["teacherA1", "teacherA2"]};

      const fetchResult = await testRequest({query, body});

      expect(fetchResult.status).toBe(202);
    });

    it('should be able to share asset with other teachers in the same district B', async () => {
      const district = 'districtB';
      const creator = 'teacherA3B1';
      const resourceType = 'PLAN';
      const resourceId = 'plan3';
      
      const query = `v2/control/${district}/` +
        `user/${creator}` +
        `/assetType/${resourceType}/${resourceId}/sharerSettings`;
      
      const body = {"recipientRefIds": ["teacherB2", "teacherB3"]};
      const fetchResult = await testRequest({query, body});
      expect(fetchResult.status).toBe(202);
    });
  });
});
