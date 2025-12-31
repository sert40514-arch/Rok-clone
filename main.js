/**
 * ROK CLONE - ALL-IN-ONE ENGINE ARCHITECTURE
 * Role: Senior Frontend Architect
 */

// 1. UTILS & CONSTANTS
const CONFIG = {
    GRID_SIZE: 50,
    COLORS: {
        bg: '#0f0f0f',
        grid: 'rgba(255, 255, 255, 0.03)',
        unit: '#3b82f6',
        selected: '#fbbf24'
    }
};

// 2. ENTITY SYSTEM (Birimler ve Binalar)
class Entity {
    constructor(id, x, y, type) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.type = type;
        this.targetX = x;
        this.targetY = y;
        this.isSelected = false;
        this.speed = 2;
    }

    update() {
        // Yumuşak Hareket (Linear Interpolation)
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
    }

    draw(ctx, camera) {
        const screenX = this.x + camera.x;
        const screenY = this.y + camera.y;

        ctx.beginPath();
        ctx.arc(screenX, screenY, 15, 0, Math.PI * 2);
        ctx.fillStyle = this.isSelected ? CONFIG.COLORS.selected : CONFIG.COLORS.unit;
        ctx.fill();
        
        if (this.isSelected) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

// 3. CORE ENGINE
class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.entities = [];
        this.camera = { x: 0, y: 0, isDragging: false, lastX: 0, lastY: 0 };
        
        this.init();
    }

    init() {
        this.resize();
        this.setupEventListeners();
        
        // Örnek Birimler Ekle
        for(let i=0; i<5; i++) {
            this.entities.push(new Entity(i, Math.random()*500, Math.random()*500, 'soldier'));
        }
        
        this.loop(0);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        // Mouse/Touch Kontrolleri
        this.canvas.addEventListener('mousedown', e => {
            this.camera.isDragging = true;
            this.camera.lastX = e.clientX;
            this.camera.lastY = e.clientY;
            
            this.handleSelection(e.clientX, e.clientY);
        });

        window.addEventListener('mousemove', e => {
            if (this.camera.isDragging) {
                const dx = e.clientX - this.camera.lastX;
                const dy = e.clientY - this.camera.lastY;
                this.camera.x += dx;
                this.camera.y += dy;
                this.camera.lastX = e.clientX;
                this.camera.lastY = e.clientY;
            }
        });

        window.addEventListener('mouseup', () => this.camera.isDragging = false);

        // Sağ Tık - Hareket Emri
        this.canvas.addEventListener('contextmenu', e => {
            e.preventDefault();
            const worldX = e.clientX - this.camera.x;
            const worldY = e.clientY - this.camera.y;
            
            this.entities.forEach(ent => {
                if (ent.isSelected) {
                    ent.targetX = worldX;
                    ent.targetY = worldY;
                }
            });
        });
    }

    handleSelection(mouseX, mouseY) {
        const worldX = mouseX - this.camera.x;
        const worldY = mouseY - this.camera.y;
        
        this.entities.forEach(ent => {
            const dist = Math.sqrt((ent.x - worldX)**2 + (ent.y - worldY)**2);
            ent.isSelected = dist < 20;
        });
    }

    drawGrid() {
        this.ctx.strokeStyle = CONFIG.COLORS.grid;
        this.ctx.lineWidth = 1;
        
        const offsetX = this.camera.x % CONFIG.GRID_SIZE;
        const offsetY = this.camera.y % CONFIG.GRID_SIZE;

        for (let x = offsetX; x < this.canvas.width; x += CONFIG.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = offsetY; y < this.canvas.height; y += CONFIG.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    update() {
        this.entities.forEach(ent => ent.update());
    }

    render() {
        // Arka Plan
        this.ctx.fillStyle = CONFIG.COLORS.bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGrid();
        
        // Birimler
        this.entities.forEach(ent => ent.draw(this.ctx, this.camera));
        
        // UI Bilgisi (Mini HUD)
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`CAMERA: ${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}`, 20, 30);
        this.ctx.fillText(`ENTITIES: ${this.entities.length}`, 20, 50);
    }

    loop(time) {
        this.update();
        this.render();
        requestAnimationFrame((t) => this.loop(t));
    }
}

// 4. BOOTSTRAP
const App = new GameEngine('gameCanvas');
