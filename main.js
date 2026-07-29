const mobileMenu = document.querySelector('#mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.08 });

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => revealObserver.observe(el));

const UIsections = document.querySelectorAll('section');
const navbarItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let activeSectionId = '';
    UIsections.forEach(section => {
        const topBound = section.offsetTop;
        const totalHeight = section.clientHeight;
        if (window.pageYOffset >= (topBound - totalHeight / 3)) {
            activeSectionId = section.getAttribute('id');
        }
    });

    navbarItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(activeSectionId)) {
            item.classList.add('active');
        }
    });
});






// --- NEW: Interactive Canvas Particle Background System ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 80; // Adjust for density

// Track mouse position coordinates for interaction
const mouse = {
    x: null,
    y: null,
    radius: 150 // Distance around mouse where lines will connect
};

// Listeners to track window resizing and pointer movements
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Resize canvas properly initially
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Individual Particle Blueprints
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Particle node sizing
        this.speedX = (Math.random() * 1) - 0.5; // X axis drift speed
        this.speedY = (Math.random() * 1) - 0.5; // Y axis drift speed
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce mechanics when hitting edge bounds
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }

    draw() {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)'; // Matches your accent blue color variable
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Populate the system array
function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Connect closer points via dynamic lines drawing math
function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Web constellation lines linkage rules
            if (distance < 110) {
                opacityValue = 1 - (distance / 110);
                ctx.strokeStyle = `rgba(56, 189, 248, ${opacityValue * 0.15})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }

        // Interactive mouse linkage rules
        if (mouse.x && mouse.y) {
            let mdx = particlesArray[a].x - mouse.x;
            let mdy = particlesArray[a].y - mouse.y;
            let mDistance = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDistance < mouse.radius) {
                opacityValue = 1 - (mDistance / mouse.radius);
                ctx.strokeStyle = `rgba(56, 189, 248, ${opacityValue * 0.25})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop execution pipeline
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

// Start the animation routine
initParticles();
animateParticles();
