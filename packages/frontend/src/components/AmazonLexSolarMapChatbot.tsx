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

    const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!inputValue.trim()) return;
        const userMessage: Message = { text: inputValue, sender: 'user' }; // Explicitly typed as 'Message'
        setMessages([...messages, userMessage]);
        setInputValue('');

        // Set a delay for the bot's response
        setTimeout(() => {
            const botResponse: Message = { text: 'Processing...', sender: 'bot' }; // Explicitly typed as 'Message'
            setMessages(prevMessages => [...prevMessages, botResponse]);
        }, 1000);  // Delay of 1000 milliseconds (1 second)
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
