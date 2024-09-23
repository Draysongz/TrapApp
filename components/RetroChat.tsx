import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: Date;
}

const RetroChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const username = 'User'; // Change this to a constant if it's not going to change
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate receiving a message every 5 seconds
    const interval = setInterval(() => {
      const newMessage: Message = {
        id: Date.now(),
        user: 'System',
        text: 'Welcome to the underground chat!',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat box when new messages arrive
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        user: username,
        text: inputMessage,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <div className="border border-green-400 p-2 h-64 flex flex-col">
      <div className="mb-2 text-sm">Connected as: {username}</div>
      <div ref={chatBoxRef} className="flex-grow overflow-y-auto mb-2 text-sm">
        {messages.map(message => (
          <div key={message.id} className="mb-1">
            <span className="text-green-600">[{message.timestamp.toLocaleTimeString()}] </span>
            <span className="font-bold">{message.user}: </span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow bg-black border border-green-400 text-green-400 px-2 py-1 mr-2"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-green-400 text-black px-2 py-1">Send</button>
      </form>
    </div>
  );
};

export default RetroChat;