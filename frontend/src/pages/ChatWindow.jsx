import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FiSend, FiPhone, FiMoreVertical, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './ChatWindow.css';

const ChatWindow = () => {
    const { chatId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (chatId) {
            fetchChat();
            fetchMessages();
        }
    }, [chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChat = async () => {
        try {
            const response = await api.get(`/chats/${chatId}`);
            if (response.data.success) {
                setChat(response.data.chat);
            }
        } catch (error) {
            console.error('Error fetching chat:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/chats/${chatId}/messages`);
            if (response.data.success) {
                setMessages(response.data.messages || []);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await api.post(`/chats/${chatId}/messages`, {
                content: newMessage,
                type: 'text',
            });

            if (response.data.success) {
                setMessages([...messages, response.data.message]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getOtherUser = () => {
        if (!chat) return null;
        return chat.participants.find(p => p._id !== user._id);
    };

    const otherUser = getOtherUser();

    if (loading) {
        return <div className="chat-loading">Loading chat...</div>;
    }

    return (
        <div className="chat-window">
            {/* Chat Header */}
            <div className="chat-header">
                <div className="chat-header-left">
                    <button className="back-btn" onClick={() => window.history.back()}>
                        <FiArrowLeft />
                    </button>
                    <div className="chat-user-info">
                        <div className="chat-avatar">
                            {otherUser?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="chat-user-details">
                            <h3>{otherUser?.name || 'User'}</h3>
                            <span className="online-status">Online</span>
                        </div>
                    </div>
                </div>
                <div className="chat-header-actions">
                    <a href={`tel:${otherUser?.phone}`} className="icon-btn">
                        <FiPhone />
                    </a>
                    <button className="icon-btn">
                        <FiMoreVertical />
                    </button>
                </div>
            </div>

            {/* Product/Service Reference */}
            {chat?.producePost && (
                <div className="chat-reference">
                    <img src={chat.producePost.images?.[0]} alt={chat.producePost.productName} />
                    <div className="reference-info">
                        <h4>{chat.producePost.productName}</h4>
                        <p>₹{chat.producePost.price?.value} {chat.producePost.price?.unit}</p>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message._id}
                            className={`message ${message.sender._id === user._id ? 'sent' : 'received'}`}
                        >
                            <div className="message-bubble">
                                <p>{message.content}</p>
                                <span className="message-time">
                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form className="chat-input" onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                    <FiSend />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
