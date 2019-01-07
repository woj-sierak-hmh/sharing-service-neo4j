const fetch = require('node-fetch');
const { setupIntTest, teardownIntTest } = require('./utils');
const config = require('../../app/config.js');

const host = `${config.get('test:int:host')}:${config.get('test:int:port')}/`;

// todo - do we need async here?
describe('createShare', () => {
  beforeEach(async () => {
    //await setupIntTest();
  });
  afterEach(async () => {
    //await teardownIntTest();
  });

  describe('as a teacher', async () => {
    it('should be able to share asset with other teacher in the same district', async () => {
      const district = 'district2';
      const creator = 'teacher1';
      const resourceType = 'PLAN';
      const resourceId = 'plan' + Math.ceil(Math.random() * 100);
      //const query = host +
      const query = 'http://localhost:8080/' +
                    `v2/control/${district}/` +
                    `user/${creator}` +
                    `/assetType/${resourceType}/${resourceId}/sharerSettings`;
      const fetchResult = await fetch(query, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"recipientRefIds": ["teacherA1", "teacherA2"]})
      });

      expect(fetchResult.status).toBe(202);
    });
  });
});