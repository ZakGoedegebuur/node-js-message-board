const http = require('http');
const fs = require('fs');

const hostName = '$$yourip$$';
const port = 80;

const html = fs.readFileSync("src/app/index.html", 'utf-8');

const server = http.createServer((request, response) => {
  
  const ip = request.socket.remoteAddress;
  const timeOfRequest = Date();

  if (request.url === "/") {
    console.log(`recieved request from ${ip.substring(7)} on ${timeOfRequest}`);
  }

  if (request.url === "/") { // Handles inital index.js connection
    response.statusCode = 200;
    response.setHeader('Content-Type', `text/html`);
    response.write(html);
    response.end();
  } else if (request.url.substring(request.url.lastIndexOf('.')+1, request.url.length) === "svg") {
    response.statusCode = 200;
    const fpath = `src${request.url}`;

    if (!fs.existsSync(fpath)) {
      response.end();
    } else {
      const file = fs.readFileSync(fpath);
  
      response.setHeader('Content-Type', `image/svg+xml`);
      response.write(file);
      response.end();
    }
  } else {
    response.statusCode = 200;
    const ext = request.url.substring(request.url.lastIndexOf('.')+1, request.url.length);
    const fpath = `src/app${request.url}`;
    if (!fs.existsSync(fpath)) {
      response.end();
    } else {
      const file = fs.readFileSync(fpath);
  
      response.setHeader('Content-Type', `text/${ext}`);
      response.write(file);
      response.end();
    }
  }
});

server.listen(port, () => {
  console.log(`server running at http://${hostName}:${port}/`);
});

server.on('close', () => {
  console.log(`server at http://${hostName}:${port}/ closed`);
})

const ws = require('ws');
const wsServer = new ws.WebSocketServer({port: '8051'});

let messages = require('../data/messages.json');

wsServer.on('connection', (socket, req) => {
  socket.send(JSON.stringify(messages));

  socket.on('message', (data) => {
    let msgobj = JSON.parse(data);
    const radr = req.socket.remoteAddress.substring(7);
    msgobj.ip = radr;
    messages.push(msgobj);

    wsServer.clients.forEach((client) => {
      client.send(JSON.stringify(messages));
    })

    const prettyJsonString = JSON.stringify(messages, null, 2);
    fs.writeFileSync("src/data/messages.json", prettyJsonString);
  });
});