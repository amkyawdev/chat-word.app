/**
 * API Handler
 * Manage API calls and data fetching
 */

class API {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }
    
    async request(endpoint, options = {}) {
        const url = this.baseURL + endpoint;
        
        const config = {
            ...options,
            headers: {
                ...this.defaultHeaders,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }
    
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// API Endpoints
const API_ENDPOINTS = {
    // User endpoints
    USERS: '/api/users',
    USER_BY_ID: (id) => `/api/users/${id}`,
    
    // Chat endpoints
    MESSAGES: '/api/messages',
    MESSAGE_BY_ID: (id) => `/api/messages/${id}`,
    
    // Friends endpoints
    FRIENDS: '/api/friends',
    FRIEND_BY_ID: (id) => `/api/friends/${id}`,
    
    // Auth endpoints
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    
    // Settings endpoints
    SETTINGS: '/api/settings',
    
    // Activity log endpoints
    ACTIVITY_LOGS: '/api/activity-logs'
};

// API Service
class ChatWordAPI {
    constructor() {
        this.api = new API();
    }
    
    // User APIs
    async getUsers() {
        return this.api.get(API_ENDPOINTS.USERS);
    }
    
    async getUserById(id) {
        return this.api.get(API_ENDPOINTS.USER_BY_ID(id));
    }
    
    async createUser(userData) {
        return this.api.post(API_ENDPOINTS.USERS, userData);
    }
    
    async updateUser(id, userData) {
        return this.api.put(API_ENDPOINTS.USER_BY_ID(id), userData);
    }
    
    async deleteUser(id) {
        return this.api.delete(API_ENDPOINTS.USER_BY_ID(id));
    }
    
    // Message APIs
    async getMessages(limit = 50, offset = 0) {
        return this.api.get(API_ENDPOINTS.MESSAGES, { limit, offset });
    }
    
    async sendMessage(messageData) {
        return this.api.post(API_ENDPOINTS.MESSAGES, messageData);
    }
    
    async deleteMessage(id) {
        return this.api.delete(API_ENDPOINTS.MESSAGE_BY_ID(id));
    }
    
    // Friends APIs
    async getFriends() {
        return this.api.get(API_ENDPOINTS.FRIENDS);
    }
    
    async addFriend(friendId) {
        return this.api.post(API_ENDPOINTS.FRIENDS, { friendId });
    }
    
    async removeFriend(friendId) {
        return this.api.delete(API_ENDPOINTS.FRIEND_BY_ID(friendId));
    }
    
    // Auth APIs
    async login(credentials) {
        return this.api.post(API_ENDPOINTS.LOGIN, credentials);
    }
    
    async logout() {
        return this.api.post(API_ENDPOINTS.LOGOUT);
    }
    
    async register(userData) {
        return this.api.post(API_ENDPOINTS.REGISTER, userData);
    }
    
    // Settings APIs
    async getSettings() {
        return this.api.get(API_ENDPOINTS.SETTINGS);
    }
    
    async updateSettings(settings) {
        return this.api.put(API_ENDPOINTS.SETTINGS, settings);
    }
    
    // Activity Logs APIs
    async getActivityLogs(limit = 50) {
        return this.api.get(API_ENDPOINTS.ACTIVITY_LOGS, { limit });
    }
    
    // Simulated APIs for demo (using localStorage)
    async simulateGetMessages() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(JSON.parse(localStorage.getItem('chatword_messages') || '[]'));
            }, 500);
        });
    }
    
    async simulateSendMessage(message) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const messages = JSON.parse(localStorage.getItem('chatword_messages') || '[]');
                messages.push({
                    id: Date.now(),
                    ...message,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('chatword_messages', JSON.stringify(messages));
                resolve(message);
            }, 300);
        });
    }
}

// Create global API instance
const chatAPI = new ChatWordAPI();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, ChatWordAPI, chatAPI, API_ENDPOINTS };
}
