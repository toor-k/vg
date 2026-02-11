/* ===============================================
   VALENTINE'S DAY TERMINAL - ENHANCED VERSION
   =============================================== */

// ====================================
// CONFIGURATION - Easy to Edit
// ====================================
const CONFIG = {
    questions: [
        {
            id: 1,
            challenge: "[Challenge 1: Connection Origin Verification]",
            question: "Enter the exact location where we first met:",
            answer: "bottled",
            errorMessage: "Access Denied. Invalid origin key."
        },
        {
            id: 2,
            challenge: "[Challenge 2: Personal Preference Authentication]",
            question: "What is my favorite color?",
            answer: "blue",
            errorMessage: "Access Denied. Preference mismatch detected."
        },
        {
            id: 3,
            challenge: "[Challenge 3: Date Format Validation Required]",
            question: "Enter my birthday in the exact format DD/MM:",
            answer: "24/05",
            errorMessage: "Access Denied. Date format incorrect."
        },
        {
            id: 4,
            challenge: "[Challenge 4: Measurement Authentication]",
            question: "How big is it approx?",
            answer: "20",
            errorMessage: "Access Denied. Size parameter invalid."
        }
    ],
    typingSpeed: 30, // milliseconds per character
    lineDelay: 500, // delay between lines
    soundEnabled: true // Enable/disable sound effects
};

// ====================================
// STATE MANAGEMENT
// ====================================
const state = {
    currentQuestion: 0,
    isTyping: false,
    terminalContent: null,
    userInput: null,
    inputLine: null,
    audioContext: null,
    sounds: {}
};

// ====================================
// AUDIO CONTEXT & SOUND GENERATION
// ====================================
function initializeAudio() {
    try {
        // Create audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        state.audioContext = new AudioContext();
        
        // Generate sound effects
        state.sounds = {
            success: createSuccessSound(),
            error: createErrorSound(),
            typing: createTypingSound(),
            celebration: createCelebrationSound()
        };
    } catch (e) {
        console.log('Audio not supported, continuing without sound');
        CONFIG.soundEnabled = false;
    }
}

// Create success beep sound
function createSuccessSound() {
    return () => {
        if (!CONFIG.soundEnabled || !state.audioContext) return;
        
        const ctx = state.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
    };
}

// Create error sound
function createErrorSound() {
    return () => {
        if (!CONFIG.soundEnabled || !state.audioContext) return;
        
        const ctx = state.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    };
}

// Create subtle typing sound (disabled by default)
function createTypingSound() {
    return () => {
        // Typing sound disabled - was too distracting
        return;
    };
}

// Create celebration chime sound
function createCelebrationSound() {
    return () => {
        if (!CONFIG.soundEnabled || !state.audioContext) return;
        
        const ctx = state.audioContext;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
        
        notes.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            const startTime = ctx.currentTime + (index * 0.15);
            oscillator.frequency.setValueAtTime(freq, startTime);
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.05, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });
    };
}

// ====================================
// DOM ELEMENTS
// ====================================
function initializeElements() {
    state.terminalContent = document.getElementById('terminal-content');
    state.userInput = document.getElementById('user-input');
    state.inputLine = document.getElementById('input-line');
    
    // Add event listener for user input
    state.userInput.addEventListener('keypress', handleUserInput);
    
    // Ensure audio context is resumed on first user interaction
    document.addEventListener('click', () => {
        if (state.audioContext && state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }
    }, { once: true });
}

// ====================================
// TYPING ANIMATION
// ====================================
function typeText(text, className = 'system-message', delay = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = `terminal-line ${className}`;
            state.terminalContent.appendChild(line);
            
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (charIndex < text.length) {
                    line.textContent += text[charIndex];
                    charIndex++;
                    
                    // Auto-scroll to bottom
                    state.terminalContent.scrollTop = state.terminalContent.scrollHeight;
                } else {
                    clearInterval(typeInterval);
                    resolve();
                }
            }, CONFIG.typingSpeed);
        }, delay);
    });
}

// ====================================
// SOUND EFFECTS
// ====================================
function playSuccessSound() {
    if (state.sounds.success) {
        state.sounds.success();
    }
}

function playErrorSound() {
    if (state.sounds.error) {
        state.sounds.error();
    }
}

function playCelebrationSound() {
    if (state.sounds.celebration) {
        state.sounds.celebration();
    }
}

// ====================================
// INITIALIZATION SEQUENCE
// ====================================
async function startTerminal() {
    await typeText("INITIALIZING HEART ACCESS TERMINAL...");
    await typeText("Establishing secure connection...", 'system-message', CONFIG.lineDelay);
    await typeText("Connection established.", 'system-message', CONFIG.lineDelay);
    await typeText("", 'system-message', CONFIG.lineDelay);
    await typeText("================================================", 'system-message', CONFIG.lineDelay);
    await typeText("  RESTRICTED ACCESS - AUTHENTICATION REQUIRED  ", 'system-message', 100);
    await typeText("================================================", 'system-message', 100);
    await typeText("", 'system-message', CONFIG.lineDelay);
    await typeText(`To access this heart, you must pass ${CONFIG.questions.length} security challenges.`, 'system-message', CONFIG.lineDelay);
    await typeText("", 'system-message', CONFIG.lineDelay);
    
    // Start first question
    await askQuestion(0);
}

// ====================================
// QUESTION HANDLING
// ====================================
async function askQuestion(questionIndex) {
    state.currentQuestion = questionIndex;
    const question = CONFIG.questions[questionIndex];
    
    await typeText(question.challenge, 'challenge-text', CONFIG.lineDelay);
    await typeText(`> ${question.question}`, 'system-message', CONFIG.lineDelay);
    
    // Show input line
    state.inputLine.classList.add('active');
    state.userInput.focus();
}

// ====================================
// INPUT VALIDATION
// ====================================
function handleUserInput(event) {
    if (event.key === 'Enter') {
        const userAnswer = state.userInput.value.trim().toLowerCase();
        const currentAnswer = state.userInput.value; // Keep original for display
        const question = CONFIG.questions[state.currentQuestion];
        
        // Display user's input in terminal
        const userLine = document.createElement('div');
        userLine.className = 'terminal-line system-message';
        userLine.textContent = `> ${currentAnswer}`;
        state.terminalContent.appendChild(userLine);
        
        // Auto-scroll
        state.terminalContent.scrollTop = state.terminalContent.scrollHeight;
        
        // Clear input
        state.userInput.value = '';
        
        // Hide input line temporarily
        state.inputLine.classList.remove('active');
        
        // Validate answer
        if (userAnswer === question.answer.toLowerCase()) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer(question.errorMessage);
        }
    }
}

// ====================================
// ANSWER HANDLING
// ====================================
async function handleCorrectAnswer() {
    playSuccessSound();
    
    await typeText("Access Granted.", 'success-message', CONFIG.lineDelay);
    await typeText("", 'system-message', CONFIG.lineDelay);
    
    // Check if all questions are completed
    if (state.currentQuestion < CONFIG.questions.length - 1) {
        // Move to next question
        await askQuestion(state.currentQuestion + 1);
    } else {
        // All questions completed - start celebration
        await startCelebrationSequence();
    }
}

async function handleIncorrectAnswer(errorMessage) {
    playErrorSound();
    
    await typeText(errorMessage, 'error-message', CONFIG.lineDelay);
    await typeText("Please try again.", 'system-message', CONFIG.lineDelay);
    await typeText("", 'system-message', CONFIG.lineDelay);
    
    // Re-ask the same question
    const question = CONFIG.questions[state.currentQuestion];
    await typeText(`> ${question.question}`, 'system-message', CONFIG.lineDelay);
    
    // Show input line again
    state.inputLine.classList.add('active');
    state.userInput.focus();
}

// ====================================
// CELEBRATION SEQUENCE
// ====================================
async function startCelebrationSequence() {
    // Loading sequence
    await typeText("", 'system-message', CONFIG.lineDelay);
    await typeText("Verifying...", 'loading-message', CONFIG.lineDelay);
    await typeText("Matching encrypted records...", 'loading-message', CONFIG.lineDelay);
    await typeText("Decrypting heart_core.sys...", 'loading-message', CONFIG.lineDelay);
    await new Promise(resolve => setTimeout(resolve, 800));
    await typeText("Root access granted.", 'success-message', CONFIG.lineDelay);
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Glitch effect
    const terminal = document.getElementById('terminal-container');
    terminal.classList.add('glitch');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    terminal.classList.remove('glitch');
    
    // Fade out terminal
    terminal.classList.add('fade-out');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Hide terminal
    terminal.style.display = 'none';
    
    // Start celebration animations
    startCelebrationAnimations();
    
    // Play celebration sound
    playCelebrationSound();
    
    // Show final message
    await new Promise(resolve => setTimeout(resolve, 500));
    const finalMessage = document.getElementById('final-message');
    finalMessage.classList.remove('hidden');
}

// ====================================
// CELEBRATION ANIMATIONS
// ====================================
function startCelebrationAnimations() {
    const canvas = document.getElementById('celebration-canvas');
    canvas.classList.remove('hidden');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle arrays
    const fireworks = [];
    const hearts = [];
    const flowers = [];
    
    // ====================================
    // FIREWORK CLASS
    // ====================================
    class Firework {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.particles = [];
            this.exploded = false;
            this.vy = -8 - Math.random() * 4;
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
            
            // Create explosion particles
            for (let i = 0; i < 50; i++) {
                const angle = (Math.PI * 2 * i) / 50;
                const velocity = 2 + Math.random() * 3;
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity,
                    alpha: 1,
                    color: this.color
                });
            }
        }
        
        update() {
            if (!this.exploded) {
                this.y += this.vy;
                this.vy += 0.2;
                
                if (this.vy >= 0) {
                    this.exploded = true;
                }
            } else {
                this.particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.1;
                    p.alpha -= 0.01;
                });
            }
        }
        
        draw(ctx) {
            if (!this.exploded) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            } else {
                this.particles.forEach(p => {
                    if (p.alpha > 0) {
                        ctx.globalAlpha = p.alpha;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                        ctx.fillStyle = p.color;
                        ctx.fill();
                    }
                });
                ctx.globalAlpha = 1;
            }
        }
        
        isDone() {
            return this.exploded && this.particles.every(p => p.alpha <= 0);
        }
    }
    
    // ====================================
    // HEART CLASS
    // ====================================
    class Heart {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = 10 + Math.random() * 20;
            this.vy = -1 - Math.random() * 2;
            this.vx = (Math.random() - 0.5) * 2;
            this.alpha = 0.6 + Math.random() * 0.4;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
            this.color = Math.random() > 0.5 ? '#ff1744' : '#ff69b4';
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            this.alpha -= 0.003;
        }
        
        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            
            // Draw heart shape
            ctx.beginPath();
            const x = 0;
            const y = 0;
            const size = this.size;
            
            ctx.moveTo(x, y + size / 4);
            ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x - size / 2, y + size / 4);
            ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size, x, y + size);
            ctx.bezierCurveTo(x, y + size, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
            ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
            
            ctx.fill();
            ctx.restore();
        }
        
        isDone() {
            return this.alpha <= 0 || this.y < -50;
        }
    }
    
    // ====================================
    // FLOWER CLASS
    // ====================================
    class Flower {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -50;
            this.size = 15 + Math.random() * 25;
            this.vy = 0.5 + Math.random() * 1.5;
            this.vx = (Math.random() - 0.5) * 1;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.1;
            this.alpha = 0.7 + Math.random() * 0.3;
            this.petalColor = `hsl(${Math.random() * 60 + 300}, 100%, 70%)`;
            this.centerColor = '#ffeb3b';
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height + 50) {
                this.alpha -= 0.02;
            }
        }
        
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Draw petals
            for (let i = 0; i < 6; i++) {
                ctx.save();
                ctx.rotate((Math.PI * 2 * i) / 6);
                ctx.beginPath();
                ctx.ellipse(0, -this.size / 2, this.size / 3, this.size / 2, 0, 0, Math.PI * 2);
                ctx.fillStyle = this.petalColor;
                ctx.fill();
                ctx.restore();
            }
            
            // Draw center
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
            ctx.fillStyle = this.centerColor;
            ctx.fill();
            
            ctx.restore();
        }
        
        isDone() {
            return this.alpha <= 0;
        }
    }
    
    // ====================================
    // ANIMATION LOOP
    // ====================================
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Spawn fireworks
        if (Math.random() < 0.05 && fireworks.length < 5) {
            fireworks.push(new Firework(
                Math.random() * canvas.width,
                canvas.height
            ));
        }
        
        // Spawn hearts
        if (Math.random() < 0.15) {
            hearts.push(new Heart());
        }
        
        // Spawn flowers
        if (Math.random() < 0.05) {
            flowers.push(new Flower());
        }
        
        // Update and draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw(ctx);
            if (fireworks[i].isDone()) {
                fireworks.splice(i, 1);
            }
        }
        
        // Update and draw hearts
        for (let i = hearts.length - 1; i >= 0; i--) {
            hearts[i].update();
            hearts[i].draw(ctx);
            if (hearts[i].isDone()) {
                hearts.splice(i, 1);
            }
        }
        
        // Update and draw flowers
        for (let i = flowers.length - 1; i >= 0; i--) {
            flowers[i].update();
            flowers[i].draw(ctx);
            if (flowers[i].isDone()) {
                flowers.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ====================================
// INITIALIZE APPLICATION
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    initializeAudio();
    initializeElements();
    startTerminal();
});