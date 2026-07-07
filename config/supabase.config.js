/**
 * Supabase Configuration
 * Real-time database and client setup
 * 
 * Get credentials from: https://supabase.com/dashboard/project/_/settings/api
 */

// Supabase credentials - Replace with your actual values or use environment variables
const SUPABASE_URL = import.meta.env?.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = import.meta.env?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
let supabaseClient = null;
let authSystem = null;

/**
 * Initialize Supabase client
 */
function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.warn('⚠️ Supabase SDK not loaded. Add the script tag to your HTML.');
        return null;
    }

    if (!supabaseClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            },
            realtime: {
                params: {
                    eventsPerSecond: 10
                }
            }
        });

        // Initialize auth system
        authSystem = new AuthSystem(supabaseClient);

        console.log('✅ Supabase client initialized');
    }

    return supabaseClient;
}

/**
 * Get Supabase client instance
 */
function getSupabase() {
    if (!supabaseClient) {
        initSupabase();
    }
    return supabaseClient;
}

/**
 * Get Auth system instance
 */
function getAuth() {
    if (!authSystem) {
        initSupabase();
    }
    return authSystem;
}

// ============================================
// Real-time Subscriptions
// ============================================

class RealtimeManager {
    constructor() {
        this.channels = new Map();
        this.supabase = getSupabase();
    }

    /**
     * Subscribe to new messages in a chat
     */
    subscribeToMessages(chatId, callback) {
        const channelName = `messages:${chatId}`;
        
        if (this.channels.has(channelName)) {
            return this.channels.get(channelName);
        }

        const channel = this.supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`
                },
                (payload) => {
                    callback('INSERT', payload.new);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`
                },
                (payload) => {
                    callback('UPDATE', payload.new);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`
                },
                (payload) => {
                    callback('DELETE', payload.old);
                }
            )
            .subscribe();

        this.channels.set(channelName, channel);
        return channel;
    }

    /**
     * Subscribe to user online status
     */
    subscribeToUserStatus(userId, callback) {
        const channelName = `user_status:${userId}`;
        
        if (this.channels.has(channelName)) {
            return this.channels.get(channelName);
        }

        const channel = this.supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${userId}`
                },
                (payload) => {
                    callback(payload.new);
                }
            )
            .subscribe();

        this.channels.set(channelName, channel);
        return channel;
    }

    /**
     * Subscribe to all online users
     */
    subscribeToOnlineUsers(callback) {
        const channelName = 'online_users';

        if (this.channels.has(channelName)) {
            return this.channels.get(channelName);
        }

        const channel = this.supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles'
                },
                (payload) => {
                    callback(payload);
                }
            )
            .subscribe();

        this.channels.set(channelName, channel);
        return channel;
    }

    /**
     * Subscribe to friend requests
     */
    subscribeToFriendRequests(userId, callback) {
        const channelName = `friend_requests:${userId}`;

        if (this.channels.has(channelName)) {
            return this.channels.get(channelName);
        }

        const channel = this.supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'friendships',
                    filter: `friend_id=eq.${userId}`
                },
                (payload) => {
                    callback('NEW_REQUEST', payload.new);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'friendships',
                    filter: `friend_id=eq.${userId}`
                },
                (payload) => {
                    callback('UPDATE', payload.new);
                }
            )
            .subscribe();

        this.channels.set(channelName, channel);
        return channel;
    }

    /**
     * Unsubscribe from a channel
     */
    unsubscribe(channelName) {
        if (this.channels.has(channelName)) {
            const channel = this.channels.get(channelName);
            this.supabase.removeChannel(channel);
            this.channels.delete(channelName);
        }
    }

    /**
     * Unsubscribe from all channels
     */
    unsubscribeAll() {
        this.channels.forEach((channel, name) => {
            this.supabase.removeChannel(channel);
        });
        this.channels.clear();
    }
}

// Global instances
let realtimeManager = null;

function getRealtimeManager() {
    if (!realtimeManager) {
        realtimeManager = new RealtimeManager();
    }
    return realtimeManager;
}

// ============================================
// Database Operations
// ============================================

class DatabaseManager {
    constructor() {
        this.supabase = getSupabase();
    }

    // Messages
    async sendMessage(chatId, userId, content, type = 'text') {
        const { data, error } = await this.supabase
            .from('messages')
            .insert({
                chat_id: chatId,
                user_id: userId,
                content,
                type
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getMessages(chatId, limit = 50) {
        const { data, error } = await this.supabase
            .from('messages')
            .select(`
                *,
                user:profiles(id, username, avatar)
            `)
            .eq('chat_id', chatId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data.reverse();
    }

    async deleteMessage(messageId) {
        const { error } = await this.supabase
            .from('messages')
            .delete()
            .eq('id', messageId);

        if (error) throw error;
    }

    // Profiles
    async getProfile(userId) {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    }

    async updateProfile(userId, updates) {
        const { data, error } = await this.supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getOnlineUsers() {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('status', 'online');

        if (error) throw error;
        return data;
    }

    // Friends
    async addFriend(userId, friendId) {
        const { data, error } = await this.supabase
            .from('friendships')
            .insert({
                user_id: userId,
                friend_id: friendId,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async acceptFriend(friendshipId) {
        const { data, error } = await this.supabase
            .from('friendships')
            .update({ status: 'accepted' })
            .eq('id', friendshipId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getFriends(userId) {
        const { data, error } = await this.supabase
            .from('friendships')
            .select(`
                *,
                friend:profiles!friend_id(id, username, avatar, status)
            `)
            .eq('user_id', userId)
            .eq('status', 'accepted');

        if (error) throw error;
        return data;
    }

    // Settings
    async getSettings(userId) {
        const { data, error } = await this.supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    async updateSettings(userId, updates) {
        const { data, error } = await this.supabase
            .from('user_settings')
            .upsert({
                user_id: userId,
                ...updates
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Chats
    async getChats(userId) {
        const { data, error } = await this.supabase
            .from('chats')
            .select(`
                *,
                messages:messages(content, created_at)
            `)
            .or(`type.eq.public,created_by.eq.${userId}`)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    async createChat(name, type = 'public', createdBy = null) {
        const { data, error } = await this.supabase
            .from('chats')
            .insert({
                name,
                type,
                created_by: createdBy
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}

// Global database manager
let databaseManager = null;

function getDatabase() {
    if (!databaseManager) {
        databaseManager = new DatabaseManager();
    }
    return databaseManager;
}

// ============================================
// Exports
// ============================================

export {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    initSupabase,
    getSupabase,
    getAuth,
    getRealtimeManager,
    getDatabase,
    AuthSystem,
    RealtimeManager,
    DatabaseManager
};

// For browser usage
if (typeof window !== 'undefined') {
    window.SupabaseConfig = {
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        initSupabase,
        getSupabase,
        getAuth,
        getRealtimeManager,
        getDatabase
    };
}
