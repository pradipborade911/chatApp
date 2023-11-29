const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let count = 0;

const availableClients = new Set();

const pair = (connection) => {
  console.log(availableClients.size)
  const clients = availableClients.values();
  const pairedClient = clients.next().value;

  availableClients.delete(pairedClient);

  pairedClient.isPaired = true;
  connection.isPaired = true;

  connection.send('!@#$%^&*()' + connection.clientId);
  pairedClient.send('!@#$%^&*()' + pairedClient.clientId);

  return pairedClient;
}

wss.on('connection', (incomingConnection) => {
  let client = incomingConnection;
  client.clientId = ++count;
  client.isPaired = false;

  if (availableClients.size >= 1) {
    let anotherClient = pair(client);

    client.on('message', (message) => {
      anotherClient.send(message.toString('utf-8'));
    });

    anotherClient.on('message', (message) => {
      client.send(message.toString('utf-8'));
    });

    anotherClient.onclose = (event) => {
      let temp = anotherClient;
      if (anotherClient.isPaired) {
        client.send(")(*&^%$#@!");

        if (availableClients.size >= 1) {
          anotherClient = pair(client);
        } else {
          client.isPaired = false;
          availableClients.add(client);
        }
      }
      availableClients.delete(temp);
    }

    client.onclose = (event) => {
      let temp = client;
      if (client.isPaired) {
        anotherClient.send(")(*&^%$#@!");

        if (availableClients.size >= 1) {
          client = pair(anotherClient);
        } else {
          anotherClient.isPaired = false;
          availableClients.add(anotherClient);
        }
      }
      availableClients.delete(temp);
    }

  } else {
    availableClients.add(client);
    client.send('~!@#$%^&*(()_+');
  }

  client.on('close', () => {
    availableClients.delete(client);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
