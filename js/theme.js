/**
 * Theme Manager
 * Handle theme switching and customization
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'sky';
        this.themes = {};
        this.init();
    }
    
    init() {
        this.loadThemes();
        this.loadSavedTheme();
    }
    
    loadThemes() {
        this.themes = {
            sky: {
                name: 'Sky Blue',
                colors: {
                    primary: '#00BFFF',
                    secondary: '#87CEEB',
                    accent: '#1E90FF',
                    background: '#E0F4FF',
                    backgroundGradient: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #E0F4FF 100%)',
                    text: '#1a1a2e',
                    textLight: '#ffffff',
                    card: '#ffffff',
                    border: 'rgba(135, 206, 235, 0.3)',
                    success: '#4ade80',
                    warning: '#f59e0b',
                    error: '#ef4444',
                    info: '#3b82f6'
                }
            },
            pink: {
                name: 'Pink',
                colors: {
                    primary: '#FF69B4',
                    secondary: '#FFB6C1',
                    accent: '#FF1493',
                    background: '#FFF0F5',
                    backgroundGradient: 'linear-gradient(180deg, #FFB6C1 0%, #FFC0CB 50%, #FFF0F5 100%)',
                    text: '#4a1942',
                    textLight: '#ffffff',
                    card: '#ffffff',
                    border: 'rgba(255, 182, 193, 0.3)',
                    success: '#4ade80',
                    warning: '#f59e0b',
                    error: '#ef4444',
                    info: '#ec4899'
                }
            },
            green: {
                name: 'Green',
                colors: {
                    primary: '#228B22',
                    secondary: '#98FB98',
                    accent: '#32CD32',
                    background: '#F0FFF0',
                    backgroundGradient: 'linear-gradient(180deg, #98FB98 0%, #90EE90 50%, #F0FFF0 100%)',
                    text: '#1a3a1a',
                    textLight: '#ffffff',
                    card: '#ffffff',
                    border: 'rgba(152, 251, 152, 0.3)',
                    success: '#4ade80',
                    warning: '#f59e0b',
                    error: '#ef4444',
                    info: '#22c55e'
                }
            },
            purple: {
                name: 'Purple',
                colors: {
                    primary: '#9370DB',
                    secondary: '#DDA0DD',
                    accent: '#8A2BE2',
                    background: '#F5F0FF',
                    backgroundGradient: 'linear-gradient(180deg, #DDA0DD 0%, #E6E6FA 50%, #F5F0FF 100%)',
                    text: '#2d1b4e',
                    textLight: '#ffffff',
                    card: '#ffffff',
                    border: 'rgba(221, 160, 221, 0.3)',
                    success: '#4ade80',
                    warning: '#f59e0b',
                    error: '#ef4444',
                    info: '#a855f7'
                }
            },
            orange: {
                name: 'Orange',
                colors: {
                    primary: '#FFA500',
                    secondary: '#FFD700',
                    accent: '#FF8C00',
                    background: '#FFF8E7',
                    backgroundGradient: 'linear-gradient(180deg, #FFD700 0%, #FFE4B5 50%, #FFF8E7 100%)',
                    text: '#3d2b1f',
                    textLight: '#ffffff',
                    card: '#ffffff',
                    border: 'rgba(255, 215, 0, 0.3)',
                    success: '#4ade80',
                    warning: '#f59e0b',
                    error: '#ef4444',
                    info: '#f97316'
                }
            }
        };
    }
    
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('chatword_theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.setTheme(savedTheme);
        }
    }
    
    setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.error('Theme not found:', themeName);
            return;
        }
        
        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        
        // Apply CSS variables
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--${this.camelToKebab(key)}`, value);
        });
        
        // Save to localStorage
        localStorage.setItem('chatword_theme', themeName);
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
    }
    
    camelToKebab(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
    
    getTheme(themeName) {
        return this.themes[themeName] || null;
    }
    
    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }
    
    getAllThemes() {
        return Object.keys(this.themes);
    }
    
    createCustomTheme(name, colors) {
        this.themes[name] = {
            name: name,
            colors: {
                ...this.themes.sky.colors,
                ...colors
            }
        };
    }
    
    applyDarkMode() {
        document.body.classList.add('dark-mode');
        document.body.style.background = '#1a1a2e';
        
        const root = document.documentElement;
        root.style.setProperty('--background', '#1a1a2e');
        root.style.setProperty('--text', '#e0e0e0');
        root.style.setProperty('--card', '#2d2d44');
        root.style.setProperty('--border', 'rgba(255, 255, 255, 0.1)');
    }
    
    removeDarkMode() {
        document.body.classList.remove('dark-mode');
        const theme = this.getCurrentTheme();
        if (theme) {
            const root = document.documentElement;
            root.style.setProperty('--background', theme.colors.background);
            root.style.setProperty('--text', theme.colors.text);
            root.style.setProperty('--card', theme.colors.card);
            root.style.setProperty('--border', theme.colors.border);
        }
    }
    
    toggleDarkMode() {
        if (document.body.classList.contains('dark-mode')) {
            this.removeDarkMode();
        } else {
            this.applyDarkMode();
        }
    }
}

// Create global instance
const themeManager = new ThemeManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, themeManager };
}

// Helper functions for theme switching
function setTheme(themeName) {
    themeManager.setTheme(themeName);
}

function getCurrentTheme() {
    return themeManager.getCurrentTheme();
}

function toggleDarkMode() {
    themeManager.toggleDarkMode();
}
