import Database from '../src/database/index.js';

export default async () => {
  await Database.connection.close();
};