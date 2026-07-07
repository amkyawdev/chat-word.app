/**
 * Sidebar Component
 * Navigation sidebar with click in/out functionality for Chat Word application
 */

class SidebarManager {
    constructor() {
        this.isOpen = false;
        this.sidebar = null;
        this.overlay = null;
    }
    
    init() {
        this.createOverlay();
        this.setupEventListeners();
    }
    
    createOverlay() {
        if (!document.querySelector('.sidebar-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'sidebar-overlay';
            document.body.appendChild(this.overlay);
            
            // Close sidebar when clicking overlay
            this.overlay.addEventListener('click', () => {
                this.close();
            });
        }
    }
    
    setupEventListeners() {
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Close on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.close();
            }
        });
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.isOpen = true;
        this.sidebar = document.querySelector('.sidebar');
        this.overlay = document.querySelector('.sidebar-overlay');
        
        if (this.sidebar) {
            this.sidebar.classList.add('open');
        }
        if (this.overlay) {
            this.overlay.classList.add('open');
        }
        
        // Prevent body scroll when sidebar is open
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.isOpen = false;
        this.sidebar = document.querySelector('.sidebar');
        this.overlay = document.querySelector('.sidebar-overlay');
        
        if (this.sidebar) {
            this.sidebar.classList.remove('open');
        }
        if (this.overlay) {
            this.overlay.classList.remove('open');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    isOpenState() {
        return this.isOpen;
    }
}

// Global sidebar manager instance
let sidebarManager = null;

function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;
    
    // Initialize sidebar manager
    if (!sidebarManager) {
        sidebarManager = new SidebarManager();
        sidebarManager.init();
    }
    
    sidebarContainer.innerHTML = `
        <!-- Mobile Menu Toggle Button -->
        <button class="menu-toggle-btn" onclick="toggleSidebar()" aria-label="Toggle Menu">
            <span class="menu-icon">☰</span>
        </button>
        
        <aside class="sidebar" id="main-sidebar">
            <div class="sidebar-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="color: #1E90FF; font-size: 24px; margin-bottom: 5px;">💬 Chat Word</h2>
                        <small style="color: #666;">v1.0.0</small>
                    </div>
                    <button class="close-sidebar-btn" onclick="toggleSidebar()" aria-label="Close Menu">
                        ✕
                    </button>
                </div>
            </div>
            
            <nav class="sidebar-menu">
                <a href="../pages/main.html" class="nav-item" data-page="main">
                    <span class="nav-icon">🏠</span>
                    <span>Main Chat</span>
                </a>
                
                <a href="../pages/dashboard.html" class="nav-item" data-page="dashboard">
                    <span class="nav-icon">📊</span>
                    <span>Dashboard</span>
                </a>
                
                <a href="../pages/profile.html" class="nav-item" data-page="profile">
                    <span class="nav-icon">👤</span>
                    <span>Profile</span>
                </a>
                
                <a href="../pages/setting.html" class="nav-item" data-page="settings">
                    <span class="nav-icon">⚙️</span>
                    <span>Settings</span>
                </a>
                
                <a href="../pages/about.html" class="nav-item" data-page="about">
                    <span class="nav-icon">ℹ️</span>
                    <span>About</span>
                </a>
            </nav>
            
            <div class="sidebar-footer">
                <div class="user-info" style="display: flex; align-items: center; gap: 12px; padding: 16px; background: linear-gradient(135deg, rgba(135, 206, 235, 0.2), rgba(0, 191, 255, 0.2)); border-radius: 12px;">
                    <div class="user-avatar" style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #87CEEB, #00BFFF); display: flex; align-items: center; justify-content: center; font-size: 24px; border: 3px solid #1E90FF;">👤</div>
                    <div class="user-details">
                        <strong style="color: #1E90FF;">Guest User</strong>
                        <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
                            <span style="width: 10px; height: 10px; background: #4ade80; border-radius: 50%;"></span>
                            <small style="color: #4ade80;">Online</small>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    `;
    
    // Highlight current page
    highlightCurrentPage();
    
    // Add click effects
    addClickEffects();
}

// Toggle sidebar function (global)
function toggleSidebar() {
    if (!sidebarManager) {
        sidebarManager = new SidebarManager();
        sidebarManager.init();
    }
    sidebarManager.toggle();
}

function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPath.includes(href.split('/').pop().replace('.html', ''))) {
            item.classList.add('active');
        }
        
        // Close sidebar when clicking a link (mobile)
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    if (sidebarManager) {
                        sidebarManager.close();
                    }
                }, 100);
            }
        });
    });
}

function addClickEffects() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked item
            item.classList.add('active');
        });
    });
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadSidebar, toggleSidebar, SidebarManager };
}

// Add CSS for menu toggle button
const menuToggleStyle = document.createElement('style');
menuToggleStyle.textContent = `
    .menu-toggle-btn {
        display: none;
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1001;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #00BFFF, #1E90FF);
        border: none;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 191, 255, 0.4);
        transition: all 0.3s ease;
        align-items: center;
        justify-content: center;
    }
    
    .menu-toggle-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(0, 191, 255, 0.5);
    }
    
    .menu-icon {
        font-size: 24px;
        color: white;
    }
    
    .close-sidebar-btn {
        width: 36px;
        height: 36px;
        background: rgba(135, 206, 235, 0.2);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 18px;
        color: #1E90FF;
        transition: all 0.3s ease;
    }
    
    .close-sidebar-btn:hover {
        background: rgba(135, 206, 235, 0.3);
        transform: scale(1.1);
    }
    
    @media (max-width: 768px) {
        .menu-toggle-btn {
            display: flex;
        }
    }
`;
document.head.appendChild(menuToggleStyle);
