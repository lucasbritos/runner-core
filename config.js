let logger = require('./log');
//const param = require('./parseParam')();
//const fs = require('fs');
const db = require('./db')
//const Mustache = require('mustache')

async function getConfig()
{

  // Read checks
  
  const checksQuery = `select *,  (select row_to_json(c) from commands c where command_id = c.id) as command from checks where active=true;`
  const checksRes = await db.query(checksQuery)
  const checks = checksRes.rows

  // Read subscribers
  const subsQuery = `select *,  (select row_to_json(c) from commands c where command_id = c.id) as command from subscribers where active=true;`
  const subsRes = await db.query(subsQuery);
  const subscribers = subsRes.rows;



  return {checks,subscribers}

}




module.exports = {getConfig}