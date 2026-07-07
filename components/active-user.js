/**
 * Active User Logs Component
 * Track and display active user activity logs
 */

class ActiveUserLogs {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.logs = [];
        this.maxLogs = 50;
        this.autoRefresh = true;
        this.init();
    }
    
    init() {
        this.loadSampleLogs();
        this.render();
        
        if (this.autoRefresh) {
            this.startAutoRefresh();
        }
    }
    
    loadSampleLogs() {
        this.logs = [
            {
                id: 1,
                type: 'login',
                user: 'John Doe',
                action: 'Logged in',
                timestamp: new Date(Date.now() - 60000),
                icon: '🔓',
                color: '#4ade80'
            },
            {
                id: 2,
                type: 'message',
                user: 'Alice Smith',
                action: 'Sent a message in Global Chat',
                timestamp: new Date(Date.now() - 120000),
                icon: '💬',
                color: '#3b82f6'
            },
            {
                id: 3,
                type: 'join',
                user: 'Bob Johnson',
                action: 'Joined the platform',
                timestamp: new Date(Date.now() - 180000),
                icon: '👋',
                color: '#a855f7'
            },
            {
                id: 4,
                type: 'logout',
                user: 'Charlie Brown',
                action: 'Logged out',
                timestamp: new Date(Date.now() - 240000),
                icon: '🔒',
                color: '#ef4444'
            },
            {
                id: 5,
                type: 'profile',
                user: 'Diana Prince',
                action: 'Updated profile',
                timestamp: new Date(Date.now() - 300000),
                icon: '👤',
                color: '#f59e0b'
            },
            {
                id: 6,
                type: 'message',
                user: 'Eve Wilson',
                action: 'Sent a message in Global Chat',
                timestamp: new Date(Date.now() - 360000),
                icon: '💬',
                color: '#3b82f6'
            },
            {
                id: 7,
                type: 'login',
                user: 'Frank Miller',
                action: 'Logged in',
                timestamp: new Date(Date.now() - 420000),
                icon: '🔓',
                color: '#4ade80'
            },
            {
                id: 8,
                type: 'settings',
                user: 'Grace Lee',
                action: 'Changed settings',
                timestamp: new Date(Date.now() - 480000),
                icon: '⚙️',
                color: '#6366f1'
            }
        ];
    }
    
    render() {
        if (!this.container) return;
        
        let html = '<div class="logs-container">';
        
        this.logs.forEach(log => {
            html += this.renderLogItem(log);
        });
        
        html += '</div>';
        this.container.innerHTML = html;
    }
    
    renderLogItem(log) {
        const time = this.formatTime(log.timestamp);
        
        return `
            <div class="log-item" style="border-left-color: ${log.color};">
                <div class="log-icon" style="background-color: ${log.color}20; color: ${log.color};">
                    ${log.icon}
                </div>
                <div class="log-details">
                    <div class="log-user">${log.user}</div>
                    <div class="log-action">${log.action}</div>
                    <div class="log-time">${time}</div>
                </div>
            </div>
        `;
    }
    
    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    addLog(log) {
        const newLog = {
            id: this.logs.length + 1,
            ...log,
            timestamp: new Date()
        };
        
        this.logs.unshift(newLog);
        
        // Keep only maxLogs
        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }
        
        this.render();
    }
    
    startAutoRefresh() {
        // Simulate new activity every 10-30 seconds
        setInterval(() => {
            this.simulateActivity();
        }, 10000 + Math.random() * 20000);
    }
    
    simulateActivity() {
        const activities = [
            { type: 'message', user: 'User' + Math.floor(Math.random() * 100), action: 'Sent a message', icon: '💬', color: '#3b82f6' },
            { type: 'login', user: 'User' + Math.floor(Math.random() * 100), action: 'Logged in', icon: '🔓', color: '#4ade80' },
            { type: 'join', user: 'User' + Math.floor(Math.random() * 100), action: 'Joined the platform', icon: '👋', color: '#a855f7' },
            { type: 'profile', user: 'User' + Math.floor(Math.random() * 100), action: 'Updated profile', icon: '👤', color: '#f59e0b' }
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        this.addLog(randomActivity);
    }
    
    filterLogs(type) {
        if (type === 'all') {
            this.render();
        } else {
            const filteredLogs = this.logs.filter(log => log.type === type);
            let html = '<div class="logs-container">';
            filteredLogs.forEach(log => {
                html += this.renderLogItem(log);
            });
            html += '</div>';
            this.container.innerHTML = html;
        }
    }
    
    clearLogs() {
        this.logs = [];
        this.render();
    }
    
    getLogCount() {
        return this.logs.length;
    }
    
    getLogsByType(type) {
        return this.logs.filter(log => log.type === type);
    }
}

// Initialize active user logs
function loadActiveUserLogs() {
    return new ActiveUserLogs('active-users');
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ActiveUserLogs, loadActiveUserLogs };
}
