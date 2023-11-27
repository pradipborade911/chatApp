import React, { useState, useEffect } from 'react';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, SetConnected] = useState(false);
  const [connection, Setconnection] = useState({});
console.log(isConnected)
  let socket = null;
  if(!isConnected){
    socket = new WebSocket('ws://localhost:3001');  // Update with your server URL
    SetConnected(true);
    Setconnection(socket);
  }else{
    socket = connection;
  }

  useEffect(() => {

    socket.onopen = () => {
      console.log('Connected to the server');
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []); // Run once when the component mounts

  useEffect(() => {
    // WebSocket event handling
    socket.onmessage = (event) => {
      const receivedMessage = event.data;
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };
  }, [socket.onmessage]);  // Empty dependency array to run the effect only once

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("sending");
      socket.send(inputMessage);
      setInputMessage('');
    } else {
      console.error('WebSocket connection not open. Unable to send message.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatApp;
