const koa = require('koa');
const koaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const neo4j = require('neo4j-driver').v1;

const app = new koa();
app.use(bodyParser());

const router = new koaRouter();

const uri = 'bolt://localhost';
const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'karen'));
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

// const personName = 'Wojtek';
// const resultPromise = session.run(
  //   'CREATE (a:Osoba {name: $name}) RETURN a',
  //   {name: personName}
  // );
  
  // resultPromise.then(results => {
    //   session.close();
    
    //   const singleRecord = results.records[0];
    //   const node = singleRecord.get(0);
    //   console.log('===>', node.properties.name);
    
    //   // on application exit:
    //   driver.close();
    // });
    
    // process.on('uncaughtException', function (err) {
      //   console.log('error --> ', err);
// }); 


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