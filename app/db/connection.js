import { v1 as neo4j } from 'neo4j-driver';
import config from '../config.js';

const driver = neo4j.driver(
  config.get('DB_URI'),
  neo4j.auth.basic(
    config.get('DB_AUTHB_USERNAME'),
    config.get('DB_AUTHB_PASSWORD')
  )
);

export default driver.session();
