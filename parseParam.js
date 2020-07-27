const param = require('./param.json');

function traverse(obj,prefix) {
    for (let p in obj) {
      if ((obj.hasOwnProperty(p)) && (typeof obj[p] === "object")) {
        prefix += p + '_'
        traverse(obj[p],prefix)
        prefix = ""
    } else {
        const v = (prefix+p).toUpperCase()
        obj[p] = obj[p] || process.env[v]
      }
    }
}

function read() {
    const tmpObj = {...param}
    traverse(tmpObj,"")
    return tmpObj
}


module.exports = read;

