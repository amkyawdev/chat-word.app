/**
 * Authentication System
 * Handle user authentication with Supabase
 */

class AuthSystem {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.currentUser = null;
        this.session = null;
    }

    /**
     * Sign up with email and password
     */
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;
            
            this.currentUser = data.user;
            this.session = data.session;
            
            return {
                success: true,
                user: data.user,
                session: data.session
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Sign in with email and password
     */
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            
            this.currentUser = data.user;
            this.session = data.session;
            
            // Create or update profile
            await this.createProfileIfNotExists(data.user);
            
            return {
                success: true,
                user: data.user,
                session: data.session
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Sign in with Google
     */
    async signInWithGoogle() {
        try {
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });

            if (error) throw error;
            
            return {
                success: true,
                url: data.url
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Sign out
     */
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            
            if (error) throw error;
            
            this.currentUser = null;
            this.session = null;
            
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get current session
     */
    async getSession() {
        try {
            const { data, error } = await this.supabase.auth.getSession();
            
            if (error) throw error;
            
            this.session = data.session;
            this.currentUser = data.session?.user || null;
            
            return {
                success: true,
                session: data.session,
                user: data.session?.user || null
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get current user
     */
    async getUser() {
        try {
            const { data, error } = await this.supabase.auth.getUser();
            
            if (error) throw error;
            
            this.currentUser = data.user;
            
            return {
                success: true,
                user: data.user
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update user metadata
     */
    async updateUser(data) {
        try {
            const { data: updatedData, error } = await this.supabase.auth.updateUser(data);

            if (error) throw error;
            
            this.currentUser = updatedData.user;
            
            return {
                success: true,
                user: updatedData.user
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Reset password
     */
    async resetPassword(email) {
        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });

            if (error) throw error;
            
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create profile if not exists
     */
    async createProfileIfNotExists(user) {
        try {
            // Check if profile exists
            const { data: existingProfile, error: checkError } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                throw checkError;
            }

            // If profile doesn't exist, create one
            if (!existingProfile) {
                const { error } = await this.supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        username: user.email?.split('@')[0] || 'user_' + Date.now(),
                        display_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                        avatar: user.user_metadata?.avatar_url || '👤'
                    });

                if (error) throw error;
            }

            return { success: true };
        } catch (error) {
            console.error('Profile creation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback) {
        return this.supabase.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null;
            this.session = session;
            callback(event, session);
        });
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.currentUser;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthSystem };
}
