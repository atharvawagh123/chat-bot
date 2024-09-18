import React, { useState, useEffect, useRef } from 'react';
import './Component.css';
import { VscAccount } from "react-icons/vsc";
import { IoIosSend } from "react-icons/io";

// Helper function to format time
const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export default function Component() {
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New state for loading
    const chatEndRef = useRef(null);

    // Scroll to the bottom when a new message is added
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Handle input submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userMessage.trim() === '' || isLoading) return; // Prevent submit if loading

        const currentTime = new Date();

        // Add user message with time
        const newMessages = [...messages, { type: 'user', text: userMessage, time: formatTime(currentTime) }];
        setMessages(newMessages);

        // Clear the input
        setUserMessage('');

        // Set loading state
        setIsLoading(true);

        // Call AI API
        const aiResponse = await fetchAiResponse(userMessage);

        // Add AI response with time
        const aiResponseTime = new Date();
        setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'ai', text: aiResponse, time: formatTime(aiResponseTime) }
        ]);

        // Stop loading
        setIsLoading(false);
    };

    // Fetch AI response from local server
    const fetchAiResponse = async (message) => {
        try {
            const response = await fetch('http://localhost:8000/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: message }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data.text || "AI couldn't generate a response.";
        } catch (error) {
            console.error('Error fetching AI response:', error);
            return "Sorry, there was an error.";
        }
    };

    return (
        <div className="app-container">
            <div className="sidebar">
                <button className="new-chat-button">
                    <span className="icon">+</span> New Chat
                </button>
                <div className="recent-chats">
                    {messages
                        .filter((msg) => msg.type === 'user')
                        .map((msg, index) => (
                            <div key={index} className="recent-chat-item">
                                {/* Show the chat number and the user's message */}
                                {index + 1}. {msg.text.length > 20 ? msg.text.substring(0, 20) + '...' : msg.text}
                            </div>
                        ))
                    }
                </div>
                <div className="user-info">
                  
                        <div className="avatar">
                            <VscAccount className="message-icon" />
                        </div>
                        <div className="user-details">
                            <span>Welcome back,</span>
                            <span className="user-name">Suvigya</span>
                        </div>
                  
                </div>
            </div>

            <div className="chat-area">
                <div className="chat-scroll-area">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-row ${msg.type}-message`}>
                            <div className="message-bubble">
                                <div className="message-header">
                                    <VscAccount className="message-icon" />
                                    <span className="message-sender">{msg.type === 'user' ? 'User' : 'AI'}</span>
                                    <span className="message-time">{msg.time}</span>
                                </div>
                                <div className="message-text">
                                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Loading indicator while waiting for AI response */}
                    {isLoading && (
                        <div className="message-row ai-message">
                            <div className="message-bubble loading-message">
                                <div className="message-text">AI is typing...</div>
                            </div>
                        </div>
                    )}
                    {/* Invisible div to ensure the scroll stays at the bottom */}
                    <div ref={chatEndRef}></div>
                </div>

                <form className="message-input-area" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <input
                            className="message-input"
                            placeholder="Type a new message here"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            disabled={isLoading} // Disable input when loading
                        />
                        <button type="submit" className="icon-button" disabled={isLoading}>
                            <IoIosSend />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
