// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Mobile detection
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0);
}

// Utility functions - must be defined early
function isPlayerRegistered() {
    const savedName = localStorage.getItem('cw_player_name');
    const savedEmail = localStorage.getItem('cw_player_email');
    
    console.log('Checking registration status:');
    console.log('- Name:', savedName);
    console.log('- Email:', savedEmail);
    
    const isRegistered = savedName && savedEmail && 
           savedName.trim() !== '' && savedEmail.trim() !== '' &&
           savedName.trim() !== 'null' && savedEmail.trim() !== 'null';
    
    console.log('- Is registered:', isRegistered);
    return isRegistered;
}

// Page navigation
let currentPage = 'register-page';

function showPage(pageId) {
    console.log('==== SHOWPAGE FUNCTION CALLED ====');
    console.log('Switching to page:', pageId);
    console.log('Current page before switch:', currentPage);
    
    // Hide all pages first
    const allPages = document.querySelectorAll('.page');
    console.log('Found', allPages.length, 'pages total');
    
    allPages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
        page.style.opacity = '0';
        page.style.transform = 'translateY(20px)';
        console.log('Hiding page:', page.id);
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        console.log('Target page found:', pageId);
        console.log('Target page classes before:', targetPage.classList.toString());
        
        // Force page activation
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        targetPage.style.opacity = '1';
        targetPage.style.transform = 'translateY(0)';
        
        // Update current page
        currentPage = pageId;
        
        console.log('Target page classes after:', targetPage.classList.toString());
        console.log('Successfully switched to:', pageId);
        console.log('Current page is now:', currentPage);
        
        // Force a repaint
        setTimeout(() => {
            targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
        
    } else {
        console.error('Page not found:', pageId);
        console.log('Available pages:', Array.from(document.querySelectorAll('.page')).map(p => p.id));
        
        // Fallback to hub page if target not found
        if (pageId !== 'hub-page') {
            console.log('Falling back to hub-page...');
            showPage('hub-page');
        }
    }
    
    console.log('==== SHOWPAGE FUNCTION COMPLETE ====');
}

// Difficulty system
let currentDifficulty = 'easy';
const difficultySettings = {
    easy: {
        clearFlowTarget: 512,
        puzzleLevels: 3,
        name: 'Easy Mode',
        color: '#4FCB53'
    },
    normal: {
        clearFlowTarget: 1024,
        puzzleLevels: 4,
        name: 'Normal Mode',
        color: '#2E9DF7'
    },
    hard: {
        clearFlowTarget: 2048,
        puzzleLevels: 5,
        name: 'Hard Mode',
        color: '#F5402C'
    }
};

// DOM manipulation effects
const domEffects = {
    createWaterDrops: function(count = 5) {
        for (let i = 0; i < count; i++) {
            const drop = document.createElement('div');
            drop.className = 'water-drop-effect';
            drop.innerHTML = '💧';
            drop.style.cssText = `
                position: fixed;
                font-size: 2rem;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * window.innerWidth}px;
                top: -50px;
                animation: dropFall 3s ease-in forwards;
            `;
            document.body.appendChild(drop);
            
            setTimeout(() => {
                if (drop.parentNode) {
                    drop.parentNode.removeChild(drop);
                }
            }, 3000);
        }
    },
    
    createCelebration: function() {
        const particles = ['🎉', '🌟', '💫', '✨', '🎊'];
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
            particle.style.cssText = `
                position: fixed;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                animation: celebrate 2s ease-out forwards;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }
};

// Simple sound system
const sounds = {
    audioContext: null,
    init: function() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    },
    
    click: function() {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Sound error:', e);
        }
    },
    
    success: function() {
        if (!this.audioContext) return;
        
        try {
            const notes = [523, 659, 784, 1047]; // C, E, G, C
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.2);
                }, index * 100);
            });
        } catch (e) {
            console.log('Sound error:', e);
        }
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    // DEBUG: Show current localStorage state
    console.log('Current localStorage state:');
    console.log('- cw_player_name:', localStorage.getItem('cw_player_name'));
    console.log('- cw_player_email:', localStorage.getItem('cw_player_email'));
    
    // Initialize sounds first
    sounds.init();
    
    // Adapt to current device
    adaptToDevice();
    
    // Initialize page system - this determines initial page
    initializePageSystem();
    
    // Adapt to current device
    adaptToDevice();
    
    // Initialize all other systems
    setTimeout(() => {
        initializeFormHandlers();
        initializeDifficultySystem();
        initializeGameButtons();
        initializeBackButtons();
        initializeResetButtons();
        updateProgress();
    }, 100);
});

// Initialize page system - ENFORCED authentication required
function initializePageSystem() {
    console.log('Initializing page system...');
    
    // ALWAYS clear all pages first to ensure clean state
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Check if player is already registered
    const savedName = localStorage.getItem('cw_player_name');
    const savedEmail = localStorage.getItem('cw_player_email');
    
    console.log('Saved name:', savedName);
    console.log('Saved email:', savedEmail);
    
    // Update debug info
    const debugDiv = document.getElementById('debug-registration');
    if (debugDiv) {
        debugDiv.innerHTML = `
            <strong>Registration Debug:</strong><br>
            Name: ${savedName || 'null'}<br>
            Email: ${savedEmail || 'null'}<br>
            Status: ${isPlayerRegistered() ? 'REGISTERED' : 'NOT REGISTERED'}
        `;
    }
    
    // Show mobile indicator if on mobile
    const mobileIndicator = document.getElementById('mobile-indicator');
    if (mobileIndicator && isMobileDevice()) {
        mobileIndicator.style.display = 'block';
    }
    
    // STRICT authentication check - both name and email must exist and be non-empty
    if (savedName && savedEmail && 
        savedName.trim() !== '' && savedEmail.trim() !== '' &&
        savedName.trim() !== 'null' && savedEmail.trim() !== 'null') {
        // Player is already registered, go to hub
        console.log('Player already registered, going to hub');
        showPage('hub-page');
        // Enable game buttons since user is registered
        enableGameButtons();
    } else {
        // Show registration page - ENFORCE registration
        console.log('No valid registration found, showing register page');
        localStorage.removeItem('cw_player_name'); // Clear any invalid data
        localStorage.removeItem('cw_player_email');
        showPage('register-page');
        // Ensure game buttons are disabled
        disableGameButtons();
    }
}

// Enable/disable game buttons based on authentication
function enableGameButtons() {
    const buttons = ['play-clear-flow', 'play-puzzle-pipeline'];
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    });
}

function disableGameButtons() {
    const buttons = ['play-clear-flow', 'play-puzzle-pipeline'];
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        }
    });
}

// Initialize form handlers - FIXED to ensure proper redirect
function initializeFormHandlers() {
    console.log('Initializing form handlers...');
    
    const playerForm = document.getElementById('player-form');
    if (!playerForm) {
        console.error('Player form not found!');
        return;
    }
    
    console.log('Player form found, adding event listener');
    
    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted');
        
        const submitBtn = playerForm.querySelector('button[type="submit"]');
        const nameField = document.getElementById('player-name');
        const emailField = document.getElementById('player-email');
        const originalText = submitBtn.textContent;
        
        const name = nameField.value.trim();
        const email = emailField.value.trim();
        
        console.log('Form data:', { name, email });
        
        // Simple validation
        if (!name) {
            alert('Please enter your name');
            nameField.focus();
            return;
        }
        
        if (name.length < 2) {
            alert('Name must be at least 2 characters');
            nameField.focus();
            return;
        }
        
        if (!email) {
            alert('Please enter your email');
            emailField.focus();
            return;
        }
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            emailField.focus();
            return;
        }
        
        console.log('Validation passed, proceeding with registration');
        
        // Add loading state
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;
        
        // Save to localStorage - ENSURE this happens
        try {
            localStorage.setItem('cw_player_name', name);
            localStorage.setItem('cw_player_email', email);
            console.log('Data saved to localStorage:', {
                name: localStorage.getItem('cw_player_name'),
                email: localStorage.getItem('cw_player_email')
            });
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            alert('Error saving your data. Please try again.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Create welcome effect
        domEffects.createWaterDrops(3);
        sounds.click();
        
        // Success feedback and redirect - FIXED timing and redirect
        setTimeout(() => {
            submitBtn.textContent = '✓ Welcome!';
            submitBtn.style.background = 'linear-gradient(135deg, #4FCB53, #4FCB53)';
            console.log('Redirecting to hub page...');
            
            setTimeout(() => {
                // Force redirect to hub page
                showPage('hub-page');
                // Enable game buttons since user is now registered
                enableGameButtons();
                
                // Reset form after successful registration
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    nameField.value = '';
                    emailField.value = '';
                }, 500);
            }, 1000); // Increased delay to ensure user sees success message
        }, 500);
    });
    
    // Add clear data button handler
    const clearDataBtn = document.getElementById('clear-data-btn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all saved data? This will reset your progress.')) {
                localStorage.removeItem('cw_player_name');
                localStorage.removeItem('cw_player_email');
                localStorage.removeItem('cw_clear_flow_completed');
                localStorage.removeItem('cw_puzzle_completed');
                alert('All data cleared! You can now register again.');
                showPage('register-page');
                disableGameButtons();
            }
        });
    }
    
    // Add test authentication button handler
    const testAuthBtn = document.getElementById('test-auth-btn');
    if (testAuthBtn) {
        testAuthBtn.addEventListener('click', () => {
            const isRegistered = isPlayerRegistered();
            alert(`Authentication Status: ${isRegistered ? 'REGISTERED' : 'NOT REGISTERED'}\n\nName: ${localStorage.getItem('cw_player_name') || 'None'}\nEmail: ${localStorage.getItem('cw_player_email') || 'None'}`);
        });
    }
    
    // Add test hard mode button handler
    const testHardModeBtn = document.getElementById('test-hard-mode-btn');
    if (testHardModeBtn) {
        testHardModeBtn.addEventListener('click', () => {
            // Auto-register for testing
            localStorage.setItem('cw_player_name', 'Test User');
            localStorage.setItem('cw_player_email', 'test@example.com');
            // Set to hard mode
            currentDifficulty = 'hard';
            // Go to hub and enable buttons
            showPage('hub-page');
            enableGameButtons();
            // Update difficulty display
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.difficulty === 'hard') {
                    btn.classList.add('active');
                }
            });
            updateDifficultyDisplays();
            alert('Hard mode test enabled! Now try playing Puzzle Pipeline.');
        });
    }
}

// Initialize difficulty system
function initializeDifficultySystem() {
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    if (difficultyButtons.length > 0) {
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                difficultyButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update current difficulty
                currentDifficulty = button.dataset.difficulty;
                
                // Update target displays
                updateDifficultyDisplays();
                
                sounds.click();
            });
        });
    }
}

// Initialize game buttons with authentication guards
function initializeGameButtons() {
    console.log('Initializing game buttons with authentication guards...');
    
    // Remove any existing event listeners first
    const clearFlowBtn = document.getElementById('play-clear-flow');
    const puzzlePipelineBtn = document.getElementById('play-puzzle-pipeline');
    
    if (clearFlowBtn) {
        // Clone node to remove all event listeners
        const newClearFlowBtn = clearFlowBtn.cloneNode(true);
        clearFlowBtn.parentNode.replaceChild(newClearFlowBtn, clearFlowBtn);
        
        newClearFlowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Clear Flow button clicked - checking authentication...');
            
            if (!isPlayerRegistered()) {
                console.log('Player not registered, blocking game access');
                alert('Please register first to play the game!');
                showPage('register-page');
                return;
            }
            
            console.log('Player authenticated, starting Clear Flow game');
            console.log('Navigating to clear-flow-page...');
            showPage('clear-flow-page');
            
            // Small delay to ensure page is shown before starting game
            setTimeout(() => {
                console.log('Starting Clear Flow game...');
                startClearFlowGame();
            }, 100);
            
            sounds.click();
        });
        console.log('Clear Flow button initialized successfully');
    } else {
        console.error('Clear Flow button not found!');
    }
    
    if (puzzlePipelineBtn) {
        // Clone node to remove all event listeners
        const newPuzzlePipelineBtn = puzzlePipelineBtn.cloneNode(true);
        puzzlePipelineBtn.parentNode.replaceChild(newPuzzlePipelineBtn, puzzlePipelineBtn);
        
        newPuzzlePipelineBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Puzzle Pipeline button clicked - checking authentication...');
            
            if (!isPlayerRegistered()) {
                console.log('Player not registered, blocking game access');
                alert('Please register first to play the game!');
                showPage('register-page');
                return;
            }
            
            console.log('Player authenticated, starting Puzzle Pipeline game');
            console.log('Current difficulty before starting:', currentDifficulty);
            console.log('Navigating to puzzle-pipeline-page...');
            showPage('puzzle-pipeline-page');
            
            // Small delay to ensure page is shown before starting game
            setTimeout(() => {
                console.log('Starting Puzzle Pipeline game...');
                startPuzzlePipelineGame();
            }, 100);
            
            sounds.click();
        });
        console.log('Puzzle Pipeline button initialized successfully');
    } else {
        console.error('Puzzle Pipeline button not found!');
    }
}

// Initialize back buttons with authentication guards
function initializeBackButtons() {
    const backButtons = ['cf-back', 'pp-back'];
    backButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            // Remove existing event listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Back button clicked:', buttonId);
                console.log('Current page before navigation:', currentPage);
                
                if (!isPlayerRegistered()) {
                    alert('Please register first!');
                    showPage('register-page');
                    return;
                }
                
                // Force navigation to hub page
                console.log('Navigating to hub-page...');
                showPage('hub-page');
                
                // Verify the page was changed
                setTimeout(() => {
                    console.log('Current page after navigation:', currentPage);
                    const hubPage = document.getElementById('hub-page');
                    if (hubPage) {
                        console.log('Hub page active class:', hubPage.classList.contains('active'));
                        if (!hubPage.classList.contains('active')) {
                            console.warn('Hub page not active, forcing activation...');
                            hubPage.classList.add('active');
                            hubPage.style.display = 'block';
                        }
                    }
                }, 100);
                
                sounds.click();
            });
            console.log('Back button initialized:', buttonId);
        } else {
            console.error('Back button not found:', buttonId);
        }
    });
}

// Initialize reset buttons
function initializeResetButtons() {
    const cfResetBtn = document.getElementById('cf-reset');
    if (cfResetBtn) {
        cfResetBtn.addEventListener('click', () => {
            console.log('Clear Flow reset clicked');
            startClearFlowGame();
            sounds.click();
        });
    }
    
    const ppResetBtn = document.getElementById('pp-reset');
    if (ppResetBtn) {
        ppResetBtn.addEventListener('click', () => {
            console.log('Puzzle Pipeline reset clicked');
            // Restart the entire puzzle pipeline game from level 1
            startPuzzlePipelineGame();
            sounds.click();
        });
    }
}

// Update difficulty displays
function updateDifficultyDisplays() {
    const setting = difficultySettings[currentDifficulty];
    
    // Update Clear Flow target with clearer messaging
    const cfTarget = document.getElementById('cf-target');
    const cfDifficulty = document.getElementById('cf-difficulty');
    const cfGoalInstruction = document.getElementById('cf-goal-instruction');
    
    if (cfTarget) cfTarget.textContent = setting.clearFlowTarget;
    if (cfDifficulty) cfDifficulty.textContent = setting.name;
    if (cfGoalInstruction) cfGoalInstruction.textContent = setting.clearFlowTarget;
    
    // Update Puzzle Pipeline difficulty
    const ppDifficulty = document.getElementById('pp-difficulty');
    if (ppDifficulty) ppDifficulty.textContent = setting.name;
}

// Update progress tracking
function updateProgress() {
    const progressText = document.getElementById('progress-text');
    const waterFill = document.getElementById('water-fill');
    
    if (progressText && waterFill) {
        const clearFlowCompleted = localStorage.getItem('cw_clear_flow_completed') === 'true' ? 1 : 0;
        const puzzleCompleted = localStorage.getItem('cw_puzzle_completed') === 'true' ? 1 : 0;
        const totalCompleted = clearFlowCompleted + puzzleCompleted;
        
        progressText.textContent = `Progress: ${totalCompleted}/2 games completed`;
        
        const percentage = (totalCompleted / 2) * 100;
        waterFill.style.height = percentage + '%';
    }
}

// Clear the Flow Game
let clearFlowBoard = [];
let clearFlowScore = 0;

function startClearFlowGame() {
    console.log('Starting Clear Flow game');
    clearFlowBoard = [];
    clearFlowScore = 0;
    
    updateDifficultyDisplays();
    initializeClearFlowBoard();
    addRandomTile();
    addRandomTile();
    updateClearFlowDisplay();
    
    // Remove any existing keyboard listeners to prevent duplicates
    document.removeEventListener('keydown', handleClearFlowKey);
    // Add keyboard controls for laptop users
    document.addEventListener('keydown', handleClearFlowKey);
    
    // Add mobile touch controls
    addClearFlowTouchControls();
}

function initializeClearFlowBoard() {
    clearFlowBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    
    const boardElement = document.getElementById('cf-board');
    if (boardElement) {
        boardElement.innerHTML = '';
        boardElement.className = 'cf-board';
        
        // Enhanced mobile centering - let CSS handle positioning
        if (isMobileDevice()) {
            console.log('Initializing Clear Flow for mobile with enhanced centering');
            // Remove any inline styles that might interfere with CSS centering
            boardElement.style.position = '';
            boardElement.style.left = '';
            boardElement.style.transform = '';
            boardElement.style.margin = '';
            // Let CSS handle all positioning
        }
        
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'cf-cell';
            cell.id = `cf-cell-${i}`;
            
            // Mobile optimizations for cells only
            if (isMobileDevice()) {
                cell.style.minHeight = '50px';
                cell.style.borderRadius = '6px';
                cell.style.fontSize = '1.5rem';
            }
            
            boardElement.appendChild(cell);
        }
    }
}

function addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (clearFlowBoard[i][j] === 0) {
                emptyCells.push({row: i, col: j});
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        clearFlowBoard[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateClearFlowDisplay() {
    // Update score
    const scoreElement = document.getElementById('cf-score');
    if (scoreElement) {
        scoreElement.textContent = clearFlowScore;
    }
    
    // Update board
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cellId = `cf-cell-${i * 4 + j}`;
            const cellElement = document.getElementById(cellId);
            if (cellElement) {
                const value = clearFlowBoard[i][j];
                cellElement.textContent = value === 0 ? '' : value;
                
                // Simple, clean color coding like the original
                if (value === 0) {
                    cellElement.style.background = '#cdc1b4';
                    cellElement.style.color = '#776e65';
                } else if (value === 2) {
                    cellElement.style.background = '#eee4da';
                    cellElement.style.color = '#776e65';
                } else if (value === 4) {
                    cellElement.style.background = '#ede0c8';
                    cellElement.style.color = '#776e65';
                } else if (value === 8) {
                    cellElement.style.background = '#f2b179';
                    cellElement.style.color = '#f9f6f2';
                } else if (value === 16) {
                    cellElement.style.background = '#f59563';
                    cellElement.style.color = '#f9f6f2';
                } else if (value === 32) {
                    cellElement.style.background = '#f67c5f';
                    cellElement.style.color = '#f9f6f2';
                } else if (value === 64) {
                    cellElement.style.background = '#f65e3b';
                    cellElement.style.color = '#f9f6f2';
                } else if (value >= 128) {
                    cellElement.style.background = '#edcf72';
                    cellElement.style.color = '#f9f6f2';
                    cellElement.style.fontSize = value >= 1000 ? '1.2rem' : '1.5rem';
                }
                
                // Add subtle animation for new tiles
                if (value > 0) {
                    cellElement.style.transform = 'scale(1)';
                    cellElement.style.transition = 'all 0.2s ease';
                }
            }
        }
    }
    
    // Check win condition - FIXED: Check for tile value, not score
    const target = difficultySettings[currentDifficulty].clearFlowTarget;
    let hasWinningTile = false;
    
    // Check if any tile has reached the target value
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (clearFlowBoard[i][j] === target) {
                hasWinningTile = true;
                break;
            }
        }
        if (hasWinningTile) break;
    }
    
    if (hasWinningTile) {
        setTimeout(() => {
            sounds.success();
            domEffects.createCelebration();
            showMessage('cf-message', `🎉 Congratulations! You reached ${target}!`, 'success');
            localStorage.setItem('cw_clear_flow_completed', 'true');
            updateProgress();
            
            // Auto return to hub after 3 seconds
            setTimeout(() => {
                showPage('hub-page');
            }, 3000);
        }, 100);
    }
}

// Add missing game over check function for Clear the Flow
function checkClearFlowGameOver() {
    // Check if there are any empty cells
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (clearFlowBoard[i][j] === 0) {
                return false; // There are empty cells, game not over
            }
        }
    }
    
    // Check if any moves are possible (can merge tiles)
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const current = clearFlowBoard[i][j];
            // Check right neighbor
            if (j < 3 && clearFlowBoard[i][j + 1] === current) {
                return false; // Can merge horizontally
            }
            // Check bottom neighbor
            if (i < 3 && clearFlowBoard[i + 1][j] === current) {
                return false; // Can merge vertically
            }
        }
    }
    
    return true; // No moves possible, game over
}

// Mobile touch controls for Clear the Flow
function addClearFlowTouchControls() {
    const gameBoard = document.getElementById('cf-board');
    if (!gameBoard) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    
    // Remove any existing listeners to prevent duplicates
    gameBoard.removeEventListener('touchstart', handleTouchStart);
    gameBoard.removeEventListener('touchend', handleTouchEnd);
    gameBoard.removeEventListener('touchmove', preventTouchMove);
    
    gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
    gameBoard.addEventListener('touchend', handleTouchEnd, { passive: false });
    gameBoard.addEventListener('touchmove', preventTouchMove, { passive: false });
    
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        
        // Visual feedback
        gameBoard.style.transform = 'scale(0.98)';
        gameBoard.style.transition = 'transform 0.1s ease';
    }
    
    function handleTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
        
        // Reset visual feedback
        gameBoard.style.transform = 'scale(1)';
        
        handleSwipe();
    }
    
    function preventTouchMove(e) {
        e.preventDefault(); // Prevent scrolling while playing
    }
    
    function handleSwipe() {
        const minSwipeDistance = isMobileDevice() ? 20 : 30; // Lower threshold for mobile
        const maxSwipeTime = 500; // Maximum time for a swipe gesture
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const swipeTime = Date.now() - touchStartTime;
        
        // Check if the swipe is valid
        if (swipeTime > maxSwipeTime || 
            (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance)) {
            return; // Not a valid swipe
        }
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
        
        let moved = false;
        
        // Determine direction based on the larger delta
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                // Swipe right
                console.log('Swipe right detected');
                moved = moveClearFlowRight();
            } else {
                // Swipe left
                console.log('Swipe left detected');
                moved = moveClearFlowLeft();
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                // Swipe down
                console.log('Swipe down detected');
                moved = moveClearFlowDown();
            } else {
                // Swipe up
                console.log('Swipe up detected');
                moved = moveClearFlowUp();
            }
        }
        
        if (moved) {
            // Visual feedback for successful move
            gameBoard.style.animation = 'pulse 0.2s ease';
            setTimeout(() => {
                gameBoard.style.animation = '';
            }, 200);
            
            sounds.click();
            addRandomTile();
            updateClearFlowDisplay();
            
            // Check for game over after the move
            setTimeout(() => {
                if (checkClearFlowGameOver()) {
                    showMessage('cf-message', '🚫 No more moves possible! Game Over! Tap Reset Game button to restart.', 'error');
                    // Add visual feedback
                    domEffects.createWaterDrops(3);
                    // Stronger haptic feedback for game over
                    if (navigator.vibrate) {
                        navigator.vibrate([100, 50, 100]);
                    }
                }
            }, 100);
        } else {
            // Feedback for invalid move
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    }
}

function handleClearFlowKey(e) {
    if (currentPage !== 'clear-flow-page') return;
    
    let moved = false;
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            moved = moveClearFlowUp();
            break;
        case 'ArrowDown':
            e.preventDefault();
            moved = moveClearFlowDown();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            moved = moveClearFlowLeft();
            break;
        case 'ArrowRight':
            e.preventDefault();
            moved = moveClearFlowRight();
            break;
        case 'r':
        case 'R':
            e.preventDefault();
            startClearFlowGame();
            sounds.click();
            return; // Don't check for moves
        case 'Escape':
            e.preventDefault();
            if (isPlayerRegistered()) {
                showPage('hub-page');
            } else {
                showPage('register-page');
            }
            sounds.click();
            return; // Don't check for moves
    }
    
    if (moved) {
        addRandomTile();
        updateClearFlowDisplay();
        sounds.click();
        
        // Check for game over after the move
        setTimeout(() => {
            if (checkClearFlowGameOver()) {
                showMessage('cf-message', '🚫 No more moves possible! Game Over! Press R to restart or Reset Game button.', 'error');
                // Add visual feedback
                domEffects.createWaterDrops(3);
            }
        }, 100);
    }
}

function moveClearFlowUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let tiles = [];
        for (let i = 0; i < 4; i++) {
            if (clearFlowBoard[i][j] !== 0) {
                tiles.push(clearFlowBoard[i][j]);
            }
        }
        
        let merged = mergeTiles(tiles);
        for (let i = 0; i < 4; i++) {
            let newValue = i < merged.length ? merged[i] : 0;
            if (clearFlowBoard[i][j] !== newValue) {
                moved = true;
            }
            clearFlowBoard[i][j] = newValue;
        }
    }
    return moved;
}

function moveClearFlowDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let tiles = [];
        for (let i = 3; i >= 0; i--) {
            if (clearFlowBoard[i][j] !== 0) {
                tiles.push(clearFlowBoard[i][j]);
            }
        }
        
        let merged = mergeTiles(tiles);
        for (let i = 3; i >= 0; i--) {
            let newValue = 3 - i < merged.length ? merged[3 - i] : 0;
            if (clearFlowBoard[i][j] !== newValue) {
                moved = true;
            }
            clearFlowBoard[i][j] = newValue;
        }
    }
    return moved;
}

function moveClearFlowLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let tiles = [];
        for (let j = 0; j < 4; j++) {
            if (clearFlowBoard[i][j] !== 0) {
                tiles.push(clearFlowBoard[i][j]);
            }
        }
        
        let merged = mergeTiles(tiles);
        for (let j = 0; j < 4; j++) {
            let newValue = j < merged.length ? merged[j] : 0;
            if (clearFlowBoard[i][j] !== newValue) {
                moved = true;
            }
            clearFlowBoard[i][j] = newValue;
        }
    }
    return moved;
}

function moveClearFlowRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let tiles = [];
        for (let j = 3; j >= 0; j--) {
            if (clearFlowBoard[i][j] !== 0) {
                tiles.push(clearFlowBoard[i][j]);
            }
        }
        
        let merged = mergeTiles(tiles);
        for (let j = 3; j >= 0; j--) {
            let newValue = 3 - j < merged.length ? merged[3 - j] : 0;
            if (clearFlowBoard[i][j] !== newValue) {
                moved = true;
            }
            clearFlowBoard[i][j] = newValue;
        }
    }
    return moved;
}

function mergeTiles(tiles) {
    let result = [];
    for (let i = 0; i < tiles.length; i++) {
        if (i < tiles.length - 1 && tiles[i] === tiles[i + 1]) {
            result.push(tiles[i] * 2);
            clearFlowScore += tiles[i] * 2;
            i++; // Skip next tile as it's merged
        } else {
            result.push(tiles[i]);
        }
    }
    return result;
}

// Puzzle Pipeline Game
let puzzleLevel = 1;
let puzzleBoard = [];
let paths = {};
let isDrawing = false;
let currentPath = null;

// Puzzle Pipeline game state
let puzzlePipelineCurrentLevel = 0;
let puzzlePipelineMaxLevels = 5;

// Your original 5 puzzle levels - restored from your creative designs!
const puzzlePipelineLevels = [
    // Level 1 - Easy (4x4)
    {
        grid: [
            [1, 0, 0, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 0, 0, 2]
        ],
        size: 4
    },
    // Level 2 - Easy (4x4)
    {
        grid: [
            [1, 0, 0, 0],
            [0, 0, 2, 0],
            [0, 3, 1, 0],
            [2, 0, 0, 3]
        ],
        size: 4
    },
    // Level 3 - Easy/Normal (5x5)
    {
        grid: [
            [1, 3, 0, 0, 0],
            [0, 0, 2, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [2, 0, 0, 0, 3]
        ],
        size: 5
    },
    // Level 4 - Normal/Hard (5x5)
    {
        grid: [
            [1, 0, 0, 2, 3],
            [0, 2, 3, 0, 0],
            [0, 0, 4, 0, 0],
            [5, 0, 0, 0, 0],
            [0, 0, 5, 1, 4]
        ],
        size: 5
    },
    // Level 5 - Hard (6x6) - YOUR ORIGINAL DESIGN
    {
        grid: [
            [1, 0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 3, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 4],
            [0, 4, 2, 0, 0, 0],
            [3, 0, 0, 0, 0, 0]
        ],
        size: 6
    }
];

function startPuzzlePipelineGame() {
    console.log('=== STARTING PUZZLE PIPELINE ===');
    console.log('Starting Puzzle Pipeline game');
    
    // Make sure we're on the right page
    if (currentPage !== 'puzzle-pipeline-page') {
        console.log('Not on puzzle pipeline page, switching...');
        showPage('puzzle-pipeline-page');
    }
    
    // Ensure we have a valid difficulty setting
    if (!difficultySettings[currentDifficulty]) {
        console.error('Invalid difficulty:', currentDifficulty);
        currentDifficulty = 'easy';
    }
    
    puzzlePipelineCurrentLevel = 0;
    puzzlePipelineMaxLevels = difficultySettings[currentDifficulty].puzzleLevels;
    isDrawing = false;
    
    console.log(`Puzzle Pipeline initialized:`);
    console.log(`- Current difficulty: ${currentDifficulty}`);
    console.log(`- Current level: ${puzzlePipelineCurrentLevel}`);
    console.log(`- Max levels for ${currentDifficulty}: ${puzzlePipelineMaxLevels}`);
    console.log(`- Total levels in array: ${puzzlePipelineLevels.length}`);
    
    // Update the difficulty display on the page
    updateDifficultyDisplays();
    
    // Add keyboard controls for laptop users
    addPuzzlePipelineKeyboardControls();
    
    // Start with the first level
    loadPuzzleLevel(puzzlePipelineCurrentLevel);
}

function loadPuzzleLevel(levelIndex) {
    console.log(`=== LOADING LEVEL ===`);
    console.log(`Loading level ${levelIndex + 1}, maxLevels: ${puzzlePipelineMaxLevels}`);
    console.log(`Total levels in array: ${puzzlePipelineLevels.length}`);
    console.log(`Current difficulty: ${currentDifficulty}`);
    console.log(`Current page: ${currentPage}`);
    
    // Ensure we're on the correct page before loading level
    if (currentPage !== 'puzzle-pipeline-page') {
        console.log('Not on puzzle pipeline page, switching...');
        showPage('puzzle-pipeline-page');
        // Retry loading level after page switch
        setTimeout(() => {
            loadPuzzleLevel(levelIndex);
        }, 100);
        return;
    }
    
    // Validate level index
    if (levelIndex < 0 || levelIndex >= puzzlePipelineLevels.length) {
        console.error(`Invalid level index: ${levelIndex}. Valid range: 0-${puzzlePipelineLevels.length - 1}`);
        showPage('hub-page');
        return;
    }
    
    if (levelIndex >= puzzlePipelineMaxLevels) {
        // All levels completed for this difficulty
        console.log(`Level ${levelIndex} >= maxLevels ${puzzlePipelineMaxLevels} - All levels completed, returning to hub`);
        sounds.success();
        domEffects.createCelebration();
        showMessage('pp-message', `🎉 All levels completed on ${difficultySettings[currentDifficulty].name}!`, 'success');
        localStorage.setItem('cw_puzzle_completed', 'true');
        updateProgress();
        
        // Auto return to hub after 3 seconds
        setTimeout(() => {
            showPage('hub-page');
        }, 3000);
        return;
    }

    // Update level display
    puzzlePipelineCurrentLevel = levelIndex;
    const levelDisplay = document.getElementById('pp-level');
    if (levelDisplay) {
        levelDisplay.textContent = levelIndex + 1;
    }
    
    const level = puzzlePipelineLevels[levelIndex];
    if (!level) {
        console.error(`Level ${levelIndex} not found in levels array!`);
        showPage('hub-page');
        return;
    }
    
    console.log(`Successfully loading level ${levelIndex + 1} (${level.size}x${level.size})`);
    const size = level.size;
    const grid = [...level.grid.map(row => [...row])]; // Deep copy
    
    // Find endpoints
    const endpoints = {};
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] > 0) {
                const num = grid[r][c];
                if (!endpoints[num]) endpoints[num] = [];
                endpoints[num].push([r, c]);
            }
        }
    }

    let levelPaths = {};
    let levelCurrentPath = null;
    let solved = false;

    const boardDiv = document.getElementById('pp-board');
    if (!boardDiv) {
        console.error('Puzzle Pipeline board element not found!');
        showMessage('pp-message', '❌ Game board not found. Please refresh the page.', 'error');
        setTimeout(() => {
            showPage('hub-page');
        }, 2000);
        return;
    }
    
    // Enhanced mobile responsive sizing with perfect centering
    if (isMobileDevice()) {
        console.log('Mobile device detected, applying mobile sizing with perfect centering...');
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const maxBoardSize = Math.min(screenWidth * 0.85, screenHeight * 0.5); // Slightly smaller for better centering
        const cellSize = Math.floor(maxBoardSize / size) - 4; // Account for gaps
        
        console.log(`Screen: ${screenWidth}x${screenHeight}, Board size: ${maxBoardSize}, Cell size: ${cellSize}`);
        
        // Ensure minimum cell size for playability
        const finalCellSize = Math.max(cellSize, 35);
        
        boardDiv.style.gridTemplateColumns = `repeat(${size}, ${finalCellSize}px)`;
        boardDiv.style.gridTemplateRows = `repeat(${size}, ${finalCellSize}px)`;
        boardDiv.style.gap = '3px';
        
        // Calculate exact board width and center it
        const boardWidth = size * finalCellSize + (size - 1) * 3;
        boardDiv.style.width = `${boardWidth}px`;
        boardDiv.style.maxWidth = `${boardWidth}px`;
        
        // Remove any positioning that might interfere with CSS centering
        boardDiv.style.position = '';
        boardDiv.style.left = '';
        boardDiv.style.transform = '';
        boardDiv.style.margin = '';
        
        console.log(`Final board dimensions: ${boardWidth}px x ${boardWidth}px`);
    } else {
        console.log('Desktop device detected, using standard sizing...');
        boardDiv.style.gridTemplateColumns = `repeat(${size}, 60px)`;
        boardDiv.style.gridTemplateRows = `repeat(${size}, 60px)`;
        boardDiv.style.gap = '6px';
    }
    
    // Let CSS handle positioning and centering
    
    drawBoard();

    function drawBoard() {
        console.log('=== DRAWING BOARD ===');
        console.log('Current level paths:', levelPaths);
        console.log('Current drawing path:', levelCurrentPath);
        console.log('Is mobile device:', isMobileDevice());
        
        // Clear and rebuild the board
        boardDiv.innerHTML = '';
        
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = document.createElement('div');
                cell.className = 'pp-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                
                // Apply consistent styling regardless of device
                cell.style.cssText = `
                    background: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #2E9DF7;
                    cursor: pointer;
                    user-select: none;
                    border: 2px solid #ddd;
                    transition: all 0.2s ease;
                    position: relative;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                `;
                
                // Mobile-specific touch optimizations
                if (isMobileDevice()) {
                    cell.style.touchAction = 'none';
                    cell.style.webkitTouchCallout = 'none';
                    cell.style.webkitUserSelect = 'none';
                    cell.style.userSelect = 'none';
                    cell.style.transform = 'translateZ(0)';
                    cell.style.backfaceVisibility = 'hidden';
                    cell.style.fontSize = '1rem';
                }
                
                // Add hover effects for desktop only
                if (!isMobileDevice()) {
                    cell.addEventListener('mouseenter', () => {
                        if (!solved && !isDrawing) {
                            cell.style.borderColor = '#2E9DF7';
                            cell.style.transform = 'scale(1.02)';
                            cell.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                        }
                    });
                    
                    cell.addEventListener('mouseleave', () => {
                        if (!solved && !isDrawing) {
                            cell.style.borderColor = '#ddd';
                            cell.style.transform = 'scale(1)';
                            cell.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }
                    });
                }
                
                // Set cell content and colors
                if (grid[r][c] > 0) {
                    cell.textContent = grid[r][c];
                    cell.style.backgroundColor = getColor(grid[r][c]);
                    cell.style.color = '#fff';
                    cell.style.fontWeight = 'bold';
                } else {
                    // Check if this cell is part of a completed path
                    let inPath = false;
                    for (let num in levelPaths) {
                        if (levelPaths[num].some(([pr, pc]) => pr === r && pc === c)) {
                            cell.style.backgroundColor = getColor(num);
                            cell.style.color = '#fff';
                            inPath = true;
                            break;
                        }
                    }
                    
                    // Check if this cell is part of the current path being drawn
                    if (!inPath && levelCurrentPath && levelCurrentPath.path.some(([pr, pc]) => pr === r && pc === c)) {
                        cell.style.backgroundColor = getColor(levelCurrentPath.number);
                        cell.style.color = '#fff';
                        cell.style.opacity = '0.8';
                        cell.classList.add('path-active');
                        inPath = true;
                    }
                    
                    if (!inPath) {
                        cell.style.backgroundColor = 'white';
                        cell.style.color = '#2E9DF7';
                        cell.style.opacity = '1';
                        // Remove any active classes
                        cell.classList.remove('path-active', 'path-preview');
                    }
                }
                
                // Add event listeners
                cell.addEventListener('mousedown', startPath);
                cell.addEventListener('mouseenter', continuePath);
                cell.addEventListener('mouseup', endPath);
                
                // Enhanced touch events for mobile
                cell.addEventListener('touchstart', startPath, { passive: false });
                cell.addEventListener('touchmove', handleTouchMove, { passive: false });
                cell.addEventListener('touchend', endPath, { passive: false });
                
                boardDiv.appendChild(cell);
            }
        }
        
        // Global event listeners for cleanup
        document.addEventListener('mouseup', globalEndPath);
        document.addEventListener('touchend', globalEndPath);
        boardDiv.addEventListener('mouseleave', boardMouseLeave);
        
        console.log('Board drawing complete');
    }

    // Global event handlers for cleanup
    function globalEndPath(e) {
        if (isDrawing && levelCurrentPath) {
            console.log('Global end path triggered');
            isDrawing = false;
            levelCurrentPath = null;
            drawBoard();
        }
    }

    function boardMouseLeave() {
        if (isDrawing && levelCurrentPath) {
            console.log('Mouse/touch left board area');
            isDrawing = false;
            levelCurrentPath = null;
            drawBoard();
        }
    }

    function startPath(e) {
        if (solved) return;
        e.preventDefault();
        e.stopPropagation();
        
        console.log('=== START PATH ENHANCED ===');
        console.log('Event type:', e.type);
        console.log('Is mobile device:', isMobileDevice());
        
        // Handle both mouse and touch events
        let target = e.target;
        if (e.type === 'touchstart' && e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            target = document.elementFromPoint(touch.clientX, touch.clientY);
            console.log('Touch event - target found:', target ? target.classList.toString() : 'none');
        }
        
        if (!target || !target.dataset || !target.dataset.row || !target.dataset.col) {
            console.log('No target or dataset found');
            return;
        }
        
        const r = parseInt(target.dataset.row);
        const c = parseInt(target.dataset.col);
        
        console.log('Cell coordinates:', r, c);
        console.log('Cell value:', grid[r][c]);
        
        if (isNaN(r) || isNaN(c)) {
            console.log('Invalid coordinates');
            return;
        }
        
        // Only start path from numbered cells (endpoints)
        if (grid[r][c] > 0) {
            const num = grid[r][c];
            levelCurrentPath = { number: num, path: [[r, c]] };
            isDrawing = true;
            sounds.click();
            
            console.log('Started path for number:', num);
            console.log('Path initialized:', levelCurrentPath);
            
            // Enhanced visual feedback for both mobile and desktop
            if (isMobileDevice()) {
                target.style.transform = 'scale(1.1)';
                target.style.boxShadow = '0 0 10px rgba(46, 157, 247, 0.5)';
                // Add strong haptic feedback for start
                if (navigator.vibrate) {
                    navigator.vibrate(15);
                }
            } else {
                target.style.transform = 'scale(1.15)';
                target.style.boxShadow = '0 0 15px rgba(46, 157, 247, 0.7)';
            }
            
            setTimeout(() => {
                if (target.style) {
                    target.style.transform = '';
                    target.style.boxShadow = '';
                }
            }, 300);
            
            // Immediately redraw to show starting state
            drawBoard();
        } else {
            console.log('Empty cell clicked - cannot start path');
        }
    }

    function continuePath(e) {
        if (!levelCurrentPath || solved || !isDrawing) return;
        e.preventDefault();
        e.stopPropagation();
        
        console.log('=== CONTINUE PATH ===');
        console.log('Event type:', e.type);
        
        // Handle both mouse and touch events with better mobile support
        let target = e.target;
        if (e.type === 'touchmove' && e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            target = document.elementFromPoint(touch.clientX, touch.clientY);
            console.log('Touch move - target found:', target ? target.classList.toString() : 'none');
        }
        
        if (!target || !target.dataset || !target.classList.contains('pp-cell')) {
            console.log('No valid target found in continuePath');
            return;
        }
        
        const r = parseInt(target.dataset.row);
        const c = parseInt(target.dataset.col);
        
        console.log('Continue path to cell:', r, c);
        
        if (isNaN(r) || isNaN(c)) {
            console.log('Invalid coordinates in continuePath');
            return;
        }
        
        // Check if this is a valid next cell
        const lastPos = levelCurrentPath.path[levelCurrentPath.path.length - 1];
        const distance = Math.abs(r - lastPos[0]) + Math.abs(c - lastPos[1]);
        
        if (distance === 1) { // Adjacent cell
            if (grid[r][c] === 0 || grid[r][c] === levelCurrentPath.number) {
                // Check if not already in current path
                if (!levelCurrentPath.path.some(([pr, pc]) => pr === r && pc === c)) {
                    levelCurrentPath.path.push([r, c]);
                    drawBoard();
                    
                    console.log('Path continued to:', r, c);
                    
                    // Enhanced visual feedback for both mobile and desktop
                    if (isMobileDevice()) {
                        target.style.transform = 'scale(1.02)';
                        target.style.backgroundColor = 'rgba(46, 157, 247, 0.15)';
                        // Add subtle haptic feedback
                        if (navigator.vibrate) {
                            navigator.vibrate(5);
                        }
                    } else {
                        target.style.transform = 'scale(1.05)';
                    }
                    
                    setTimeout(() => {
                        if (target.style) {
                            target.style.transform = '';
                            target.style.backgroundColor = '';
                        }
                    }, 150);
                } else {
                    console.log('Cell already in path');
                }
            } else {
                console.log('Cannot continue path - cell occupied by different number');
            }
        } else {
            console.log('Cell not adjacent to path');
        }
    }

    function endPath(e) {
        if (!levelCurrentPath || solved || !isDrawing) return;
        e.preventDefault();
        e.stopPropagation();
        
        console.log('=== END PATH ENHANCED ===');
        console.log('Event type:', e.type);
        console.log('Current path:', levelCurrentPath);
        
        // Handle both mouse and touch events
        let target = e.target;
        if (e.type === 'touchend' && e.changedTouches && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            target = document.elementFromPoint(touch.clientX, touch.clientY);
            console.log('Touch end - target found:', target ? target.classList.toString() : 'none');
        }
        
        if (!target || !target.dataset || !target.dataset.row || !target.dataset.col) {
            // Invalid end point, clear current path
            console.log('Invalid end point, clearing path');
            isDrawing = false;
            levelCurrentPath = null;
            drawBoard();
            return;
        }
        
        const r = parseInt(target.dataset.row);
        const c = parseInt(target.dataset.col);
        
        console.log('End path at cell:', r, c, 'Cell value:', grid[r][c]);
        console.log('Path length:', levelCurrentPath.path.length);
        
        if (isNaN(r) || isNaN(c)) {
            console.log('Invalid coordinates, clearing path');
            isDrawing = false;
            levelCurrentPath = null;
            drawBoard();
            return;
        }
        
        // Check if ending on a matching endpoint and path has more than one cell
        if (grid[r][c] === levelCurrentPath.number && levelCurrentPath.path.length > 1) {
            // Valid connection - ensure the ending cell is included in path
            const lastCell = levelCurrentPath.path[levelCurrentPath.path.length - 1];
            if (lastCell[0] !== r || lastCell[1] !== c) {
                levelCurrentPath.path.push([r, c]);
            }
            
            levelPaths[levelCurrentPath.number] = [...levelCurrentPath.path];
            sounds.success();
            
            console.log(`✅ Valid connection made for number ${levelCurrentPath.number}`);
            console.log('Current level paths:', Object.keys(levelPaths));
            console.log('Connection path:', levelPaths[levelCurrentPath.number]);
            
            // Enhanced celebration effect for successful connection
            if (target.style) {
                if (isMobileDevice()) {
                    target.style.animation = 'pulse 0.5s ease-in-out';
                    target.style.transform = 'scale(1.2)';
                    // Strong haptic feedback for success
                    if (navigator.vibrate) {
                        navigator.vibrate([100, 50, 100]);
                    }
                } else {
                    target.style.animation = 'pulse 0.5s ease-in-out';
                    target.style.transform = 'scale(1.2)';
                }
                
                setTimeout(() => {
                    if (target.style) {
                        target.style.animation = '';
                        target.style.transform = '';
                    }
                }, 500);
            }
            
            // Check if puzzle is solved
            console.log('Calling checkSolved...');
            checkSolved();
        } else {
            // Invalid connection, clear path
            console.log(`❌ Invalid connection attempt for number ${levelCurrentPath.number}, path length: ${levelCurrentPath.path.length}`);
            console.log(`Target cell value: ${grid[r][c]}, Expected: ${levelCurrentPath.number}`);
            sounds.click();
            
            // Feedback for invalid connection
            if (isMobileDevice() && navigator.vibrate) {
                navigator.vibrate(50); // Medium vibration for invalid move
            }
        }
        
        isDrawing = false;
        levelCurrentPath = null;
        drawBoard();
    }

    function handleTouchMove(e) {
        if (!isDrawing || !levelCurrentPath) return;
        e.preventDefault();
        e.stopPropagation();
        
        console.log('=== TOUCH MOVE ENHANCED ===');
        
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        console.log('Touch move - element found:', element ? element.classList.toString() : 'none');
        
        if (element && element.classList.contains('pp-cell') && element.dataset.row && element.dataset.col) {
            const r = parseInt(element.dataset.row);
            const c = parseInt(element.dataset.col);
            
            console.log('Touch move to cell:', r, c);
            
            // Check if this is a valid adjacent cell
            const lastPos = levelCurrentPath.path[levelCurrentPath.path.length - 1];
            const distance = Math.abs(r - lastPos[0]) + Math.abs(c - lastPos[1]);
            
            if (distance === 1) { // Adjacent cell
                if (grid[r][c] === 0 || grid[r][c] === levelCurrentPath.number) {
                    // Check if not already in current path
                    if (!levelCurrentPath.path.some(([pr, pc]) => pr === r && pc === c)) {
                        levelCurrentPath.path.push([r, c]);
                        
                        console.log('Added cell to path:', r, c);
                        console.log('Current path length:', levelCurrentPath.path.length);
                        
                        // Immediate visual feedback for mobile
                        element.style.backgroundColor = getColor(levelCurrentPath.number);
                        element.style.color = '#fff';
                        element.style.opacity = '0.8';
                        element.style.transform = 'scale(1.05)';
                        
                        // Add haptic feedback
                        if (navigator.vibrate && isMobileDevice()) {
                            navigator.vibrate(5);
                        }
                        
                        // Reset visual feedback
                        setTimeout(() => {
                            if (element.style) {
                                element.style.transform = '';
                            }
                        }, 100);
                        
                        // Redraw board to show updated path
                        drawBoard();
                    }
                }
            }
        }
    }

    function checkSolved() {
        console.log('=== CHECKING IF SOLVED ===');
        console.log('Endpoints:', endpoints);
        console.log('Level paths:', levelPaths);
        
        // Check if all number pairs are connected
        const requiredConnections = Object.keys(endpoints).length;
        const madeConnections = Object.keys(levelPaths).length;
        
        console.log(`Required connections: ${requiredConnections}, Made connections: ${madeConnections}`);
        
        if (madeConnections === requiredConnections) {
            console.log('All pairs connected, checking if grid is full...');
            // Check if all cells are filled
            let allFilled = true;
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (grid[r][c] === 0) {
                        // Check if this cell is part of any path
                        let inPath = false;
                        for (let num in levelPaths) {
                            if (levelPaths[num].some(([pr, pc]) => pr === r && pc === c)) {
                                inPath = true;
                                break;
                            }
                        }
                        if (!inPath) {
                            console.log(`Cell [${r}][${c}] is empty and not in any path`);
                            allFilled = false;
                            break;
                        }
                    }
                }
                if (!allFilled) break;
            }
            
            console.log(`Grid fully filled: ${allFilled}`);
            
            if (allFilled) {
                solved = true;
                sounds.success();
                domEffects.createCelebration();
                
                // Add visual celebration to the board
                const boardDiv = document.getElementById('pp-board');
                if (boardDiv) {
                    boardDiv.classList.add('level-complete');
                    setTimeout(() => {
                        boardDiv.classList.remove('level-complete');
                    }, 1000);
                }
                
                console.log(`=== LEVEL COMPLETED ===`);
                console.log(`Completed level: ${puzzlePipelineCurrentLevel + 1}`);
                console.log(`Current level index: ${puzzlePipelineCurrentLevel}`);
                console.log(`Max levels for ${currentDifficulty}: ${puzzlePipelineMaxLevels}`);
                
                const nextLevel = puzzlePipelineCurrentLevel + 1;
                
                if (nextLevel >= puzzlePipelineMaxLevels) {
                    // All levels completed for this difficulty
                    console.log(`🏁 All levels completed for this difficulty`);
                    domEffects.createWaterDrops(8);
                    showMessage('pp-message', `🎉 All levels completed on ${difficultySettings[currentDifficulty].name}!`, 'success');
                    localStorage.setItem('cw_puzzle_completed', 'true');
                    updateProgress();
                    
                    setTimeout(() => {
                        showPage('hub-page');
                    }, 3000);
                } else {
                    // Go to next level with water animation
                    console.log(`✅ Going to next level: ${nextLevel + 1}`);
                    domEffects.createWaterDrops(8);
                    showMessage('pp-message', `🎉 Level ${puzzlePipelineCurrentLevel + 1} completed! Water is flowing to the next level...`, 'success');
                    
                    setTimeout(() => {
                        domEffects.createCelebration();
                        console.log(`Loading level ${nextLevel + 1} (index ${nextLevel})`);
                        
                        // Ensure we stay on the puzzle pipeline page
                        if (currentPage !== 'puzzle-pipeline-page') {
                            console.log('Not on puzzle pipeline page, switching back...');
                            showPage('puzzle-pipeline-page');
                        }
                        
                        // Small delay to ensure page is ready
                        setTimeout(() => {
                            // Add loading animation
                            const boardDiv = document.getElementById('pp-board');
                            if (boardDiv) {
                                boardDiv.classList.add('level-loading');
                            }
                            
                            loadPuzzleLevel(nextLevel);
                            
                            // Remove loading animation after level loads
                            setTimeout(() => {
                                if (boardDiv) {
                                    boardDiv.classList.remove('level-loading');
                                }
                            }, 500);
                        }, 100);
                    }, 2000);
                }
            } else {
                console.log('Grid not fully filled yet, puzzle not solved');
            }
        } else {
            console.log('Not all pairs connected yet');
        }
    }

    function getColor(num) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];
        return colors[(num - 1) % colors.length];
    }
}

// Enhanced keyboard controls for Puzzle Pipeline (laptop support)
function addPuzzlePipelineKeyboardControls() {
    function handlePuzzleKeyboard(e) {
        if (currentPage !== 'puzzle-pipeline-page') return;
        
        // Add keyboard shortcuts for Puzzle Pipeline
        switch(e.key) {
            case 'r':
            case 'R':
                // Reset current level
                e.preventDefault();
                startPuzzlePipelineGame();
                sounds.click();
                break;
            case 'Escape':
                // Go back to hub
                e.preventDefault();
                if (isPlayerRegistered()) {
                    showPage('hub-page');
                } else {
                    showPage('register-page');
                }
                sounds.click();
                break;
        }
    }
    
    // Remove any existing listeners first
    document.removeEventListener('keydown', handlePuzzleKeyboard);
    // Add the keyboard listener
    document.addEventListener('keydown', handlePuzzleKeyboard);
}

// Utility function to show messages
function showMessage(elementId, message, type = 'info') {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        messageElement.className = `game-message ${type}`;
        
        // Auto-hide message after 3 seconds unless it's success type
        if (type !== 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
        }
    }
}

// Enhanced device detection and adaptation
function adaptToDevice() {
    const isMobile = isMobileDevice();
    const body = document.body;
    
    // Add device-specific classes for better styling
    if (isMobile) {
        body.classList.add('mobile-device');
        body.classList.remove('desktop-device');
        
        // Enable mobile optimizations
        enableMobileOptimizations();
    } else {
        body.classList.add('desktop-device');
        body.classList.remove('mobile-device');
    }
    
    // Update device-specific instructions visibility
    const mobileInstructions = document.querySelectorAll('.mobile-only');
    const desktopInstructions = document.querySelectorAll('.laptop-only');
    
    mobileInstructions.forEach(el => {
        el.style.display = isMobile ? 'block' : 'none';
    });
    
    desktopInstructions.forEach(el => {
        el.style.display = isMobile ? 'none' : 'block';
    });
    
    console.log(`Device adapted: ${isMobile ? 'Mobile' : 'Desktop'}`);
}

// Enable mobile-specific optimizations
function enableMobileOptimizations() {
    console.log('Enabling mobile optimizations...');
    
    // Add viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0';
        document.head.appendChild(viewport);
        console.log('Viewport meta tag added');
    }
    
    // Prevent zoom on input focus (mobile safari)
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.style.fontSize = '16px'; // Prevent zoom
        });
    });
    
    // Add touch-friendly styles
    document.body.style.touchAction = 'manipulation';
    document.body.style.webkitTapHighlightColor = 'transparent';
    document.body.style.webkitTouchCallout = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.userSelect = 'none';
    
    // Improve tap delay and responsiveness
    document.body.style.cursor = 'pointer';
    
    // Add mobile-specific CSS for game boards
    const style = document.createElement('style');
    style.textContent = `
        .mobile-device .pp-cell {
            user-select: none !important;
            -webkit-user-select: none !important;
            -webkit-touch-callout: none !important;
            touch-action: manipulation !important;
            cursor: pointer !important;
        }
        
        .mobile-device .cf-cell {
            user-select: none !important;
            -webkit-user-select: none !important;
            touch-action: manipulation !important;
        }
        
        .mobile-device .game-board-container {
            overflow-x: hidden !important;
            touch-action: pan-y !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Mobile optimizations enabled successfully');
}

// Handle orientation changes on mobile devices
function handleOrientationChange() {
    if (isMobileDevice()) {
        setTimeout(() => {
            // Re-initialize game boards if on game pages
            if (currentPage === 'clear-flow-page') {
                // Refresh Clear Flow board sizing
                const board = document.getElementById('cf-board');
                if (board) {
                    board.style.width = window.innerWidth < 400 ? '280px' : '320px';
                    board.style.height = window.innerWidth < 400 ? '280px' : '320px';
                }
            } else if (currentPage === 'puzzle-pipeline-page') {
                // Refresh Puzzle Pipeline board if needed
                const board = document.getElementById('pp-board');
                if (board) {
                    adaptToDevice();
                }
            }
        }, 500); // Wait for orientation change to complete
    }
}

// Listen for orientation changes
window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);

// Initialize device settings on load
document.addEventListener('DOMContentLoaded', adaptToDevice);

// Add to window for testing
window.testLevelProgression = testLevelProgression;
