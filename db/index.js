const param = require('../parseParam')();

const { Pool } = require('pg');
const createSubscriber = require("pg-listen");

const pool = new Pool( param.postgres);

const subscriber = createSubscriber( param.postgres );

async function subscribeChannel(channel) {
  await subscriber.connect()
  await subscriber.listenTo(channel)
  return subscriber
}


process.on("exit", () => {
  pool.end();
  subscriber.close();
  })


module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
  subscribeChannel: subscribeChannel
}