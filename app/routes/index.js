import Router from 'koa-router';
import { createShare, getShares } from './shares.js';

const router = new Router();

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
  createShare
);

/*
MATCH (:User {userRefId:"teacherB3"})<-[share:SHARED_WITH]-(asset:Asset {assetType:"PLAN"})<-[:MASTER_OF]-(:Organization {orgRefId:"districtB"})
WITH share, asset
MATCH (asset)<-[:CREATOR_OF]-(owner:User)
RETURN asset.assetRefId, share.createdDate, owner.userRefId
*/
router.get(
  '/v2/access/tenant/:tenantRefId/user/:userRefId/asset/:assetType/assets',
  getShares
);

export default router;

// TODO

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
