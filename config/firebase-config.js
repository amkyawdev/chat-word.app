/**
 * Supabase Configuration
 * Supabase setup for real-time database, authentication, and storage
 * 
 * Replace with your actual Supabase project credentials from:
 * https://supabase.com/dashboard/project/_/settings/api
 */

// Supabase configuration object
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
let supabase = null;

function initializeSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase initialized successfully');
        return true;
    } else {
        console.warn('Supabase SDK not loaded. Add the script tag to your HTML.');
        return false;
    }
}

/**
 * Supabase Client Getter
 */
function getSupabase() {
    if (!supabase) {
        initializeSupabase();
    }
    return supabase;
}

/**
 * Supabase Auth Helpers
 */
export async function signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData }
    });
    if (error) throw error;
    return data;
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
}

export function getCurrentUser() {
    return supabase.auth.getUser();
}

/**
 * Supabase Database Helpers
 */

// Users
export async function createUserProfile(userId, profileData) {
    const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: userId, ...profileData }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data;
}

export async function updateUserProfile(userId, updates) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Messages
export async function sendMessage(chatId, message) {
    const { data, error } = await supabase
        .from('messages')
        .insert([{ chat_id: chatId, ...message }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getMessages(chatId, limit = 50) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) throw error;
    return data;
}

export function subscribeToMessages(chatId, callback) {
    return supabase
        .channel('messages')
        .on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
            callback
        )
        .subscribe();
}

// Friends
export async function addFriend(userId, friendId) {
    const { data, error } = await supabase
        .from('friendships')
        .insert([{ user_id: userId, friend_id: friendId, status: 'pending' }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getFriends(userId) {
    const { data, error } = await supabase
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

// Online Status
export async function setUserOnline(userId, isOnline) {
    const { error } = await supabase
        .from('profiles')
        .update({ 
            online: isOnline, 
            last_seen: new Date().toISOString() 
        })
        .eq('id', userId);
    if (error) throw error;
}

export function subscribeToOnlineUsers(callback) {
    return supabase
        .channel('online-users')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'profiles' },
            callback
        )
        .subscribe();
}

// Export
export { supabase, SUPABASE_URL, SUPABASE_ANON_KEY };

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        initializeSupabase,
        getSupabase,
        signUp,
        signIn,
        signOut,
        onAuthStateChange,
        getCurrentUser,
        createUserProfile,
        getUserProfile,
        updateUserProfile,
        sendMessage,
        getMessages,
        subscribeToMessages,
        addFriend,
        getFriends,
        setUserOnline,
        subscribeToOnlineUsers
    };
}
