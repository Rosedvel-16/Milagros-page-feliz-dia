// ============================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ============================================

let noButtonClicks = 0;
let acceptanceTime = null;
let counterInterval = null;
const envelopesOpened = [false, false, false, false];
let musicPlaying = false;
let heartbeatsCounter = 0;

// ============================================
// 1. INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    checkAcceptanceStatus();
    
    setTimeout(() => {
        hideLoadingScreen();
        createParticles();
        setupScrollAnimations();
        setupProgressBar();
        typeQuestion();
    }, 2000);
});

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progress = document.getElementById('loading-progress');
    
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        } else {
            width++;
            progress.style.width = width + '%';
        }
    }, 20);
}

function checkAcceptanceStatus() {
    const accepted = localStorage.getItem('proposalAccepted');
    const acceptanceDate = localStorage.getItem('acceptanceDate');
    
    if (accepted === 'true' && acceptanceDate) {
        acceptanceTime = new Date(acceptanceDate);
        
        document.getElementById('question-section').style.display = 'none';
        const celebration = document.getElementById('celebration-section');
        celebration.classList.remove('hidden');
        celebration.classList.add('show');
        
        startLoveCounter();
        
        setTimeout(() => {
            celebration.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }
}

// ============================================
// 2. PARTÍCULAS Y ANIMACIONES DE FONDO
// ============================================

function createParticles() {
    const container = document.getElementById('particles');
    const particleTypes = ['💕', '💗', '💖', '💘', '✨', '🌟', '💝', '💓'];
    
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.fontSize = (Math.random() * 15 + 10) + 'px';
        particle.style.opacity = Math.random() * 0.6 + 0.2;
        container.appendChild(particle);
    }
}

// Barra de progreso de scroll
function setupProgressBar() {
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        document.getElementById('progress-bar').style.width = scrolled + '%';
    });
}

// ============================================
// 3. OBSERVADOR DE SCROLL
// ============================================

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animaciones especiales por sección
                if (entry.target.classList.contains('reason-card')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.style.opacity = '1';
                    }, 100);
                }
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observar elementos
    document.querySelectorAll('.envelope-wrapper, .question-section, .intro-content, .reason-card, .love-quote').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// 4. EFECTO DE ESCRITURA
// ============================================

function typeQuestion() {
    const question = "¿Quieres ser mi novia?";
    const element = document.getElementById('big-question');
    let index = 0;
    
    element.innerHTML = '';

    const interval = setInterval(() => {
        if (index < question.length) {
            element.textContent += question[index];
            
            // Efecto de sonido de escritura (visual)
            element.style.transform = 'scale(1.02)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 50);
            
            index++;
        } else {
            clearInterval(interval);
            document.getElementById('buttons-container').classList.add('show');
            
            // Pulso en el botón SÍ
            const btnYes = document.querySelector('.btn-yes');
            btnYes.style.animation = 'pulseButton 1.5s infinite';
        }
    }, 120);
}

// ============================================
// 5. SISTEMA DE SOBRES Y FOTOS
// ============================================

function openEnvelope(index, photoSrc, message, title) {
    const envelopeElement = document.querySelectorAll('.envelope')[index];
    const wrapper = document.querySelectorAll('.envelope-wrapper')[index];
    
    if (!envelopesOpened[index]) {
        // Marcar como abierto
        envelopesOpened[index] = true;
        envelopeElement.classList.add('opened');
        wrapper.classList.add('revealed');
        
        // Actualizar contador
        updateMemoriesCounter();
        
        // Crear corazones al abrir
        createMiniHearts(envelopeElement);
        
        // Vibración (si está disponible)
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        
        // Mostrar foto después de animación
        setTimeout(() => {
            showPhoto(photoSrc, message, title);
        }, 1000);
    } else {
        // Si ya fue abierto, solo mostrar la foto
        showPhoto(photoSrc, message, title);
    }
}

function updateMemoriesCounter() {
    const count = envelopesOpened.filter(opened => opened).length;
    document.getElementById('opened-count').textContent = count;
    
    // Animación del contador
    const counter = document.querySelector('.memories-counter');
    counter.style.transform = 'scale(1.2)';
    setTimeout(() => {
        counter.style.transform = 'scale(1)';
    }, 300);
    
    // Si abrió todos
    if (count === 4) {
        setTimeout(() => {
            createHeartExplosion();
            showNotification('¡Has descubierto todos nuestros momentos especiales! 💕');
        }, 500);
    }
}

function showPhoto(src, message, title) {
    const modal = document.getElementById('photo-modal');
    const image = document.getElementById('modal-image');
    const text = document.getElementById('modal-message');
    const titleElement = document.getElementById('modal-title');
    
    image.src = src;
    text.textContent = message;
    titleElement.textContent = title;
    
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
}

function closePhoto() {
    const modal = document.getElementById('photo-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300);
}

function createMiniHearts(element) {
    const hearts = ['💕', '💗', '💖', '💝', '💓'];
    
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'mini-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            
            const angle = (Math.PI * 2 * i) / 12;
            const distance = 50 + Math.random() * 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            heart.style.setProperty('--tx', x + 'px');
            heart.style.setProperty('--ty', y + 'px');
            heart.style.left = '50%';
            heart.style.top = '50%';
            
            element.appendChild(heart);
            setTimeout(() => heart.remove(), 2000);
        }, i * 80);
    }
}

// ============================================
// 6. MANEJO DE RESPUESTAS
// ============================================

function handleAnswer(answer) {
    if (answer === 'yes') {
        acceptProposal();
    } else {
        handleNo();
    }
}

function handleNo() {
    noButtonClicks++;
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.querySelector('.btn-yes');
    const hintText = document.getElementById('hint-text');
    
    const messages = [
        "Piénsalo bien... mi corazón late solo por ti 🥺💕",
        "¿Segura? Prometo hacerte la más feliz del mundo 😊❤️",
        "Dale una oportunidad a nuestro amor... 💭💖",
        "El botón de SÍ brilla más, ¿lo notas? ✨💝",
        "Mi corazón no aguanta más... di que sí 🙏💗",
        "¡Venga ya! Sabes que quieres 😏💕",
        "Este es tu momento... elige el amor ❤️",
        "Última oportunidad... el SÍ te espera 💘"
    ];
    
    if (noButtonClicks <= messages.length) {
        // Cambiar mensaje
        hintText.textContent = messages[noButtonClicks - 1];
        hintText.style.color = '#ff1493';
        hintText.style.fontSize = (1 + noButtonClicks * 0.1) + 'rem';
        hintText.style.fontWeight = '600';
        
        // Hacer el botón NO más pequeño y moverlo
        const newSize = Math.max(30, 100 - (noButtonClicks * 12));
        const randomX = (Math.random() - 0.5) * 150;
        const randomY = (Math.random() - 0.5) * 100;
        
        btnNo.style.transform = `scale(${newSize / 100}) translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 20 - 10}deg)`;
        btnNo.style.opacity = Math.max(0.3, 1 - (noButtonClicks * 0.1));
        
        // Hacer el botón SÍ más grande y atractivo
        const yesSize = 1 + (noButtonClicks * 0.18);
        btnYes.style.transform = `scale(${yesSize})`;
        btnYes.style.boxShadow = `0 0 ${30 + noButtonClicks * 10}px rgba(255, 20, 147, ${0.6 + noButtonClicks * 0.1})`;
        
        // Vibración
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Después de muchos intentos, ocultar NO
        if (noButtonClicks >= 8) {
            btnNo.style.display = 'none';
            hintText.textContent = "Solo queda el camino del amor... 💕";
            hintText.style.color = '#ff69b4';
            
            // Hacer el SÍ aún más evidente
            btnYes.style.transform = 'scale(1.5)';
            btnYes.style.animation = 'superPulse 1s infinite';
        }
    }
}

function acceptProposal() {
    // Guardar en localStorage
    acceptanceTime = new Date();
    localStorage.setItem('proposalAccepted', 'true');
    localStorage.setItem('acceptanceDate', acceptanceTime.toISOString());
    
    // Ocultar sección de pregunta con animación
    const questionSection = document.getElementById('question-section');
    questionSection.style.transform = 'scale(0.8)';
    questionSection.style.opacity = '0';
    
    setTimeout(() => {
        questionSection.style.display = 'none';
        
        // Mostrar celebración
        const celebration = document.getElementById('celebration-section');
        celebration.classList.remove('hidden');
        setTimeout(() => {
            celebration.classList.add('show');
        }, 100);
        
        // Iniciar contador
        startLoveCounter();
        
        // Efectos especiales
        launchConfetti();
        createHeartExplosion();
        createFireworks();
        
        // Vibración de celebración
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }
        
        // Scroll suave a la celebración
        setTimeout(() => {
            celebration.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 800);
        
        // Iniciar conteo de latidos
        startHeartbeatsCounter();
        
    }, 600);
}

// ============================================
// 7. CONTADOR DE AMOR (CON PERSISTENCIA)
// ============================================

function startLoveCounter() {
    const dateElement = document.getElementById('counter-date-full');
    const displayElement = document.getElementById('counter-display');
    
    // Formato de fecha completo
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const formattedDate = acceptanceTime.toLocaleDateString('es-ES', options);
    dateElement.innerHTML = `<span class="highlight-date">📅 ${formattedDate}</span>`;
    
    // Actualizar contador cada segundo
    updateCounter();
    counterInterval = setInterval(updateCounter, 1000);
}

function updateCounter() {
    const now = new Date();
    const diff = now - acceptanceTime;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('counter-display').innerHTML = `
        <div class="time-unit">
            <span class="time-value">${String(days).padStart(2, '0')}</span>
            <span class="time-label">Días</span>
        </div>
        <div class="time-separator">:</div>
        <div class="time-unit">
            <span class="time-value">${String(hours).padStart(2, '0')}</span>
            <span class="time-label">Horas</span>
        </div>
        <div class="time-separator">:</div>
        <div class="time-unit">
            <span class="time-value">${String(minutes).padStart(2, '0')}</span>
            <span class="time-label">Minutos</span>
        </div>
        <div class="time-separator">:</div>
        <div class="time-unit">
            <span class="time-value">${String(seconds).padStart(2, '0')}</span>
            <span class="time-label">Segundos</span>
        </div>
    `;
}

// Contador de latidos
function startHeartbeatsCounter() {
    setInterval(() => {
        heartbeatsCounter += Math.floor(Math.random() * 3) + 1;
        document.getElementById('stat-heartbeats').textContent = heartbeatsCounter.toLocaleString();
    }, 1000);
}

// ============================================
// 8. EFECTOS ESPECIALES
// ============================================

function createHeartExplosion() {
    const colors = ['❤️', '💕', '💗', '💖', '💘', '💝', '💓', '💞'];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'explosion-heart';
            heart.textContent = colors[Math.floor(Math.random() * colors.length)];
            heart.style.left = centerX + 'px';
            heart.style.top = centerY + 'px';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            
            const angle = (Math.PI * 2 * i) / 40;
            const velocity = 150 + Math.random() * 250;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            heart.style.setProperty('--tx', tx + 'px');
            heart.style.setProperty('--ty', ty + 'px');
            
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }, i * 40);
    }
}

function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    
    const pieces = [];
    const colors = ['#ff1493', '#ff69b4', '#ff6b9d', '#ffc0cb', '#ff85a2', '#ff4757', '#ff1744', '#f50057'];
    const shapes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < 400; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 4 + 2,
            speedX: Math.random() * 3 - 1.5,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 8 - 4
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        pieces.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            
            // Dibujar diferentes formas
            if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.shape === 'square') {
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            } else {
                ctx.beginPath();
                ctx.moveTo(0, -p.size / 2);
                ctx.lineTo(p.size / 2, p.size / 2);
                ctx.lineTo(-p.size / 2, p.size / 2);
                ctx.closePath();
                ctx.fill();
            }
            
            ctx.restore();
            
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            
            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function createFireworks() {
    const fireworksContainer = document.querySelector('.celebration-fireworks');
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 50 + '%';
            fireworksContainer.appendChild(firework);
            
            setTimeout(() => firework.remove(), 1500);
        }, i * 400);
    }
}

// ============================================
// 9. MÚSICA DE FONDO
// ============================================

function toggleMusic() {
    const music = document.getElementById('background-music');
    const musicBtn = document.getElementById('music-toggle');
    const icon = musicBtn.querySelector('.music-icon');
    
    if (musicPlaying) {
        music.pause();
        icon.textContent = '🎵';
        musicBtn.classList.remove('playing');
        musicPlaying = false;
    } else {
        music.play();
        icon.textContent = '🎶';
        musicBtn.classList.add('playing');
        musicPlaying = true;
    }
}

// ============================================
// 10. NOTIFICACIONES
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span class="notification-icon">💕</span>
        <span class="notification-text">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// 11. EXTRAS
// ============================================

// Easter egg: doble click en el título
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.addEventListener('dblclick', () => {
            createHeartExplosion();
            showNotification('¡Encontraste un corazón secreto! 💖');
        });
    }
});

// Prevenir cierre accidental
window.addEventListener('beforeunload', (e) => {
    if (localStorage.getItem('proposalAccepted') === 'true') {
        e.preventDefault();
        e.returnValue = '';
    }
});
