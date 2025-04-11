// App.jsx
import React, { useState } from 'react';
import './App.css';

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

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openchat/openchat-3.5",
          messages: newMessages
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "No response.";
      setMessages([...newMessages, { role: 'assistant', content: reply }]);

    } catch (err) {
      console.error("Error:", err);
      setMessages([...newMessages, { role: 'assistant', content: `Error: ${err.message}` }]);
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h2>Orbyt</h2>
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
