
const db = require('./db')
const param = require('./parseParam')();

let eventMap = require('./eventMap.json')


async function handle(check,commResponse) {
  // Agrego margen de 2 veces el timeout del comando
  let nextInvocationDate = new Date(check.schedule.nextInvocation().toDate().toUTCString())/1000 + param.scheduler.nextInvocationCommandTimeoutFactor*check.command.timeout;
  await updateCheckStatus(check.id,commResponse.code,commResponse.text,nextInvocationDate)
}


async function updateCheckStatus(checkId,status,text,nextTimestamp) {
  const query = `update checks 
    SET(last_check_status,last_check_text,next_check_schedule) = ($1,$2,to_timestamp($3))
    where id=$4`;
  return db.query(query, [status,text,nextTimestamp,checkId])
;
}

module.exports = {handle}