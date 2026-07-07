/**
 * Simple Client-Side Router
 * Handle navigation between pages
 */

class Router {
    constructor() {
        this.routes = [];
        this.currentRoute = null;
        this.init();
    }
    
    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
        
        // Handle initial route
        this.handleRoute();
    }
    
    addRoute(path, handler) {
        this.routes.push({ path, handler });
    }
    
    navigate(path, replace = false) {
        if (replace) {
            history.replaceState(null, '', path);
        } else {
            history.pushState(null, '', path);
        }
        this.handleRoute();
    }
    
    handleRoute() {
        const path = window.location.pathname;
        
        // Find matching route
        const route = this.routes.find(r => r.path === path);
        
        if (route) {
            this.currentRoute = path;
            route.handler();
        } else {
            // 404 handling
            this.handle404();
        }
    }
    
    handle404() {
        console.error('Page not found:', window.location.pathname);
        // Could redirect to a 404 page or show error
    }
    
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    getQueryParams() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    }
}

// Page navigation functions
function navigateTo(page) {
    const pages = {
        main: '../pages/main.html',
        dashboard: '../pages/dashboard.html',
        profile: '../pages/profile.html',
        settings: '../pages/setting.html',
        about: '../pages/about.html'
    };
    
    if (pages[page]) {
        window.location.href = pages[page];
    }
}

function goBack() {
    window.history.back();
}

function refreshPage() {
    window.location.reload();
}

// Export
const router = new Router();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Router, router, navigateTo, goBack, refreshPage };
}
