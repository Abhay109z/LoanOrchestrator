import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../App.css'

function Chat() {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi! Type "Hello" to start.' }])
  const [input, setInput] = useState('')
  const [userId] = useState('user_' + Math.floor(Math.random() * 1000))

  const sendMessage = async () => {
    if (!input) return;
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('message', input);

    try {
      const res = await axios.post('http://127.0.0.1:8000/chat', formData);
      setMessages([...newMessages, { sender: 'bot', text: res.data.response }]);
      setInput('');
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessages([...messages, { sender: 'user', text: `Uploading ${file.name}...` }]);

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('file', file);

    try {
      const res = await axios.post('http://127.0.0.1:8000/upload', formData);
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.response }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chat-page-wrapper">
      <Link to="/" className="back-button">← Back</Link>
      
      <div className="chat-container">
        <div className="chat-header">
          <span style={{fontSize: '1.5rem'}}>🤖</span> 
          <div>
            <div style={{fontSize: '1rem'}}>Intelligent Orchestrator</div>
            <div style={{fontSize: '0.7rem', color: '#4ade80', fontWeight: '400'}}>● Online & Secure</div>
          </div>
        </div>
        
        <div className="messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text.includes("http") ? (
                 <span>
                    {msg.text.split("http")[0]} 
                    <br/>
                    <div style={{marginTop: '10px', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px'}}>
                        <span style={{fontSize: '1.5rem'}}>📄</span>
                        <a href={`http${msg.text.split("http")[1]}`} target="_blank" rel="noreferrer" style={{color: '#fff', fontWeight: 'bold', marginLeft: '10px', textDecoration: 'none'}}>
                           Download Sanction Letter
                        </a>
                    </div>
                 </span>
              ) : msg.text}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..." 
          />
          <button onClick={sendMessage}>➤</button>
        </div>
        
        <label className="file-upload-label">
          📎 Attach Documents (Salary Slip)
          <input type="file" onChange={uploadFile} style={{display: 'none'}} />
        </label>
      </div>
    </div>
  )
}

export default Chat;