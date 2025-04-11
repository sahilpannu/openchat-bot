import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "google/gemini-2.5-pro-exp-03-25:free",
          messages: [
            {
              role: "user",
              content: input,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://orbyt.netlify.app/",
            "X-Title": "Orbyt",
          },
        }
      );

      const botReply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (err) {
      console.error("Error getting response:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "No response." },
      ]);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <span className="logo">Orbyt</span>
      </header>

      <main className="main">
        <h1 className="center-title">What can I help with?</h1>

        <div className="chat-box">
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
                {msg.content}
              </div>
            ))}
          </div>

          <div className="input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
