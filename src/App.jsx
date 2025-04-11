// App.jsx
import React, { useState } from 'react';
import './App.css';

const API_KEY = "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"; // Replace this

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://orbyt.netlify.app" // Change to your domain when live
      },
      body: JSON.stringify({
        model: "openchat/openchat-3.5",
        messages: newMessages
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";
    setMessages([...newMessages, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  return (
    <div className="App">
      <h2>OpenChat 3.5 Bot 🤖</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="msg bot"><em>Bot is typing...</em></div>}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
