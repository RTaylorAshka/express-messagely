/** Database connection for messagely. */


const { Client } = require("pg");
const { DB } = require("./config");

const client = new Client(DB);

client.connect();


module.exports = client;
