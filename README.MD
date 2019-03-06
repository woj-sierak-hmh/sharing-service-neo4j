## How to run locally

Run only Neo4j:
`sudo docker-compose up neo4j`

Run both webapp and db:
`sudo docker-compose up`

Stop container(s):
`sudo docker-compose down`

Neo4j browser:
`http://localhost:7474/browser/`


## Handy Cypher queries

Show everything:
`MATCH (n) RETURN n`

Remove everything:
`MATCH (n) DETACH DELETE n`

Add constraint:
`CREATE constraint ON (a:Asset) ASSERT a.assetRefId IS UNIQUE`

## TODO List (MVP):

In order of priority:
- [x] Setup docker compose with Neo4j image in one container and node app in another
- [x] Test connection between Node and Neo4j
- [x] Build db query and prototype endpoint for creating the share + tests
- [x] Build db query and prototype endpoint for getting assets shared with me + tests
- [ ] Build db query and prototype endpoint for deleting assets I own + tests
- [ ] Add district constraint to all queries
- [ ] Add input data validation
- [x] Move from common.js to es modules with babel
- [x] Use logger in place of console.logs
- [x] Read settings from env vars (dotenv only for dev env loaded with babel)
- [x] Add linter and prettier and use precommit hooks
- [x] Refactor koa app, organize routes, create db abstraction
- [ ] Add CI with Jenkins pipeline
- [ ] Add unit / functional / integration tests + coverage reports
- [ ] Ensure correct error handling is in place

Notes:
- [x] Tests should be independent from each other - use beforeAll/Each to populate db with seed data

## Ref Links:
- [env vars handling](https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786)
- [loading .env via babel plugin] https://github.com/motdotla/dotenv/issues/133
- [Jest mocks explained](https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c)
- [Jest cheat-sheet](https://github.com/sapegin/jest-cheat-sheet/blob/master/Readme.md)
- [Unit testing routes in express](https://medium.com/@jodylecompte/express-routes-a-tdd-approach-1e12a0799352)

## Handy tips

### Jest 

#### Run jest for just one test file

```bash
$ npm run test:unit -- -- app/db/__tests__/connection.unit.test.js
```

```bash
$ npm run test:unit:watch -- app/routes/__tests__/shares.unit.test.js
```

#### Get console.log output in jest report

Add `--verbose` flag when running jest