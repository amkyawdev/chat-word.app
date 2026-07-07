/**
 * Main Application Logic
 * Core functionality for Chat Word
 */

class ChatWordApp {
    constructor() {
        this.currentUser = null;
        this.currentLanguage = 'my';
        this.theme = 'sky';
        this.isOnline = navigator.onLine;
        this.notifications = [];
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.checkOnlineStatus();
        this.initializeComponents();
        this.setupNotifications();
        this.logActivity('app', 'Application started');
    }
    
    loadSettings() {
        // Load from localStorage
        const savedSettings = localStorage.getItem('chatword_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.currentLanguage = settings.language || 'my';
            this.theme = settings.theme || 'sky';
        }
    }
    
    saveSettings() {
        const settings = {
            language: this.currentLanguage,
            theme: this.theme,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('chatword_settings', JSON.stringify(settings));
    }
    
    setupEventListeners() {
        // Online/Offline detection
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNotification('success', 'You are back online!');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('error', 'You are offline');
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            
            // Ctrl/Cmd + N for new chat
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.newChat();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Before unload
        window.addEventListener('beforeunload', () => {
            this.logActivity('app', 'Application closed');
        });
    }
    
    checkOnlineStatus() {
        if (!this.isOnline) {
            this.showNotification('warning', 'You are currently offline');
        }
    }
    
    initializeComponents() {
        // Initialize 3D effects
        if (typeof initThreeDEffects === 'function') {
            initThreeDEffects();
        }
        
        // Initialize friends list
        if (typeof loadFriendsList === 'function') {
            loadFriendsList();
        }
        
        // Initialize public chat
        if (typeof initPublicChat === 'function') {
            initPublicChat();
        }
    }
    
    setupNotifications() {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    // User Management
    setCurrentUser(user) {
        this.currentUser = user;
        this.logActivity('login', `${user.name} logged in`);
    }
    
    logout() {
        if (this.currentUser) {
            this.logActivity('logout', `${this.currentUser.name} logged out`);
        }
        this.currentUser = null;
        localStorage.removeItem('chatword_user');
    }
    
    // Language Management
    setLanguage(lang) {
        this.currentLanguage = lang;
        this.saveSettings();
        this.updatePageLanguage();
        this.logActivity('settings', `Language changed to ${lang}`);
    }
    
    updatePageLanguage() {
        const translations = this.getTranslations();
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    }
    
    getTranslations() {
        // Simple inline translations
        const translations = {
            my: {
                'nav.home': 'ပင်မ',
                'nav.dashboard': 'ဒိုင်ခွက်',
                'nav.profile': '�proဖိုင်',
                'nav.settings': 'ဆက်တင်များ',
                'nav.about': 'အကြောင်းအရာ',
                'chat.send': 'ပို့မည်',
                'chat.placeholder': 'မက်ဆေ့ခ်ျရိုက်ထည့်ပါ...'
            },
            eng: {
                'nav.home': 'Home',
                'nav.dashboard': 'Dashboard',
                'nav.profile': 'Profile',
                'nav.settings': 'Settings',
                'nav.about': 'About',
                'chat.send': 'Send',
                'chat.placeholder': 'Type a message...'
            }
        };
        
        return translations[this.currentLanguage] || translations.eng;
    }
    
    // Theme Management
    setTheme(theme) {
        this.theme = theme;
        this.saveSettings();
        document.body.setAttribute('data-theme', theme);
        this.logActivity('settings', `Theme changed to ${theme}`);
    }
    
    // Notifications
    showNotification(type, message, duration = 3000) {
        const notification = {
            id: Date.now(),
            type,
            message,
            timestamp: new Date()
        };
        
        this.notifications.push(notification);
        this.renderNotification(notification);
        
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, duration);
        }
    }
    
    renderNotification(notification) {
        const container = document.getElementById('notification-container') || this.createNotificationContainer();
        
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification notification-${notification.type}`;
        notificationEl.id = `notification-${notification.id}`;
        notificationEl.innerHTML = `
            <span>${notification.message}</span>
            <button onclick="app.removeNotification(${notification.id})">&times;</button>
        `;
        
        container.appendChild(notificationEl);
        
        // Animate in
        setTimeout(() => {
            notificationEl.classList.add('show');
        }, 10);
    }
    
    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    removeNotification(id) {
        const notificationEl = document.getElementById(`notification-${id}`);
        if (notificationEl) {
            notificationEl.classList.remove('show');
            setTimeout(() => {
                notificationEl.remove();
            }, 300);
        }
        this.notifications = this.notifications.filter(n => n.id !== id);
    }
    
    // Activity Logging
    logActivity(type, action) {
        const log = {
            type,
            action,
            timestamp: new Date().toISOString(),
            user: this.currentUser ? this.currentUser.name : 'System'
        };
        
        // Save to localStorage
        const logs = JSON.parse(localStorage.getItem('chatword_logs') || '[]');
        logs.unshift(log);
        if (logs.length > 100) logs.pop();
        localStorage.setItem('chatword_logs', JSON.stringify(logs));
        
        console.log(`[Activity] ${log.user}: ${log.action}`);
    }
    
    // Search
    openSearch() {
        const searchQuery = prompt('Search:', '');
        if (searchQuery) {
            this.search(searchQuery);
        }
    }
    
    search(query) {
        console.log('Searching for:', query);
        this.showNotification('info', `Searching for "${query}"...`);
        // Implement search logic
    }
    
    // Chat
    newChat() {
        console.log('Opening new chat');
        this.showNotification('info', 'Opening new chat...');
        // Implement new chat logic
    }
    
    // Modals
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ChatWordApp();
    window.chatWordApp = app;
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChatWordApp };
}
