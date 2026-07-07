/**
 * Three.js 3D Effects Component
 * Beautiful 3D animations for Chat Word
 */

// Simple 3D effect without Three.js dependency
class SkyAnimation {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.animationFrame = null;
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }
    
    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomSkyColor()
            });
        }
    }
    
    getRandomSkyColor() {
        const colors = [
            'rgba(135, 206, 235, ',  // Sky blue
            'rgba(0, 191, 255, ',    // Deep sky blue
            'rgba(176, 224, 230, ',   // Powder blue
            'rgba(135, 206, 250, '    // Light sky blue
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + particle.opacity + ')';
            this.ctx.fill();
            
            // Draw glow effect
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + (particle.opacity * 0.2) + ')';
            this.ctx.fill();
        });
        
        // Draw connections between close particles
        this.drawConnections();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        const maxDistance = 150;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(135, 206, 235, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Floating clouds effect
class CloudEffect {
    constructor(container) {
        this.container = container;
        this.clouds = [];
        this.init();
    }
    
    init() {
        for (let i = 0; i < 5; i++) {
            this.createCloud(i * 3);
        }
    }
    
    createCloud(delay) {
        const cloud = document.createElement('div');
        cloud.className = 'floating-cloud';
        cloud.style.cssText = `
            position: fixed;
            top: ${Math.random() * 100}%;
            left: -200px;
            width: ${Math.random() * 150 + 100}px;
            height: ${Math.random() * 60 + 40}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            filter: blur(8px);
            animation: floatCloud ${20 + Math.random() * 10}s linear infinite;
            animation-delay: ${delay}s;
            pointer-events: none;
            z-index: -1;
        `;
        
        this.container.appendChild(cloud);
        this.clouds.push(cloud);
    }
}

// Wave effect
class WaveEffect {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            amplitude: options.amplitude || 20,
            frequency: options.frequency || 0.02,
            speed: options.speed || 0.05,
            color: options.color || 'rgba(135, 206, 235, 0.3)',
            ...options
        };
        this.offset = 0;
        this.animationFrame = null;
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = 100;
        this.canvas.style.position = 'fixed';
        this.canvas.style.bottom = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);
        
        for (let x = 0; x < this.canvas.width; x++) {
            const y = Math.sin(x * this.options.frequency + this.offset) * this.options.amplitude +
                     Math.sin(x * this.options.frequency * 2 + this.offset * 2) * (this.options.amplitude / 2);
            
            this.ctx.lineTo(x, this.canvas.height / 2 + y);
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.closePath();
        this.ctx.fillStyle = this.options.color;
        this.ctx.fill();
        
        this.offset += this.options.speed;
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize effects
function initThreeDEffects() {
    const container = document.body;
    
    // Uncomment to enable effects
    // new SkyAnimation(container);
    // new CloudEffect(container);
    // new WaveEffect(container);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SkyAnimation,
        CloudEffect,
        WaveEffect,
        initThreeDEffects
    };
}
