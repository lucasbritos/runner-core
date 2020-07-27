
(async () => {



const schedule = require('node-schedule');
const logger = require('./log');
const config = require('./config');
const command = require('./command')
const handleStatus = require('./handleStatus')
logger.info("Started")
const db = require('./db')

const items = await config.getConfig()
logger.debug("getChecks:",items.checks)
logger.debug("getSubscribers:",items.subscribers);

// SCHEDULER
for (const c of items.checks){
    c.schedule = schedule.scheduleJob(c.cron, async function(){
      try{
        let resCommand = await command.execute(c)
        logger.debug("command-check",resCommand);
        await handleStatus.handle(c,resCommand)
        }
      catch(err) { logger.error(err.message) }
      });
}
// SUBSCRIPTION

let listenDB = await db.subscribeChannel("check_status_changed")

//console.log(items.subscribers)

listenDB.notifications.on("check_status_changed", (payload) => {
  // Payload as passed to subscriber.notify() (see below)
  logger.debug("push:",payload);
  console.log(payload);
  items.subscribers.filter((s)=>matchCriteria(s,payload)).forEach( async (element) => {
    try{
      //copio el objeto subscriber
      let tempSub = Object.assign({},element)
      tempSub.command_params = Object.assign({},tempSub.command_params,{metadata:JSON.stringify(payload)})
      let resCommand = await command.execute(tempSub)
      logger.debug("command-subscription",resCommand);
      }
    catch(err) { logger.error(err.message) }
  });
});

function matchCriteria(s,p){
  // s subscriber
  // p payload
return !(s.dependency_check==true && p.is_dependency_ok==false) && s.event_type.includes(p.type) && s.status_to.includes(p.status_to) && containTags(s.tags,p.check_tags)
// !(s.dependency_check==true && p.is_dependency_ok==false) && 
}


function containTags(tags,groupTags){
  for (const i in tags) {
      if (tags[i] != groupTags[i]) { return false}
    }
    return true;
}

})()