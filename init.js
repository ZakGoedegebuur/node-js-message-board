const fs = require('fs');
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let messagesjs = fs.readFileSync("./src/app/scripts/messages.js").toString();
let serverjs = fs.readFileSync("./src/server/server.js").toString();

rl.question("what ip will the server to run on?: ", (ip) => {
  messagesjs = messagesjs.replace("$$yourip$$", ip);
  serverjs = serverjs.replace("$$yourip$$", ip);
  
  fs.writeFileSync("src/app/scripts/messages.js", messagesjs);
  fs.writeFileSync("src/server/server.js", serverjs);
  
  try {
    fs.writeFileSync('src/data/messages.json', "[]");
  } catch (err) {
    if (!err) {
      console.log("database was initialised successfully");
    } else {
      console.error(err);
      console.error("failed to initialise database");
    }
  }

  console.log("\nBefore running 'node .' in this folder, in messages.js in the script directory make sure the websocket is set up to connect to the server you will be running this on. If you are running this at home, this may require setting up port forwarding on your router on ports 80 and 8051.");
  process.exit(0);
})