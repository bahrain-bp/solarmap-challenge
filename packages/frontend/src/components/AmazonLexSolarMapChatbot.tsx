import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chatbot.css'; // Ensure this path matches your CSS file location

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


type Message = {
    text: string;
    sender: 'user' | 'bot';
};


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');

    const toggleChatBox = () => {
        setIsOpen(!isOpen);
    };

    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value);

    const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!inputValue.trim()) return;
    
        // Send the user's message to the chat log
        const userMessage: Message = { text: inputValue, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);
    
        // Clear input field
        setInputValue('');
    
        try {
            // Call the /communicate API endpoint to process the user's message
            const response = await fetch(import.meta.env.VITE_API_URL+'/communicate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: userMessage.text })
            });
    
            if (!response.ok) throw new Error('Failed to fetch');
    
            const data = await response.json();
    
            // Add bot's response to the chat log
            const botResponse: Message = { text: data.message, sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, botResponse]);
        } catch (error) {
            console.error('Error fetching bot response:', error);
            // Handle error case in chat interface
            const errorResponse: Message = { text: 'Sorry, there was an error processing your request.', sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, errorResponse]);
        }
    };


    return (
        <div id="body">
            {!isOpen && (
                <div id="chat-circle" className="btn btn-raised" onClick={toggleChatBox}>
                    <i className="material-icons" style={{ marginTop: "3px" }}>chat</i>
                </div>
            )}

            {isOpen && (
                <div className="chat-box">
                    <div className="chat-box-header">
                        <span className="chat-title">SolarMap Assistant</span>
                        <span className="chat-subtitle">Your Solar Guide</span>

                        <span className="chat-box-toggle" onClick={toggleChatBox}><i className="material-icons" style={{ marginTop: "15px", fontSize: "30px" }}>close</i></span>
                    </div>
                    <div className="chat-box-body">
                        <div className="chat-logs">
                            {messages.map((msg, index) => (
                                <div key={index} className={`chat-msg ${msg.sender}`}>
                                    <div className="cm-msg-text">{msg.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chat-input">
                        <form onSubmit={handleSendMessage}>
                            <input type="text" id="chat-input" placeholder="Send a message..." value={inputValue} onChange={handleMessageChange} />
                            <button type="submit" className="chat-submit" id="chat-submit"> <FontAwesomeIcon icon={faPaperPlane} /></button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
