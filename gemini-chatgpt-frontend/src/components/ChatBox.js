// 

import React, { useState, useEffect, useRef } from 'react';
import {
    FaRobot,
    FaUser,
    FaPaperPlane,
    FaSun,
    FaMoon,
    FaCopy,
    FaSignOutAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import sendMessageToBackend from '../services/chatService';
import WelcomeModal from './WelcomeModal';
import '../styles.css'; // Import global styles
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const ChatBox = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
    const chatWindowRef = useRef(null);
    const navigate = useNavigate();

    // Load messages and theme preference from localStorage on mount
    useEffect(() => {
        const storedMessages = localStorage.getItem('chatMessages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }

        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setDarkMode(storedTheme === 'dark');
            if (storedTheme === 'dark') {
                document.body.classList.add('dark-mode');
            }
        }

        // Open the Welcome Modal on first load if not seen before
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setIsWelcomeOpen(true);
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    // Save theme preference to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    // Toggle dark mode by adding/removing the 'dark-mode' class on the body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    // Auto-scroll to the bottom when messages update
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTo({
                top: chatWindowRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    // Handle sending the message to the backend
    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = {
            sender: 'user',
            text: message.trim(),
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        const aiPlaceholder = {
            sender: 'ai',
            text: '',
            timestamp: new Date(),
            isLoading: true,
        };
        setMessages((prev) => [...prev, aiPlaceholder]);

        try {
            const result = await sendMessageToBackend(message.trim());
            const aiMessage = {
                sender: 'ai',
                text: result.response,
                timestamp: new Date(),
                isLoading: false,
            };
            setMessages((prev) =>
                prev.map((msg) => (msg.isLoading ? aiMessage : msg))
            );
        } catch (error) {
            let errorMsg = 'Sorry, something went wrong.';
            if (error.response) {
                errorMsg = `Error: ${error.response.data.error || 'Server error.'}`;
            } else if (error.request) {
                errorMsg = 'Error: No response from the server.';
            } else {
                errorMsg = `Error: ${error.message}`;
            }
            toast.error(errorMsg);
            const errorMessage = {
                sender: 'ai',
                text: errorMsg,
                timestamp: new Date(),
                isLoading: false,
            };
            setMessages((prev) =>
                prev.map((msg) => (msg.isLoading ? errorMessage : msg))
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key press to send the message
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    // Logout function to clear local storage and redirect to login
    const handleLogout = () => {
        localStorage.clear(); // Clear all data in local storage
        navigate('/'); // Redirect to login page
    };

    // Function to copy code to clipboard
    const copyToClipboard = (code) => {
        navigator.clipboard
            .writeText(code)
            .then(() => {
                toast.success('Code copied to clipboard!');
            })
            .catch(() => {
                toast.error('Failed to copy code.');
            });
    };

    // Function to close the Welcome Modal
    const closeWelcomeModal = () => {
        setIsWelcomeOpen(false);
        localStorage.setItem('hasSeenWelcome', 'true');
    };

    return (
        <div className="chat-container">
            <div className="header">
                <h1>ChatGPT</h1>
                <div className="header-buttons">
                    <button
                        className="theme-toggle"
                        onClick={toggleDarkMode}
                        aria-label="Toggle Dark Mode"
                    >
                        {darkMode ? <FaSun /> : <FaMoon />}
                    </button>
                    <button
                        className="logout-button"
                        onClick={handleLogout}
                        aria-label="Logout"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>
            <WelcomeModal isOpen={isWelcomeOpen} onRequestClose={closeWelcomeModal} />
            <div className="chat-window" ref={chatWindowRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div className="avatar">
                            {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
                        </div>
                        <div className="content">
                            {msg.sender === 'ai' && msg.isLoading ? (
                                <ClipLoader size={20} color="#3b82f6" />
                            ) : (
                                <ReactMarkdown
                                    children={msg.text}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const codeContent = String(children).replace(/\n$/, '');
                                            return !inline && match ? (
                                                <div style={{ position: 'relative' }}>
                                                    <SyntaxHighlighter
                                                        style={tomorrow}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {codeContent}
                                                    </SyntaxHighlighter>
                                                    <button
                                                        onClick={() => copyToClipboard(codeContent)}
                                                        className="copy-button"
                                                        aria-label="Copy Code"
                                                    >
                                                        <FaCopy />
                                                    </button>
                                                </div>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                />
                            )}
                            <span className="timestamp">
                                {msg.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="input-area">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    disabled={loading}
                ></textarea>
                <button
                    onClick={handleSendMessage}
                    disabled={loading || !message.trim()}
                    aria-label="Send Message"
                >
                    <FaPaperPlane />
                </button>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default ChatBox;
