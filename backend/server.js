const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// List to store available clients
const availableClients = [];

wss.on('connection', (ws) => {
  // Check if the client is already in the list
  if (availableClients.includes(ws)) {
    console.log('Existing client reconnected');
    return;
  }

  console.log('New client connected');

  if (availableClients.length >= 1) {
    console.log('Entry', availableClients.length);
    const index = Math.floor(Math.random() * availableClients.length);
    const pairedClient = availableClients[index];

    // Remove client from the available list
    availableClients.splice(index, 1);

    // Notify clients that they are paired
    ws.send('newbie!!! You are now connected!');
    pairedClient.send('Waiter!!! You are now connected !');
    console.log("exit",availableClients.length);

    // WebSocket event handling for paired clients
    ws.on('message', (message) => {
      console.log("newbie sending msg")
      pairedClient.send(message.toString('utf-8'));
    });

    pairedClient.on('message', (message) => {
      console.log("waiter sending msg")
      ws.send(message.toString('utf-8'));
    });
    } else {
    availableClients.push(ws);
    ws.send('Waiting for a partner...');
  }

  ws.on('close', () => {
    // Remove the client from the available list if they disconnect
    const index = availableClients.indexOf(ws);
    if (index !== -1) {
      availableClients.splice(index, 1);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
