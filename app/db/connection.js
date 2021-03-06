import { v1 as neo4j } from 'neo4j-driver';
import config from '../config.js';

// export default driver.session();
export const getSession = () => {
  const driver = neo4j.driver(
    config.get('DB_URI'),
    neo4j.auth.basic(
      config.get('DB_AUTHB_USERNAME'),
      config.get('DB_AUTHB_PASSWORD')
    )
  );
  return driver.session();
};
