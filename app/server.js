const koa = require('koa');
const koaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const neo4j = require('neo4j-driver').v1;

const app = new koa();
app.use(bodyParser());

const router = new koaRouter();

const uri = 'bolt://localhost';
const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'karmen'));
const session = driver.session();

/* 
  Create endpoint for creating a share
  POST
  "/v2/control/tenant/{tenantRefId}/user/{sharerRefId}/assetType/{assetType}/{assetRefId}/sharerSettings"

  header: {
    "Authorization": "service-token"
  }
  pathVariables:
    - tenantRefId - district
    - sharerRefId - asset owner's id
    - assetType - PLAN
    - assetRefId - doc123
  body: {
    "recipientRefIds": "recipient-user-id", "recipient-user-id"]

    // in the future:?
    "readAccessType": "READ"
  }

  returns 202 accepted
  verifies whether it gets valid guids:
  12345678-1234-1234-1234-123456789012

  $ curl -vX POST http://localhost:8080/v2/control/district1/user/teacher1/assetType/PLAN/plan456/sharerSettings
*/
router.post('/v2/control/:tenantRefId/user/:sharerRefId/assetType/:assetType/:assetRefId/sharerSettings', async (ctx, next) => {
  // TODO validation of params

  console.log('ctx.request.body:', ctx.request.body);
  const recipientRefIds = ctx.request.body.recipientRefIds;
  console.log('recipientRefIds:', recipientRefIds);

  try {
    const result = await session.run(
      'MERGE (org:Organization {orgRefId: {tenantRefId}}) ' +
      'MERGE (asset:Asset {assetRefId: {assetRefId}, assetType: {assetType}, isActive: "true"}) ' +
      'MERGE (org)-[:MASTER_OF]->(asset) ' +
      'MERGE (creator:User {userRefId: {sharerRefId}}) ' +
      'MERGE (creator)-[:CREATOR_OF]->(asset) ' +
      'FOREACH (ref IN {recipients} | ' + 
      '  MERGE (recipient:User {userRefId: ref}) ' +
      '  MERGE (asset)-[:SHARED_WITH {type:"READ", createdDate: $createdDate}]->(recipient))',
      {
        ...ctx.params, 
        createdDate: new Date().toISOString(),
        // temporarily...
        //recipient: `teacher` + Math.ceil(Math.random() * 100)
        recipients: recipientRefIds
      }
    )
    console.log('--------------->', result.summary.statement.parameters);
    ctx.status = 202;
  } catch (err) {
    console.log('=================Error================');
    console.log(err);
    console.log('======================================');
    ctx.status = 500;
    ctx.body = 'Apparently something went wrong...' + err.code;
  }
  session.close();
  
  // on application exit:
  // driver.close();
});

/*
MATCH (:User {userRefId:"teacherB3"})<-[share:SHARED_WITH]-(asset:Asset {assetType:"PLAN"})<-[:MASTER_OF]-(:Organization {orgRefId:"districtB"})
WITH share, asset
MATCH (asset)<-[:CREATOR_OF]-(owner:User)
RETURN asset.assetRefId, share.createdDate, owner.userRefId
*/
router.get('/v2/access/tenant/:tenantRefId/user/:userRefId/asset/:assetType/assets', async ctx => {
  console.log('params-->', ctx.params);
  try {
    const results = await session.run(
      'MATCH (:User {userRefId: {userRefId}})<-[share:SHARED_WITH]-(asset:Asset {assetType: {assetType}})<-[:MASTER_OF]-(:Organization {orgRefId: {tenantRefId}}) ' +
      'WITH share, asset ' +
      'MATCH (asset)<-[:CREATOR_OF]-(owner:User) ' +
      'RETURN asset.assetRefId AS assetRefId, asset.assetType AS assetType, ' +
      'share.createdDate AS shareDate, owner.userRefId AS sharerRefId',
      ctx.params
    );
    
    const assets = results.records.map(r => {
      return {
        assetRefId: r.get('assetRefId'),
        assetType: r.get('assetType'),
        shareRefId: r.get('sharerRefId'),
        shareDate: r.get('shareDate')
      };
    });
    ctx.status = 200;
    ctx.body = {assets};
  } catch (err) {
    console.log('=================Error================');
    console.log(err);
    console.log('======================================');
    ctx.status = 500;
    ctx.body = 'Apparently something went wrong...' + err.code;
  }
  session.close();
});

app.use(router.routes());
// responds to OPTIONS requests
app.use(router.allowedMethods());

// GET    "/v2/access/tenant/{tenantRefId}/user/{userRefId}/asset/{assetType}/assets"
// DELETE "/v2/control/tenant/{tenantRefId}/assetType/{assetType}/{assetRefId}"

/*
Read endpoint for sharer
GET /my-shares
header: {
  "Authorization": "owner-user-id"
}
MATCH (owner:Person {userId: "owner-user-id"})-[owns:Owns]->(resource:Resource)<-[access:HasAccess]-(recipient:Person)
RETURN ownwer, owns, resource, recipient
*/

module.exports = app;