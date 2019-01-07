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