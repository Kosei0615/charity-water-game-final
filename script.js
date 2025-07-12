// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

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
    console.log('Switching to page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
        console.log('Successfully switched to:', pageId);
    } else {
        console.error('Page not found:', pageId);
    }
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
    
    // Initialize page system - this determines initial page
    initializePageSystem();
    
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
    
    const playButtons = {
        'play-clear-flow': () => {
            console.log('Clear Flow button clicked - checking authentication...');
            if (!isPlayerRegistered()) {
                console.log('Player not registered, blocking game access');
                alert('Please register first to play the game!');
                showPage('register-page');
                return;
            }
            console.log('Player authenticated, starting Clear Flow game');
            showPage('clear-flow-page');
            startClearFlowGame();
        },
        'play-puzzle-pipeline': () => {
            console.log('Puzzle Pipeline button clicked - checking authentication...');
            if (!isPlayerRegistered()) {
                console.log('Player not registered, blocking game access');
                alert('Please register first to play the game!');
                showPage('register-page');
                return;
            }
            console.log('Player authenticated, starting Puzzle Pipeline game');
            showPage('puzzle-pipeline-page');
            startPuzzlePipelineGame();
        }
    };
    
    Object.entries(playButtons).forEach(([buttonId, handler]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                console.log('Game button clicked:', buttonId);
                handler();
            });
        }
    });
}

// Initialize back buttons with authentication guards
function initializeBackButtons() {
    const backButtons = ['cf-back', 'pp-back'];
    backButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                console.log('Back button clicked:', buttonId);
                if (!isPlayerRegistered()) {
                    alert('Please register first!');
                    showPage('register-page');
                    return;
                }
                showPage('hub-page');
                sounds.click();
            });
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
    
    // Add keyboard controls
    document.addEventListener('keydown', handleClearFlowKey);
}

function initializeClearFlowBoard() {
    clearFlowBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    
    const boardElement = document.getElementById('cf-board');
    if (boardElement) {
        boardElement.innerHTML = '';
        boardElement.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
            gap: 10px;
            width: 300px;
            height: 300px;
            margin: 0 auto;
            background: #bbada0;
            border-radius: 10px;
            padding: 10px;
        `;
        
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'cf-cell';
            cell.id = `cf-cell-${i}`;
            cell.style.cssText = `
                background: #cdc1b4;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: bold;
                color: #776e65;
            `;
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
                
                // Color coding
                if (value === 0) {
                    cellElement.style.background = '#cdc1b4';
                } else if (value === 2) {
                    cellElement.style.background = '#eee4da';
                } else if (value === 4) {
                    cellElement.style.background = '#ede0c8';
                } else {
                    cellElement.style.background = '#f2b179';
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
    }
    
    if (moved) {
        addRandomTile();
        updateClearFlowDisplay();
        sounds.click();
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

function startPuzzlePipelineGame() {
    console.log('Starting Puzzle Pipeline game');
    puzzlePipelineCurrentLevel = 0;
    puzzlePipelineMaxLevels = difficultySettings[currentDifficulty].puzzleLevels;
    isDrawing = false;
    
    console.log(`Puzzle Pipeline initialized:`);
    console.log(`- Current level: ${puzzlePipelineCurrentLevel}`);
    console.log(`- Max levels: ${puzzlePipelineMaxLevels}`);
    console.log(`- Difficulty: ${currentDifficulty}`);
    
    updateDifficultyDisplays();
    
    // Original predefined puzzle levels
    const levels = [
        {
            grid: [
                [1, 0, 0, 2],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 0, 0, 2]
            ],
            size: 4
        },
        {
            grid: [
                [1, 0, 0, 0],
                [0, 0, 2, 0],
                [0, 3, 1, 0],
                [2, 0, 0, 3]
            ],
            size: 4
        },
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
        {
            grid: [
                [1, 0, 0, 2, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 3, 0, 0, 4, 0],
                [0, 1, 0, 0, 0, 0],
                [0, 4, 2, 0, 0, 0],
                [3, 0, 0, 0, 0, 0]
            ],
            size: 6
        }
    ];

    function loadLevel(levelIndex) {
        console.log(`Loading level ${levelIndex + 1}, maxLevels: ${puzzlePipelineMaxLevels}`);
        
        if (levelIndex >= puzzlePipelineMaxLevels || levelIndex >= levels.length) {
            // All levels completed
            console.log('All levels completed, returning to hub');
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
        document.getElementById('pp-level').textContent = levelIndex + 1;
        
        const level = levels[levelIndex];
        if (!level) {
            console.error(`Level ${levelIndex} not found!`);
            showPage('hub-page');
            return;
        }
        
        console.log(`Successfully loading level ${levelIndex + 1}`);
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
        
        boardDiv.style.gridTemplateColumns = `repeat(${size}, 60px)`;
        boardDiv.style.gridTemplateRows = `repeat(${size}, 60px)`;
        boardDiv.style.width = `${size * 60 + (size - 1) * 2}px`;
        boardDiv.style.height = `${size * 60 + (size - 1) * 2}px`;
        
        drawBoard();

        function drawBoard() {
            boardDiv.innerHTML = '';
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    const cell = document.createElement('div');
                    cell.className = 'pp-cell';
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    cell.style.cssText = `
                        background: white;
                        border-radius: 3px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1rem;
                        font-weight: bold;
                        color: #2E9DF7;
                        cursor: pointer;
                        user-select: none;
                        border: 1px solid #ddd;
                    `;
                    
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
                                inPath = true;
                                break;
                            }
                        }
                        
                        // Check if this cell is part of the current path being drawn
                        if (!inPath && levelCurrentPath && levelCurrentPath.path.some(([pr, pc]) => pr === r && pc === c)) {
                            cell.style.backgroundColor = getColor(levelCurrentPath.number);
                            cell.style.opacity = '0.7';
                            inPath = true;
                        }
                        
                        if (!inPath) {
                            cell.style.backgroundColor = 'white';
                            cell.style.opacity = '1';
                        }
                    }
                    
                    cell.addEventListener('mousedown', startPath);
                    cell.addEventListener('mouseenter', continuePath);
                    cell.addEventListener('mouseup', endPath);
                    
                    // Touch events for mobile
                    cell.addEventListener('touchstart', startPath);
                    cell.addEventListener('touchmove', handleTouchMove);
                    cell.addEventListener('touchend', endPath);
                    
                    boardDiv.appendChild(cell);
                }
            }
            
            // Global mouse up to stop drawing when mouse leaves the board
            document.addEventListener('mouseup', () => {
                if (isDrawing) {
                    isDrawing = false;
                    levelCurrentPath = null;
                    drawBoard();
                }
            });
        }

        function startPath(e) {
            if (solved) return;
            e.preventDefault();
            
            const r = parseInt(e.target.dataset.row);
            const c = parseInt(e.target.dataset.col);
            
            if (grid[r][c] > 0) {
                const num = grid[r][c];
                levelCurrentPath = { number: num, path: [[r, c]] };
                isDrawing = true;
                sounds.click();
                drawBoard(); // Redraw to show current path
            }
        }

        function continuePath(e) {
            if (!levelCurrentPath || solved || !isDrawing) return;
            e.preventDefault();
            
            const r = parseInt(e.target.dataset.row);
            const c = parseInt(e.target.dataset.col);
            
            // Check if this is a valid next cell
            const lastPos = levelCurrentPath.path[levelCurrentPath.path.length - 1];
            const distance = Math.abs(r - lastPos[0]) + Math.abs(c - lastPos[1]);
            
            if (distance === 1) { // Adjacent cell
                if (grid[r][c] === 0 || grid[r][c] === levelCurrentPath.number) {
                    // Check if not already in current path
                    if (!levelCurrentPath.path.some(([pr, pc]) => pr === r && pc === c)) {
                        levelCurrentPath.path.push([r, c]);
                        drawBoard();
                    }
                }
            }
        }

        function endPath(e) {
            if (!levelCurrentPath || solved || !isDrawing) return;
            e.preventDefault();
            
            const r = parseInt(e.target.dataset.row);
            const c = parseInt(e.target.dataset.col);
            
            // Check if ending on a matching endpoint
            if (grid[r][c] === levelCurrentPath.number && levelCurrentPath.path.length > 1) {
                // Valid connection
                levelPaths[levelCurrentPath.number] = [...levelCurrentPath.path];
                sounds.success();
                
                // Check if puzzle is solved
                checkSolved();
            } else {
                // Invalid connection, clear path
                sounds.click();
            }
            
            isDrawing = false;
            levelCurrentPath = null;
            drawBoard();
        }

        function handleTouchMove(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (element && element.classList.contains('pp-cell')) {
                continuePath({target: element});
            }
        }

        function checkSolved() {
            // Check if all number pairs are connected
            const requiredConnections = Object.keys(endpoints).length;
            const madeConnections = Object.keys(levelPaths).length;
            
            if (madeConnections === requiredConnections) {
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
                                allFilled = false;
                                break;
                            }
                        }
                    }
                    if (!allFilled) break;
                }
                
                if (allFilled) {
                    solved = true;
                    sounds.success();
                    domEffects.createCelebration();
                    
                    console.log(`Level ${puzzlePipelineCurrentLevel + 1} completed!`);
                    console.log(`Current level: ${puzzlePipelineCurrentLevel}, Max levels: ${puzzlePipelineMaxLevels}`);
                    
                    const messageDiv = document.getElementById('pp-message');
                    const nextLevel = puzzlePipelineCurrentLevel + 1;
                    
                    if (nextLevel < puzzlePipelineMaxLevels && nextLevel < levels.length) {
                        console.log(`Loading next level: ${nextLevel + 1}`);
                        showMessage('pp-message', `🎉 Level ${puzzlePipelineCurrentLevel + 1} completed! Loading next level...`, 'success');
                        setTimeout(() => {
                            loadLevel(nextLevel);
                        }, 2000);
                    } else {
                        console.log('All levels completed for this difficulty');
                        showMessage('pp-message', `🎉 All levels completed on ${difficultySettings[currentDifficulty].name}!`, 'success');
                        localStorage.setItem('cw_puzzle_completed', 'true');
                        updateProgress();
                        
                        setTimeout(() => {
                            showPage('hub-page');
                        }, 3000);
                    }
                }
            }
        }

        function getColor(num) {
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];
            return colors[(num - 1) % colors.length];
        }
    }

    loadLevel(puzzlePipelineCurrentLevel);
}

// Utility functions
function showMessage(elementId, message, type = 'info') {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `game-message ${type}`;
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
}

// Color function for puzzle pipeline
function getColor(num) {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];
    return colors[(num - 1) % colors.length];
}

// Add logout function for testing
function clearRegistration() {
    console.log('Clearing registration data...');
    localStorage.removeItem('cw_player_name');
    localStorage.removeItem('cw_player_email');
    localStorage.removeItem('cw_clear_flow_completed');
    localStorage.removeItem('cw_puzzle_completed');
    console.log('Registration data cleared, redirecting to register page');
    showPage('register-page');
}

// Add this to window for testing in console
window.clearRegistration = clearRegistration;

// Add debugging function to check registration status
function checkRegistrationStatus() {
    const name = localStorage.getItem('cw_player_name');
    const email = localStorage.getItem('cw_player_email');
    console.log('Registration Status:', {
        name: name,
        email: email,
        isRegistered: !!(name && email && name.trim() !== '' && email.trim() !== ''),
        currentPage: currentPage
    });
    return { name, email };
}

window.checkRegistrationStatus = checkRegistrationStatus;
