const express = require('express');
const app = express();

const neo4j = require('node-neo4j');
const db = new neo4j('http://neo4j:test@neo4j:7474');

app.get('/hello', (req, res) => {
  res.json({"hello": "world"});
});

app.get('/insert', (req, res, next) => {
  db.insertNode({
    name: "Ludzik" + parseInt(Math.random() * 100), 
    sex: 'male'
  }, ['Person'], (err, node) => {
    if (err) return next(err);
    res.json(node);
  });
});

app.get('/persons', (req, res, next) => {
  db.cypherQuery('MATCH (person:Person) RETURN person', (err, result) => {
    if (err) return next(err);
    res.json(result.data);
  });
});

app.listen(8080, () => {
  console.log('hello world from node');
});