/**
 * Application Configuration
 * Global configuration for Chat Word
 */

const APP_CONFIG = {
    // App Info
    app: {
        name: 'Chat Word',
        version: '1.0.0',
        description: 'A modern chat application with sky blue theme',
        author: 'Chat Word Team',
        copyright: `© ${new Date().getFullYear()} Chat Word. All rights reserved.`
    },
    
    // API Configuration
    api: {
        baseURL: '/api',
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000
    },
    
    // Storage Keys
    storage: {
        user: 'chatword_user',
        settings: 'chatword_settings',
        theme: 'chatword_theme',
        language: 'chatword_language',
        messages: 'chatword_messages',
        logs: 'chatword_logs',
        token: 'chatword_token'
    },
    
    // Default Settings
    defaults: {
        language: 'my',
        theme: 'sky',
        notifications: {
            enabled: true,
            sound: true,
            desktop: false
        },
        privacy: {
            showOnlineStatus: true,
            showLastSeen: true
        }
    },
    
    // UI Configuration
    ui: {
        maxMessages: 100,
        maxLogs: 1000,
        notificationDuration: 3000,
        typingDelay: 1000,
        animationSpeed: 300
    },
    
    // Feature Flags
    features: {
        darkMode: true,
        multiLanguage: true,
        notifications: true,
        activityLogs: true,
        profileCustomization: true
    },
    
    // Supported Languages
    languages: [
        { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာစာ' },
        { code: 'eng', name: 'English', nativeName: 'English' }
    ],
    
    // Supported Themes
    themes: [
        { id: 'sky', name: 'Sky Blue', color: '#00BFFF' },
        { id: 'pink', name: 'Pink', color: '#FF69B4' },
        { id: 'green', name: 'Green', color: '#228B22' },
        { id: 'purple', name: 'Purple', color: '#9370DB' },
        { id: 'orange', name: 'Orange', color: '#FFA500' }
    ],
    
    // Page Routes
    routes: {
        home: '/index.html',
        main: '/pages/main.html',
        dashboard: '/pages/dashboard.html',
        profile: '/pages/profile.html',
        settings: '/pages/setting.html',
        about: '/pages/about.html'
    },
    
    // WebSocket Configuration (for real-time features)
    websocket: {
        enabled: false,
        url: 'wss://api.chatword.app/ws',
        reconnectInterval: 5000,
        maxReconnectAttempts: 5
    },
    
    // Analytics (placeholder)
    analytics: {
        enabled: false,
        trackingId: ''
    }
};

// Freeze config to prevent modifications
Object.freeze(APP_CONFIG);
Object.freeze(APP_CONFIG.app);
Object.freeze(APP_CONFIG.api);
Object.freeze(APP_CONFIG.storage);
Object.freeze(APP_CONFIG.defaults);
Object.freeze(APP_CONFIG.ui);
Object.freeze(APP_CONFIG.features);
Object.freeze(APP_CONFIG.languages);
Object.freeze(APP_CONFIG.themes);
Object.freeze(APP_CONFIG.routes);
Object.freeze(APP_CONFIG.websocket);
Object.freeze(APP_CONFIG.analytics);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}
