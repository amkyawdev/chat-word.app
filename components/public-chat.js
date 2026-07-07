/**
 * Public Chat Component
 * Real-time public chat functionality
 */

class PublicChat {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.messages = [];
        this.currentUser = 'You';
        this.maxMessages = 100;
        this.init();
    }
    
    init() {
        this.loadSampleMessages();
        this.render();
        this.setupEventListeners();
    }
    
    loadSampleMessages() {
        this.messages = [
            {
                id: 1,
                user: 'System',
                avatar: '🤖',
                text: 'Welcome to the global chat room! 🎉',
                timestamp: new Date(Date.now() - 300000),
                type: 'system'
            },
            {
                id: 2,
                user: 'Alice',
                avatar: '👩',
                text: 'Hello everyone! How are you all doing today?',
                timestamp: new Date(Date.now() - 240000),
                type: 'received'
            },
            {
                id: 3,
                user: 'Bob',
                avatar: '👨',
                text: 'Hey Alice! Doing great, thanks for asking! 😊',
                timestamp: new Date(Date.now() - 180000),
                type: 'received'
            },
            {
                id: 4,
                user: 'Charlie',
                avatar: '🧑',
                text: 'This chat app looks amazing! Love the sky blue theme 🩵',
                timestamp: new Date(Date.now() - 120000),
                type: 'received'
            },
            {
                id: 5,
                user: 'Diana',
                avatar: '👸',
                text: 'Agreed! The design is really clean and modern.',
                timestamp: new Date(Date.now() - 60000),
                type: 'received'
            }
        ];
    }
    
    render() {
        if (!this.container) return;
        
        let html = '';
        
        this.messages.forEach(msg => {
            html += this.renderMessage(msg);
        });
        
        this.container.innerHTML = html;
        this.scrollToBottom();
    }
    
    renderMessage(msg) {
        const time = this.formatTime(msg.timestamp);
        const bubbleClass = msg.type === 'sent' ? 'sent' : (msg.type === 'system' ? 'system' : 'received');
        
        if (msg.type === 'system') {
            return `
                <div class="chat-message system ${bubbleClass}">
                    <div class="message-content">
                        <span class="message-icon">${msg.avatar}</span>
                        <span class="message-text">${msg.text}</span>
                    </div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        }
        
        return `
            <div class="chat-message ${bubbleClass}">
                <div class="message-avatar">${msg.avatar}</div>
                <div class="message-bubble">
                    <div class="message-header">
                        <span class="message-user">${msg.user}</span>
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-text">${msg.text}</div>
                </div>
            </div>
        `;
    }
    
    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    setupEventListeners() {
        const input = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }
    
    sendMessage() {
        const input = document.getElementById('message-input');
        if (!input) return;
        
        const text = input.value.trim();
        if (!text) return;
        
        const message = {
            id: this.messages.length + 1,
            user: this.currentUser,
            avatar: '👤',
            text: text,
            timestamp: new Date(),
            type: 'sent'
        };
        
        this.addMessage(message);
        input.value = '';
        
        // Simulate response after a delay
        setTimeout(() => {
            this.simulateResponse();
        }, 1000 + Math.random() * 2000);
    }
    
    addMessage(message) {
        this.messages.push(message);
        
        // Remove old messages if exceeding max
        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
        }
        
        this.render();
    }
    
    simulateResponse() {
        const responses = [
            { user: 'Alice', avatar: '👩', text: 'That\'s interesting! Tell me more 🤔' },
            { user: 'Bob', avatar: '👨', text: 'Great point! I totally agree 👍' },
            { user: 'Charlie', avatar: '🧑', text: 'Haha, this is hilarious! 😂' },
            { user: 'Diana', avatar: '👸', text: 'Thanks for sharing! Really helpful 💡' },
            { user: 'Eve', avatar: '👩‍🦰', text: 'Welcome to the chat! 🎉' },
            { user: 'Frank', avatar: '👨‍🦱', text: 'Nice to meet you all! 👋' },
            { user: 'Grace', avatar: '👩‍🦳', text: 'This is so cool! 🩵' },
            { user: 'Henry', avatar: '🧔', text: 'Can\'t wait to chat more!' }
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const message = {
            id: this.messages.length + 1,
            user: randomResponse.user,
            avatar: randomResponse.avatar,
            text: randomResponse.text,
            timestamp: new Date(),
            type: 'received'
        };
        
        this.addMessage(message);
    }
    
    scrollToBottom() {
        if (this.container) {
            this.container.scrollTop = this.container.scrollHeight;
        }
    }
    
    clearChat() {
        this.messages = [];
        this.render();
    }
    
    getMessageCount() {
        return this.messages.length;
    }
}

// Initialize public chat
function initPublicChat() {
    return new PublicChat('chat-messages');
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PublicChat, initPublicChat };
}
