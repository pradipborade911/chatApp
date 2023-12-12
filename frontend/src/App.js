import React, { useState, useRef, useEffect } from 'react';
import './App.css'

const ChatApp = () => {
  const [messages, setMessages] = useState([{}]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, SetConnected] = useState(false);
  const [connection, Setconnection] = useState({});
  const [status, setStatus] = useState('');
  const messagesContainerRef = useRef(null);
  console.log(isConnected)
  let socket = null;
  if (!isConnected) {
    socket = new WebSocket('ws://192.168.60.30:3001');  // Update with your server URL
    SetConnected(true);
    Setconnection(socket);
  } else {
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

  const getCurrentTime = () => {
    const currentDate = new Date();

    // Extract hours, minutes, and seconds
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Format the time
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return formattedTime;
  }

  useEffect(() => {
    // WebSocket event handling
    socket.onmessage = (event) => {
      const receivedMessage = event.data;
      console.log(receivedMessage.slice(0, 10))
      if(receivedMessage.slice(0, 10)==="!@#$%^&*()"){
        setStatus("You are connected to " +  receivedMessage.slice(11, receivedMessage.length))
      }else if(receivedMessage.slice(0, 10)===")(*&^%$#@!"){
        setStatus((prev)=>'Disconnected...Reconnecting');
        setMessages(()=>[{}]);
      }else if(receivedMessage.slice(0, 14)==="~!@#$%^&*(()_+"){
        setStatus('Searching for connections.....')
      }else{
        setMessages([...messages, { text: receivedMessage, type: 'received', time: getCurrentTime() }]);
      }
    };
  }, [socket.onmessage]);  // Empty dependency array to run the effect only once

  useEffect(() => {
    // Scroll to the bottom when messages are updated
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);


  const sendMessage = () => {
    if (inputMessage !== '' && socket && socket.readyState === WebSocket.OPEN) {
      console.log("sending");
      socket.send(inputMessage);
      setMessages([...messages, { text: inputMessage, type: 'sent', time: getCurrentTime() }]);
      setInputMessage('');
    } else {
      console.error('WebSocket connection not open. Unable to send message.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#ddd', position: 'sticky', top: 0 }}>
          {status}
      </div>

      <div ref={messagesContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {messages.map((message, index) => (
          <div className={`${message.type}-msg`}>
            <div className={`${message.type}`} key={index}>
              <span className='time'>{message.time}</span>
              <div>{message.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#ddd', position: 'sticky', bottom: 0 }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          style={{ flex: 1, padding: '8px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          placeholder="Type your message..."
          onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} style={{ padding: '8px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Send</button>
      </div>
    </div>

  );
};

export default ChatApp;
