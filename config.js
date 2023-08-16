/** Common config for message.ly */

// read .env files and make environmental variables

require("dotenv").config();

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB = (process.env.NODE_ENV === "test")
  ? { database: 'messagely_test', user: 'postgres', password: DB_PASSWORD }
  : { database: 'messagely_test', user: 'postgres', password: DB_PASSWORD };

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = 12;


module.exports = {
  DB,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
};