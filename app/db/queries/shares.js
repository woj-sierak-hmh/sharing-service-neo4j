import session from '../connection.js';

export const createShare = async ({
  tenantRefId,
  sharerRefId,
  assetType,
  assetRefId,
  recipients,
}) => {
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
      tenantRefId,
      sharerRefId,
      assetType,
      assetRefId,
      createdDate: new Date().toISOString(),
      // temporarily...
      // recipient: `teacher` + Math.ceil(Math.random() * 100)
      recipients,
    }
  );
  session.close();
  return result;
};

export const getShares = async ({ tenantRefId, userRefId, assetType }) => {
  const results = await session.run(
    'MATCH (:User {userRefId: {userRefId}})<-[share:SHARED_WITH]-(asset:Asset {assetType: {assetType}})<-[:MASTER_OF]-(:Organization {orgRefId: {tenantRefId}}) ' +
      'WITH share, asset ' +
      'MATCH (asset)<-[:CREATOR_OF]-(owner:User) ' +
      'RETURN asset.assetRefId AS assetRefId, asset.assetType AS assetType, ' +
      'share.createdDate AS shareDate, owner.userRefId AS sharerRefId ' +
      'ORDER BY shareDate DESC',
    {
      tenantRefId,
      userRefId,
      assetType,
    }
  );
  const assets = results.records.map(r => {
    return {
      assetRefId: r.get('assetRefId'),
      assetType: r.get('assetType'),
      shareRefId: r.get('sharerRefId'),
      shareDate: r.get('shareDate'),
    };
  });
  return assets;
};
