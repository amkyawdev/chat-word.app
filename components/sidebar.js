/**
 * Sidebar Component
 * Navigation sidebar for Chat Word application
 */

function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;
    
    sidebarContainer.innerHTML = `
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2 style="color: #1E90FF; font-size: 24px; margin-bottom: 5px;">💬 Chat Word</h2>
                <small style="color: #666;">v1.0.0</small>
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
                <div class="user-info">
                    <div class="user-avatar">👤</div>
                    <div class="user-details">
                        <strong>Guest User</strong>
                        <small>🟢 Online</small>
                    </div>
                </div>
            </div>
        </aside>
    `;
    
    // Highlight current page
    highlightCurrentPage();
    
    // Add hover effects
    addHoverEffects();
}

function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPath.includes(href.split('/').pop().replace('.html', ''))) {
            item.classList.add('active');
        }
    });
}

function addHoverEffects() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
            item.style.background = 'rgba(135, 206, 235, 0.2)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
            if (!item.classList.contains('active')) {
                item.style.background = 'transparent';
            }
        });
    });
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadSidebar };
}
