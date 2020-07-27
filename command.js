const { spawn } = require('child_process');
const { ConsoleTransportOptions } = require('winston/lib/winston/transports');
const Mustache = require('mustache')

function execute(obj){
    return new Promise((resolve,reject)=>{
      try {
        const param = Object.assign({},obj.command.defaults,obj.command_params)
        const command = obj.command.command.split(" ").map(i=>Mustache.render(i, param))
        commandMain = command.shift()
        commandParams = command;

        let t = setTimeout(()=>{
          resolve({code:2, text:"Command timeout"} )
        }, obj.command.timeout*1000);
        let cmd = spawn(commandMain, commandParams, { shell: true });
        let text = ""
  
        cmd.stdout.on('data', (data) => {
          text += data.toString()
        });
  
        cmd.stderr.on('data', (data) => {
          text += data.toString()
        });
  
        cmd.on('close', (code) => {
          clearTimeout(t);
          if (Number.isInteger(code) && (code>=0 && code<=3)) {
            resolve({code:code, text:text.replace(/[\n\r]+/g, ' ')} )
          } else {
            resolve({code:3, text:text.replace(/[\n\r]+/g, ' ')} )
          }
        });
      }
      catch(err) {
        reject(err)
      }
    })

  }

module.exports = {execute}