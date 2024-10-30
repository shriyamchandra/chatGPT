// gemini-chatgpt-frontend/src/components/WelcomeModal.js

import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { FaRobot, FaTimes } from 'react-icons/fa';
import './WelcomeModal.css'; // Import component-specific styles

// Set the app element for accessibility
Modal.setAppElement('#root');

const WelcomeModal = ({ isOpen, onRequestClose }) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Welcome Modal"
            className="welcome-modal"
            overlayClassName="welcome-overlay"
            shouldCloseOnOverlayClick={true}
        >
            <div className="modal-header">
                <FaRobot className="modal-icon" />
                <button
                    className="close-button"
                    onClick={onRequestClose}
                    aria-label="Close Welcome Modal"
                    title="Close"
                >
                    <FaTimes />
                </button>
            </div>
            <h2>Welcome to Gemini ChatGPT!</h2>
            <p>
                I'm here to assist you with any questions or tasks you have. Simply type your message below and I'll respond promptly.
            </p>
            <p>
                You can ask me about programming, general knowledge, or even request code snippets.
            </p>
            <p>
                <strong>Tips:</strong>
                <ul>
                    <li>Press <code>Enter</code> or click the send button to submit your message.</li>
                    <li>Include code blocks using triple backticks <code>```</code> for better formatting.</li>
                    <li>Toggle between dark and light modes using the button in the header.</li>
                </ul>
            </p>
        </Modal>
    );
};

export default WelcomeModal;
