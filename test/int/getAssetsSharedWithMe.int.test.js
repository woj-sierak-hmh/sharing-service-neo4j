const fetch = require('node-fetch');
//const { setupIntTest, teardownIntTest } = require('./utils');
const config = require('../../app/config.js');

const host = `${config.get('test:int:host')}:${config.get('test:int:port')}/`;

describe('getShares', () => {
  describe('As a teacher recipient, I...', () => {
    it('should be able to retrieve assets shared with me', async () => {
      // GET /v2/access/tenant/{tenantRefId}/user/{userRefId}/asset/{assetType}/assets
      const district = 'districtA';
      const recipient = 'teacherA2';
      const resourceType = 'PLAN';

      const query = 'http://localhost:8080/' +
                    `v2/access/tenant/${district}/` +
                    `user/${recipient}` +
                    `/asset/${resourceType}/assets`;

      const fetchResult = await fetch(query, {
        method: 'GET'
      });

      const parsedResult = await fetchResult.json();

      console.log('========================')
      console.log(parsedResult);
      console.log('========================')

      expect(fetchResult.status).toBe(200);
      //expect(parsedResult).toMatchSnapshot();
      expect(parsedResult).toMatchSnapshot({
        shareDate: expect.any(Date),
      });
    });
  });
});