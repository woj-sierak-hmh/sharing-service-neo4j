import Koa from 'koa';
import KoaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import koaBunyanLogger from 'koa-bunyan-logger';

import * as shares from './db/queries/shares.js';
import log from './utils/logger.js';

const app = new Koa();
app.use(bodyParser());
app.use(koaBunyanLogger(log));
app.use(koaBunyanLogger.requestIdContext());
app.use(
  koaBunyanLogger.requestLogger({
    updateLogFields: fields => {
      fields.req = undefined;
      fields.res = undefined;
      fields.user_id = 'unspecified_user';
      // fields.client_version =
      //   this.request.get('X-Client-Version') || 'unspecified_client_version';
    },
  })
);

const router = new KoaRouter();

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
router.post(
  '/v2/control/:tenantRefId/user/:sharerRefId/assetType/:assetType/:assetRefId/sharerSettings',
  async (ctx, next) => {
    // TODO validation of params

    ctx.log.info('ctx.request.body:', ctx.request.body);
    const recipients = ctx.request.body.recipientRefIds;
    ctx.log.info('recipientRefIds:', recipients);

    try {
      const result = await shares.createShare({
        ...ctx.params,
        recipients: recipients || ['grzuby'],
      });
      ctx.log.info('--------------->', result.summary.statement.parameters);
      ctx.status = 202;
    } catch (err) {
      ctx.log.error(err);
      ctx.status = 500;
      ctx.body = 'Apparently something went wrong...' + err.code;
    }

    // on application exit:
    // driver.close();
  }
);

/*
MATCH (:User {userRefId:"teacherB3"})<-[share:SHARED_WITH]-(asset:Asset {assetType:"PLAN"})<-[:MASTER_OF]-(:Organization {orgRefId:"districtB"})
WITH share, asset
MATCH (asset)<-[:CREATOR_OF]-(owner:User)
RETURN asset.assetRefId, share.createdDate, owner.userRefId
*/
router.get(
  '/v2/access/tenant/:tenantRefId/user/:userRefId/asset/:assetType/assets',
  async ctx => {
    ctx.log.info('params-->', ctx.params);
    try {
      const assets = await shares.getShares(ctx.params);
      ctx.status = 200;
      ctx.body = { assets };
    } catch (err) {
      ctx.log.error(err);
      ctx.status = 500;
      ctx.body = 'Apparently something went wrong...' + err.code;
    }
  }
);

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

export default app;
