/**
 * User Logging System
 * Track and manage user activity logs
 */

class UserLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
        this.filters = {
            type: null,
            userId: null,
            startDate: null,
            endDate: null
        };
    }
    
    // Log types
    static LOG_TYPES = {
        LOGIN: 'login',
        LOGOUT: 'logout',
        MESSAGE: 'message',
        FRIEND_REQUEST: 'friend_request',
        FRIEND_ACCEPT: 'friend_accept',
        FRIEND_REJECT: 'friend_reject',
        PROFILE_UPDATE: 'profile_update',
        SETTINGS_CHANGE: 'settings_change',
        THEME_CHANGE: 'theme_change',
        LANGUAGE_CHANGE: 'language_change',
        PAGE_VIEW: 'page_view',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info'
    };
    
    // Add a log entry
    log(type, userId, action, details = {}) {
        const logEntry = {
            id: this.generateId(),
            type,
            userId,
            action,
            details,
            timestamp: new Date().toISOString(),
            ip: this.getClientIP(),
            userAgent: navigator.userAgent
        };
        
        this.logs.unshift(logEntry);
        
        // Keep only maxLogs
        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }
        
        // Save to localStorage
        this.save();
        
        // Send to server (if available)
        this.sendToServer(logEntry);
        
        return logEntry;
    }
    
    // Quick logging methods
    logLogin(userId) {
        return this.log(UserLogger.LOG_TYPES.LOGIN, userId, 'User logged in');
    }
    
    logLogout(userId) {
        return this.log(UserLogger.LOG_TYPES.LOGOUT, userId, 'User logged out');
    }
    
    logMessage(userId, messageId) {
        return this.log(UserLogger.LOG_TYPES.MESSAGE, userId, 'User sent a message', { messageId });
    }
    
    logProfileUpdate(userId, changes) {
        return this.log(UserLogger.LOG_TYPES.PROFILE_UPDATE, userId, 'User updated profile', { changes });
    }
    
    logSettingsChange(userId, setting, oldValue, newValue) {
        return this.log(UserLogger.LOG_TYPES.SETTINGS_CHANGE, userId, 'User changed settings', {
            setting,
            oldValue,
            newValue
        });
    }
    
    logThemeChange(userId, theme) {
        return this.log(UserLogger.LOG_TYPES.THEME_CHANGE, userId, 'User changed theme', { theme });
    }
    
    logLanguageChange(userId, language) {
        return this.log(UserLogger.LOG_TYPES.LANGUAGE_CHANGE, userId, 'User changed language', { language });
    }
    
    logPageView(userId, page) {
        return this.log(UserLogger.LOG_TYPES.PAGE_VIEW, userId, 'User viewed page', { page });
    }
    
    logError(userId, error, context = {}) {
        return this.log(UserLogger.LOG_TYPES.ERROR, userId, 'Error occurred', { error, context });
    }
    
    // Get logs with filters
    getLogs(filters = {}) {
        let filteredLogs = [...this.logs];
        
        if (filters.type) {
            filteredLogs = filteredLogs.filter(log => log.type === filters.type);
        }
        
        if (filters.userId) {
            filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
        }
        
        if (filters.startDate) {
            const start = new Date(filters.startDate);
            filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= start);
        }
        
        if (filters.endDate) {
            const end = new Date(filters.endDate);
            filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= end);
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filteredLogs = filteredLogs.filter(log => 
                log.action.toLowerCase().includes(search) ||
                log.type.toLowerCase().includes(search)
            );
        }
        
        return filteredLogs;
    }
    
    // Get logs by user
    getLogsByUser(userId) {
        return this.getLogs({ userId });
    }
    
    // Get logs by type
    getLogsByType(type) {
        return this.getLogs({ type });
    }
    
    // Get recent logs
    getRecentLogs(limit = 50) {
        return this.logs.slice(0, limit);
    }
    
    // Get log statistics
    getStatistics() {
        const stats = {
            total: this.logs.length,
            byType: {},
            byUser: {},
            recentActivity: this.getRecentLogs(10)
        };
        
        this.logs.forEach(log => {
            stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;
            stats.byUser[log.userId] = (stats.byUser[log.userId] || 0) + 1;
        });
        
        return stats;
    }
    
    // Clear logs
    clearLogs() {
        this.logs = [];
        this.save();
    }
    
    // Export logs
    exportLogs(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.logs, null, 2);
        } else if (format === 'csv') {
            const headers = ['ID', 'Type', 'User ID', 'Action', 'Timestamp'];
            const rows = this.logs.map(log => [
                log.id,
                log.type,
                log.userId,
                log.action,
                log.timestamp
            ]);
            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
        return '';
    }
    
    // Save to localStorage
    save() {
        try {
            localStorage.setItem('user_logs', JSON.stringify(this.logs));
        } catch (error) {
            console.error('Failed to save logs:', error);
        }
    }
    
    // Load from localStorage
    load() {
        try {
            const saved = localStorage.getItem('user_logs');
            if (saved) {
                this.logs = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load logs:', error);
        }
    }
    
    // Send to server (placeholder)
    async sendToServer(logEntry) {
        // This would send logs to a backend server
        console.log('Log entry:', logEntry);
    }
    
    // Helper methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    getClientIP() {
        // This is a placeholder - real implementation would need server-side code
        return '127.0.0.1';
    }
    
    formatLog(log) {
        const date = new Date(log.timestamp);
        return `[${date.toLocaleString()}] ${log.type.toUpperCase()}: ${log.action}`;
    }
}

// Create global logger instance
const userLogger = new UserLogger();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UserLogger, userLogger };
}
