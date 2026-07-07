/**
 * Friends List Component
 * Display and manage online users/friends
 */

class FriendsList {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.friends = [];
        this.onlineUsers = [];
        this.init();
    }
    
    init() {
        this.loadSampleData();
        this.render();
        this.startOnlineSimulation();
    }
    
    loadSampleData() {
        this.onlineUsers = [
            {
                id: 1,
                name: 'Alice Smith',
                avatar: '👩',
                status: 'online',
                lastSeen: 'Just now',
                messages: 45
            },
            {
                id: 2,
                name: 'Bob Johnson',
                avatar: '👨',
                status: 'online',
                lastSeen: 'Just now',
                messages: 23
            },
            {
                id: 3,
                name: 'Charlie Brown',
                avatar: '🧑',
                status: 'online',
                lastSeen: 'Just now',
                messages: 67
            },
            {
                id: 4,
                name: 'Diana Prince',
                avatar: '👸',
                status: 'online',
                lastSeen: '2 min ago',
                messages: 12
            },
            {
                id: 5,
                name: 'Eve Wilson',
                avatar: '👩‍🦰',
                status: 'online',
                lastSeen: 'Just now',
                messages: 89
            }
        ];
        
        this.friends = [
            {
                id: 6,
                name: 'Frank Miller',
                avatar: '👨‍🦱',
                status: 'offline',
                lastSeen: '2 hours ago',
                messages: 156
            },
            {
                id: 7,
                name: 'Grace Lee',
                avatar: '👩‍🦳',
                status: 'offline',
                lastSeen: '1 day ago',
                messages: 34
            },
            {
                id: 8,
                name: 'Henry Ford',
                avatar: '🧔',
                status: 'offline',
                lastSeen: '3 hours ago',
                messages: 78
            }
        ];
    }
    
    render() {
        if (!this.container) return;
        
        let html = '';
        
        // Online Users Section
        html += `
            <div class="friends-section">
                <div class="section-header" onclick="toggleSection('online')">
                    <span>🟢 Online (${this.onlineUsers.length})</span>
                    <span class="toggle-icon">▼</span>
                </div>
                <div class="section-content" id="online-section">
        `;
        
        this.onlineUsers.forEach(user => {
            html += this.renderUserCard(user);
        });
        
        html += '</div></div>';
        
        // Friends Section
        html += `
            <div class="friends-section">
                <div class="section-header" onclick="toggleSection('friends')">
                    <span>👥 Friends (${this.friends.length})</span>
                    <span class="toggle-icon">▼</span>
                </div>
                <div class="section-content" id="friends-section">
        `;
        
        this.friends.forEach(user => {
            html += this.renderUserCard(user);
        });
        
        html += '</div></div>';
        
        this.container.innerHTML = html;
    }
    
    renderUserCard(user) {
        const statusColor = user.status === 'online' ? '#4ade80' : '#9ca3af';
        const statusText = user.status === 'online' ? 'Online' : user.lastSeen;
        
        return `
            <div class="user-card" data-user-id="${user.id}">
                <div class="user-avatar-container">
                    <div class="user-avatar">${user.avatar}</div>
                    <div class="status-dot" style="background-color: ${statusColor};"></div>
                </div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-status" style="color: ${statusColor};">${statusText}</div>
                </div>
                <div class="user-actions">
                    <button class="action-btn" onclick="startChat(${user.id})" title="Chat">💬</button>
                </div>
            </div>
        `;
    }
    
    startOnlineSimulation() {
        // Simulate users going online/offline
        setInterval(() => {
            const randomUser = this.onlineUsers[Math.floor(Math.random() * this.onlineUsers.length)];
            if (Math.random() > 0.8) {
                // Toggle status
                randomUser.status = randomUser.status === 'online' ? 'offline' : 'online';
                randomUser.lastSeen = 'Just now';
                this.render();
            }
        }, 5000);
    }
    
    addUser(user) {
        this.onlineUsers.push(user);
        this.render();
    }
    
    removeUser(userId) {
        this.onlineUsers = this.onlineUsers.filter(u => u.id !== userId);
        this.friends = this.friends.filter(u => u.id !== userId);
        this.render();
    }
    
    getOnlineCount() {
        return this.onlineUsers.length;
    }
}

// Global functions for onclick handlers
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId + '-section');
    if (section) {
        section.classList.toggle('collapsed');
    }
}

function startChat(userId) {
    console.log('Starting chat with user:', userId);
    alert(`Starting chat with user ID: ${userId}`);
}

// Initialize when DOM is ready
function loadFriendsList() {
    new FriendsList('friends-list');
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FriendsList, loadFriendsList };
}
