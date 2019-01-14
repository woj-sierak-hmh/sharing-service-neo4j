import { v1 as neo4j } from 'neo4j-driver';

const uri = 'bolt://localhost';
const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'karmen'));

const createSeedData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const session = driver.session();
      const statement = 'MERGE (org:Organization {orgRefId: {tenantRefId}}) ' +
      'MERGE (asset:Asset {assetRefId: {assetRefId}, assetType: {assetType}, isActive: "true"}) ' +
      'MERGE (org)-[:MASTER_OF]->(asset) ' +
      'MERGE (creator:User {userRefId: {sharerRefId}}) ' +
      'MERGE (creator)-[:CREATOR_OF]->(asset) ' +
      'FOREACH (ref IN {recipients} | ' + 
      '  MERGE (recipient:User {userRefId: ref}) ' +
      '  MERGE (asset)-[:SHARED_WITH {type:"READ", createdDate: $createdDate}]->(recipient))';
  
      const share1 = { tenantRefId: 'districtA',
      sharerRefId: 'teacherA1',
      assetType: 'PLAN',
      assetRefId: 'plan1',
      createdDate: '2019-01-13T12:01:11.153Z',
      recipients: [ 'teacherA2', 'teacherA3B1' ] };
  
      const share2 = { tenantRefId: 'districtA',
      sharerRefId: 'teacherA3B1',
      assetType: 'PLAN',
      assetRefId: 'plan2',
      createdDate: '2019-01-13T12:01:11.356Z',
      recipients: [ 'teacherA1', 'teacherA2' ] };
  
      const share3 = { tenantRefId: 'districtB',
      sharerRefId: 'teacherA3B1',
      assetType: 'PLAN',
      assetRefId: 'plan3',
      createdDate: '2019-01-13T12:01:11.379Z',
      recipients: [ 'teacherB2', 'teacherB3' ] };
  
      const result1 = await session.run(statement, share1);
      const result2 = await session.run(statement, share2);
      const result3 = await session.run(statement, share3);
  
      console.log('--------->Data successfully created');
      session.close();
      driver.close();
      resolve();
    } catch (err) {
      reject();
    }
  });
};

const removeAllData = () => {
  const session = driver.session();
  return session.run(
    'MATCH (n) DETACH DELETE (n)'
  ).then((result) => {
    //console.log(result);
    console.log('--------->Data successfully deleted');
    session.close();
    driver.close();
  });
}

//removeAllData();
//createSeedData();

export default {
  createSeedData,
  removeAllData
};