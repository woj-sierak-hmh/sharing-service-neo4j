### How to run locally

Run only Neo4j:
`sudo docker-compose up neo4j`

Run both webapp and db:
`sudo docker-compose up`

Stop container(s):
`sudo docker-compose down`

Neo4j browser:
`http://localhost:7474/browser/`


### Handy Cypher queries

Show everything:
`MATCH (n) RETURN n`

Remove everything:
`MATCH (n) DETACH DELETE n`

Add constraint:
`CREATE constraint ON (a:Asset) ASSERT a.assetRefId IS UNIQUE`

### TODO List:

#### MVP:

In order of priority:
- [x] Setup docker compose with Neo4j image in one container and node app in another
- [x] Test connection between Node and Neo4j
- [x] Build db query and prototype endpoint for creating the share + tests
- [x] Build db query and prototype endpoint for getting assets shared with me + tests
- [ ] Build db query and prototype endpoint for deleting assets I own + tests
- [ ] Add district constraint to all queries
- [ ] Add input data validation
- [x] Move from common.js to es modules with babel
- [ ] Use logger in place of console.logs
- [ ] Add linter and prettier and use precommit hooks
- [ ] Refactor koa app, organize routes, env based configuration
- [ ] Add CI with Jenkins pipeline
- [ ] Add unit / functional / integration tests

Notes:
- [x] Tests should be independent from each other - use beforeAll/Each to populate db with seed data