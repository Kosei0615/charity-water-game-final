// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Difficulty system
let currentDifficulty = 'easy';
const difficultySettings = {
    easy: {
        clearFlowTarget: 512,     // Win at 512 instead of 2048
        puzzleLevels: 3,          // Only play first 3 levels
        timeBonus: 1.5,           // 50% more time for moves
        name: 'Easy Mode',
        color: '#4FCB53'
    },
    normal: {
        clearFlowTarget: 1024,    // Win at 1024
        puzzleLevels: 4,          // Play first 4 levels
        timeBonus: 1.0,           // Normal time
        name: 'Normal Mode',
        color: '#2E9DF7'
    },
    hard: {
        clearFlowTarget: 2048,    // Win at 2048
        puzzleLevels: 5,          // Play all 5 levels
        timeBonus: 0.7,           // 30% less time for moves
        name: 'Hard Mode',
        color: '#F5402C'
    }
};

// Milestone tracking system
const milestones = {
    clearFlow: [
        { score: 64, message: "🌱 Great start! You're making progress!" },
        { score: 128, message: "💧 Water is getting cleaner!" },
        { score: 256, message: "🚀 Halfway there! Keep going!" },
        { score: 512, message: "🌟 Amazing! You're almost there!" },
        { score: 1024, message: "🏆 Outstanding! So close to victory!" }
    ],
    puzzlePipeline: [
        { level: 1, message: "🔧 First connection made! Well done!" },
        { level: 2, message: "🌊 Water is flowing! Keep connecting!" },
        { level: 3, message: "⚡ You're getting the hang of this!" },
        { level: 4, message: "🎯 Master connector! Almost complete!" }
    ]
};

// Track shown milestones to avoid repetition
let shownMilestones = {
    clearFlow: [],
    puzzlePipeline: []
};

// DOM manipulation effects
const domEffects = {
    // Create and animate water droplets
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
            
            // Remove drop after animation
            setTimeout(() => {
                if (drop.parentNode) {
                    drop.parentNode.removeChild(drop);
                }
            }, 3000);
        }
    },
    
    // Create celebratory particles
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
                animation: celebrationPop 2s ease-out forwards;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    },
    
    // Show milestone message
    showMilestone: function(message) {
        const milestone = document.createElement('div');
        milestone.className = 'milestone-popup';
        milestone.innerHTML = message;
        milestone.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FFC907 0%, #2E9DF7 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(46,157,247,0.3);
            animation: milestoneAppear 3s ease-out forwards;
        `;
        document.body.appendChild(milestone);
        
        setTimeout(() => {
            if (milestone.parentNode) {
                milestone.parentNode.removeChild(milestone);
            }
        }, 3000);
    }
};

// Main menu and progress logic for Charity Water Game
// This code shows/hides screens and updates the water tank as games are completed

// Track progress in localStorage
const progress = {
    clearFlow: localStorage.getItem('cw_clearFlow') === 'done',
    puzzlePipeline: localStorage.getItem('cw_puzzlePipeline') === 'done'
};

// Get DOM elements
const mainMenu = document.getElementById('main-menu');
const gameSection = document.getElementById('game-section');
const celebrationSection = document.getElementById('celebration-section');
const waterFill = document.getElementById('water-fill');
const progressText = document.getElementById('progress-text');
const playClearFlowBtn = document.getElementById('play-clear-flow');
const playPuzzlePipelineBtn = document.getElementById('play-puzzle-pipeline');

// Difficulty selection functionality
document.addEventListener('DOMContentLoaded', () => {
    // Set up difficulty buttons
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update current difficulty
            currentDifficulty = button.dataset.difficulty;
            // Save difficulty preference
            localStorage.setItem('cw_difficulty', currentDifficulty);
            
            // Visual feedback
            sounds.click();
            domEffects.createWaterDrops(2);
            
            // Update UI to show selected difficulty
            updateDifficultyDisplay();
        });
    });
    
    // Load saved difficulty preference
    const savedDifficulty = localStorage.getItem('cw_difficulty');
    if (savedDifficulty && difficultySettings[savedDifficulty]) {
        currentDifficulty = savedDifficulty;
        // Update UI to reflect saved difficulty
        difficultyButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty);
        });
    }
    
    updateDifficultyDisplay();
});

// Update difficulty display
function updateDifficultyDisplay() {
    const settings = difficultySettings[currentDifficulty];
    const difficultyInfo = document.querySelector('.difficulty-section h3');
    if (difficultyInfo) {
        difficultyInfo.innerHTML = `Choose Your Difficulty - Current: <span style="color: ${settings.color}">${settings.name}</span>`;
    }
}

// Check and show milestones
function checkMilestones(gameType, value) {
    const milestonesForGame = milestones[gameType];
    if (!milestonesForGame) return;
    
    milestonesForGame.forEach(milestone => {
        const key = gameType === 'clearFlow' ? 'score' : 'level';
        const hasShown = shownMilestones[gameType].includes(milestone[key]);
        
        if (!hasShown && value >= milestone[key]) {
            domEffects.showMilestone(milestone.message);
            domEffects.createCelebration();
            shownMilestones[gameType].push(milestone[key]);
        }
    });
}

// DOMContentLoaded event to set up difficulty buttons
document.addEventListener('DOMContentLoaded', () => {
    // Set up difficulty buttons
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update current difficulty
            currentDifficulty = button.dataset.difficulty;
            // Save difficulty preference
            localStorage.setItem('cw_difficulty', currentDifficulty);
            
            // Visual feedback
            sounds.click();
            domEffects.createWaterDrops(2);
            
            // Update UI to show selected difficulty
            updateDifficultyDisplay();
        });
    });
    
    // Load saved difficulty preference
    const savedDifficulty = localStorage.getItem('cw_difficulty');
    if (savedDifficulty && difficultySettings[savedDifficulty]) {
        currentDifficulty = savedDifficulty;
        // Update UI to reflect saved difficulty
        difficultyButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty);
        });
    }
    
    updateDifficultyDisplay();
});

// Update difficulty display
function updateDifficultyDisplay() {
    const settings = difficultySettings[currentDifficulty];
    const difficultyInfo = document.querySelector('.difficulty-section h3');
    if (difficultyInfo) {
        difficultyInfo.innerHTML = `Choose Your Difficulty - Current: <span style="color: ${settings.color}">${settings.name}</span>`;
    }
}

// Check and show milestones
function checkMilestones(gameType, value) {
    const milestonesForGame = milestones[gameType];
    if (!milestonesForGame) return;
    
    milestonesForGame.forEach(milestone => {
        const key = gameType === 'clearFlow' ? 'score' : 'level';
        const hasShown = shownMilestones[gameType].includes(milestone[key]);
        
        if (!hasShown && value >= milestone[key]) {
            domEffects.showMilestone(milestone.message);
            domEffects.createCelebration();
            shownMilestones[gameType].push(milestone[key]);
        }
    });
}

// --- existing code ---

// Button event listeners
playClearFlowBtn.onclick = () => {
    sounds.click(); // Add click sound
    domEffects.createWaterDrops(2); // Add water drop effects
    mainMenu.style.display = 'none';
    gameSection.style.display = '';
    celebrationSection.style.display = 'none';
    // Show the 2048-style game grid and score
    gameSection.innerHTML = `
        <h2>🚰 Clear the Flow (${difficultySettings[currentDifficulty].name})</h2>
        <div id="cf-score">Score: 0</div>
        <div class="cf-board" id="cf-board"></div>
        <div class="cf-controls">
            <button class="main-btn" id="cf-reset">Reset</button>
            <button class="main-btn" id="back-menu-1">Back to Menu</button>
        </div>
        <div id="cf-message"></div>
    `;
    startClearFlowGame();
    document.getElementById('back-menu-1').onclick = showMainMenu;
    document.getElementById('cf-reset').onclick = startClearFlowGame;
};

// --- 2048-style Clear the Flow Game ---
function startClearFlowGame() {
    // 4x4 grid, filled with 0 (empty)
    let board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];
    let score = 0;
    let gameOver = false;
    const boardDiv = document.getElementById('cf-board');
    const scoreDiv = document.getElementById('cf-score');
    const messageDiv = document.getElementById('cf-message');

    // Add instructions
    if (!document.getElementById('cf-instructions')) {
        const instr = document.createElement('div');
        instr.id = 'cf-instructions';
        instr.className = 'game-instructions';
        instr.innerHTML = `
            <strong>How to Play Clear the Flow:</strong><br>
            <ul>
                <li>Use your <b>arrow keys</b> to move the tiles up, down, left, or right.</li>
                <li>When two tiles with the same number touch, they merge into one bigger number!</li>
                <li>Try to reach <b>2048</b> to filter the water and win.</li>
                <li>If you can't make any more moves, you can reset and try again.</li>
            </ul>
        `;
        boardDiv.parentElement.insertBefore(instr, boardDiv);
    }

    // Add two starting tiles
    addRandomTile();
    addRandomTile();
    updateBoard();
    updateBackground();
    messageDiv.textContent = '';

    // Listen for arrow keys
    window.onkeydown = function(e) {
        // Prevent page scroll with arrow keys
        if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) {
            e.preventDefault();
        }
        handleKey(e);
    };

    // --- Touch controls for mobile (swipe) ---
    function setupCFMobileTouch() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchMoved = false;
        boardDiv.ontouchstart = function(e) {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchMoved = false;
            }
        };
        boardDiv.ontouchmove = function(e) {
            if (e.touches.length === 1) {
                e.preventDefault();
                touchMoved = true;
            }
        };
        boardDiv.ontouchend = function(e) {
            if (gameOver) return;
            if (e.changedTouches.length === 1 && touchMoved) {
                const dx = e.changedTouches[0].clientX - touchStartX;
                const dy = e.changedTouches[0].clientY - touchStartY;
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 30) handleKey({key: 'ArrowRight'});
                    else if (dx < -30) handleKey({key: 'ArrowLeft'});
                } else {
                    if (dy > 30) handleKey({key: 'ArrowDown'});
                    else if (dy < -30) handleKey({key: 'ArrowUp'});
                }
            }
        };
    }
    setupCFMobileTouch();

    // Reset button resets the game
    document.getElementById('cf-reset').onclick = () => {
        sounds.click(); // Add click sound
        window.onkeydown = null;
        startClearFlowGame();
    };

    // Helper: Add a random tile (2 or 4)
    function addRandomTile() {
        const empty = [];
        for (let r=0; r<4; r++) {
            for (let c=0; c<4; c++) {
                if (board[r][c] === 0) empty.push([r,c]);
            }
        }
        if (empty.length === 0) return;
        const [r, c] = empty[Math.floor(Math.random() * empty.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    // Helper: Update the board UI
    function updateBoard() {
        scoreDiv.textContent = `Score: ${score} | Target: ${difficultySettings[currentDifficulty].clearFlowTarget} | Mode: ${difficultySettings[currentDifficulty].name}`;
        boardDiv.innerHTML = '';
        
        // Check milestones
        checkMilestones('clearFlow', score);
        
        for (let r=0; r<4; r++) {
            for (let c=0; c<4; c++) {
                const tile = document.createElement('div');
                tile.className = 'cf-tile';
                tile.textContent = board[r][c] === 0 ? '' : board[r][c];
                tile.setAttribute('data-value', board[r][c]);
                
                // Add special styling for target tile
                if (board[r][c] === difficultySettings[currentDifficulty].clearFlowTarget) {
                    tile.style.border = '3px solid #FFC907';
                    tile.style.boxShadow = '0 0 20px rgba(255,201,7,0.5)';
                }
                
                // Add click interaction for visual feedback
                if (board[r][c] > 0) {
                    tile.addEventListener('click', () => {
                        // Create a ripple effect
                        const ripple = document.createElement('div');
                        ripple.className = 'tile-ripple';
                        ripple.style.cssText = `
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            width: 10px;
                            height: 10px;
                            background: rgba(255,201,7,0.6);
                            border-radius: 50%;
                            transform: translate(-50%, -50%);
                            animation: rippleExpand 0.6s ease-out;
                            pointer-events: none;
                        `;
                        tile.style.position = 'relative';
                        tile.appendChild(ripple);
                        
                        // Remove ripple after animation
                        setTimeout(() => {
                            if (ripple.parentNode) {
                                ripple.parentNode.removeChild(ripple);
                            }
                        }, 600);
                        
                        sounds.click();
                    });
                }
                
                boardDiv.appendChild(tile);
            }
        }
    }

    // Helper: Move and merge tiles
    function handleKey(e) {
        if (gameOver) return;
        let moved = false;
        const oldScore = score;
        if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) {
            let oldBoard = JSON.stringify(board);
            if (e.key === "ArrowLeft") moveLeft();
            if (e.key === "ArrowRight") moveRight();
            if (e.key === "ArrowUp") moveUp();
            if (e.key === "ArrowDown") moveDown();
            if (JSON.stringify(board) !== oldBoard) moved = true;
        }
        if (moved) {
            sounds.move(); // Play move sound
            if (score > oldScore) {
                sounds.merge(); // Play merge sound if score increased
            }
            addRandomTile();
            updateBoard();
            updateBackground();
            checkGameOver();
        }
    }

    // Move helpers
    function moveLeft() {
        for (let r=0; r<4; r++) {
            let row = board[r].filter(x => x);
            for (let c=0; c<row.length-1; c++) {
                if (row[c] === row[c+1]) {
                    row[c] *= 2;
                    score += row[c];
                    row[c+1] = 0;
                }
            }
            row = row.filter(x => x);
            while (row.length < 4) row.push(0);
            board[r] = row;
        }
    }
    function moveRight() {
        for (let r=0; r<4; r++) {
            let row = board[r].filter(x => x);
            for (let c=row.length-1; c>0; c--) {
                if (row[c] === row[c-1]) {
                    row[c] *= 2;
                    score += row[c];
                    row[c-1] = 0;
                }
            }
            row = row.filter(x => x);
            while (row.length < 4) row.unshift(0);
            board[r] = row;
        }
    }
    function moveUp() {
        for (let c=0; c<4; c++) {
            let col = [];
            for (let r=0; r<4; r++) col.push(board[r][c]);
            col = col.filter(x => x);
            for (let r=0; r<col.length-1; r++) {
                if (col[r] === col[r+1]) {
                    col[r] *= 2;
                    score += col[r];
                    col[r+1] = 0;
                }
            }
            col = col.filter(x => x);
            while (col.length < 4) col.push(0);
            for (let r=0; r<4; r++) board[r][c] = col[r];
        }
    }
    function moveDown() {
        for (let c=0; c<4; c++) {
            let col = [];
            for (let r=0; r<4; r++) col.push(board[r][c]);
            col = col.filter(x => x);
            for (let r=col.length-1; r>0; r--) {
                if (col[r] === col[r-1]) {
                    col[r] *= 2;
                    score += col[r];
                    col[r-1] = 0;
                }
            }
            col = col.filter(x => x);
            while (col.length < 4) col.unshift(0);
            for (let r=0; r<4; r++) board[r][c] = col[r];
        }
    }

    // Check for win or game over
    function checkGameOver() {
        // Get current difficulty target
        const winTarget = difficultySettings[currentDifficulty].clearFlowTarget;
        
        // Win if target tile is reached
        for (let r=0; r<4; r++) {
            for (let c=0; c<4; c++) {
                if (board[r][c] === winTarget) {
                    sounds.win(); // Play win sound
                    domEffects.createCelebration(); // Add celebration effects
                    messageDiv.innerHTML = `<span class="cf-win">🎉 You filtered the water on ${difficultySettings[currentDifficulty].name}!<br>Click Back to Menu.</span>`;
                    window.onkeydown = null;
                    // Mark as complete using per-player progress
                    markClearFlowComplete();
                    gameOver = true;
                    return;
                }
            }
        }
        // Lose if no moves left
        if (!canMove()) {
            messageDiv.innerHTML = '<span class="cf-lose">No more moves! Try again.</span>';
            window.onkeydown = null;
            gameOver = true;
        }
    }
    // Can move?
    function canMove() {
        for (let r=0; r<4; r++) {
            for (let c=0; c<4; c++) {
                if (board[r][c] === 0) return true;
                if (c<3 && board[r][c] === board[r][c+1]) return true;
                if (r<3 && board[r][c] === board[r+1][c]) return true;
            }
        }
        return false;
    }
    // Water background gets clearer as score increases
    function updateBackground() {
        // Start with NO blur so numbers are always visible
        let blur = 0;
        boardDiv.style.background = `url('img/water-can-transparent.png') center/cover`;
        boardDiv.style.filter = `blur(${blur}px)`;
    }
}

playPuzzlePipelineBtn.onclick = () => {
    sounds.click(); // Add click sound
    domEffects.createWaterDrops(2); // Add water drop effects
    mainMenu.style.display = 'none';
    gameSection.style.display = '';
    celebrationSection.style.display = 'none';
    // Show the Puzzle Pipeline game
    gameSection.innerHTML = `
        <h2>🔗 Puzzle Pipeline (${difficultySettings[currentDifficulty].name})</h2>
        <div id="pp-instructions">Connect the numbers in order to make a path from the water source to the tank!</div>
        <div class="pp-board" id="pp-board"></div>
        <div class="pp-controls">
            <button class="main-btn" id="pp-reset">Reset</button>
            <button class="main-btn" id="pp-next-level">Next Level</button>
            <button class="main-btn" id="back-menu-2">Back to Menu</button>
        </div>
        <div id="pp-message"></div>
    `;
    let currentLevel = 0;
    function launchLevel(levelIdx) {
        startPuzzlePipeline(levelIdx);
        // Update Next Level button
        document.getElementById('pp-next-level').onclick = () => {
            currentLevel = (levelIdx + 1) % 5;
            launchLevel(currentLevel);
        };
        document.getElementById('pp-reset').onclick = () => launchLevel(levelIdx);
    }
    launchLevel(currentLevel);
    document.getElementById('back-menu-2').onclick = showMainMenu;
};

// --- Number Link (Flow Free) Style Puzzle Pipeline ---
function startPuzzlePipeline(levelIndex = 0) {
    // Get max levels based on difficulty
    const maxLevels = difficultySettings[currentDifficulty].puzzleLevels;
    
    // Each level: grid, 0=empty, 1/2/3...=numbered endpoints
    const levels = [
        // Level 1: 4x4, 2 pairs (easy)
        {
            grid: [
                [1, 0, 0, 2],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 0, 0, 2]
            ],
            size: 4
        },
        // Level 2: 4x4, 3 pairs (medium)
        {
            grid: [
                [1, 0, 0, 0],
                [0, 0, 2, 0],
                [0, 3, 1, 0],
                [2, 0, 0, 3]
            ],
            size: 4
        },
        // Level 3: 5x5, 3 pairs (clearable, each number appears twice)
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
        // Level 4: 5x5, 4 pairs (clearable, each number appears twice)
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
        // Level 5: 6x6, 4 pairs (Flow Free style, each number appears exactly twice)
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
    const level = levels[levelIndex];
    const size = level.size;
    const grid = level.grid;
    // Find all endpoints
    const endpoints = {};
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const val = grid[r][c];
            if (val) {
                if (!endpoints[val]) endpoints[val] = [];
                endpoints[val].push([r, c]);
            }
        }
    }
    let paths = {}; // {number: [[r,c], ...]}
    let drawing = null; // {number, path: [[r,c], ...]}
    let solved = false;
    const boardDiv = document.getElementById('pp-board');
    const messageDiv = document.getElementById('pp-message');

    // Add instructions
    if (!document.getElementById('pp-instructions-box')) {
        const instr = document.createElement('div');
        instr.id = 'pp-instructions-box';
        instr.className = 'game-instructions';
        instr.innerHTML = `
            <strong>How to Play Puzzle Pipeline (${difficultySettings[currentDifficulty].name}):</strong><br>
            <ul>
                <li>Connect matching numbers by dragging a path between them.</li>
                <li>Paths can't cross or overlap each other.</li>
                <li>Fill the whole grid to win the level!</li>
                <li><b>You must connect the lowest-numbered pair first (start with 1), then the next lowest, and so on.</b></li>
                <li>Playing ${maxLevels} levels on ${difficultySettings[currentDifficulty].name}!</li>
            </ul>
        `;
        boardDiv.parentElement.insertBefore(instr, boardDiv);
    }

    // Helper: find the next number to connect
    function getNextNumberToConnect() {
        // Find all numbers in endpoints
        const nums = Object.keys(endpoints).map(Number);
        // Find which numbers are already completed
        const done = Object.keys(paths).map(Number);
        // The next number is the smallest in nums not in done
        const remaining = nums.filter(n => !done.includes(n));
        return Math.min(...remaining);
    }

    // Draw the board
    function drawBoard() {
        boardDiv.innerHTML = '';
        boardDiv.style.gridTemplateColumns = `repeat(${size}, 60px)`;
        boardDiv.style.gridTemplateRows = `repeat(${size}, 60px)`;
        // Find which number is allowed to start
        const nextNum = getNextNumberToConnect();
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const val = grid[r][c];
                const cell = document.createElement('div');
                cell.className = 'pp-cell';
                // Show endpoint number
                if (val) {
                    cell.textContent = val;
                    cell.classList.add('pp-endpoint');
                    // Only allow starting from the nextNum
                    if (val !== nextNum) {
                        cell.classList.add('pp-endpoint-disabled');
                        cell.style.opacity = '0.4';
                        cell.style.pointerEvents = 'none';
                    }
                } else {
                    cell.textContent = '';
                }
                // Show path color
                for (let n in paths) {
                    if (paths[n].some(([pr, pc]) => pr === r && pc === c)) {
                        cell.classList.add('pp-path');
                        cell.style.background = getColor(n);
                        cell.style.color = '#fff';
                    }
                }
                // Show drawing path
                if (drawing && drawing.path.some(([pr, pc]) => pr === r && pc === c)) {
                    cell.classList.add('pp-path');
                    cell.style.background = getColor(drawing.number);
                    cell.style.color = '#fff';
                }
                // Mouse events only (revert touch logic)
                cell.onmousedown = () => {
                    if (val && !solved && val === nextNum) {
                        drawing = { number: val, path: [[r, c]] };
                        drawBoard();
                    }
                };
                cell.onmouseenter = (e) => {
                    if (drawing && !solved) {
                        const last = drawing.path[drawing.path.length - 1];
                        if (isAdjacent(last, [r, c]) && !isCellBlocked([r, c], drawing.number)) {
                            // If endpoint and matches, finish path
                            if (val === drawing.number && !drawing.path.some(([pr, pc]) => pr === r && pc === c) && endpoints[drawing.number].some(([er, ec]) => er === r && ec === c)) {
                                sounds.connect(); // Play connection sound
                                drawing.path.push([r, c]);
                                paths[drawing.number] = drawing.path.slice();
                                drawing = null;
                                drawBoard();
                                checkWin();
                                return;
                            }
                            // If empty or already in path, continue
                            if (!drawing.path.some(([pr, pc]) => pr === r && pc === c) && !val) {
                                sounds.connect(); // Play connection sound
                                drawing.path.push([r, c]);
                                drawBoard();
                            }
                        }
                    }
                };
                cell.onmouseup = () => {
                    if (drawing) {
                        drawing = null;
                        drawBoard();
                    }
                };
                
                // Touch support for mobile devices
                cell.ontouchstart = (e) => {
                    e.preventDefault(); // Prevent mouse events
                    if (solved) return;
                    const nextNum = getNextNumberToConnect();
                    if (val && val === nextNum) {
                        sounds.click(); // Play click sound
                        drawing = { number: val, path: [[r, c]] };
                        drawBoard();
                    }
                };
                
                cell.ontouchmove = (e) => {
                    e.preventDefault();
                    if (drawing && !solved) {
                        const touch = e.touches[0];
                        const target = document.elementFromPoint(touch.clientX, touch.clientY);
                        if (target && target.classList.contains('pp-cell')) {
                            const tr = parseInt(target.dataset.row, 10);
                            const tc = parseInt(target.dataset.col, 10);
                            const last = drawing.path[drawing.path.length - 1];
                            if (isAdjacent(last, [tr, tc]) && !isCellBlocked([tr, tc], drawing.number)) {
                                const tval = grid[tr][tc];
                                // If endpoint and matches, finish path
                                if (tval === drawing.number && !drawing.path.some(([pr, pc]) => pr === tr && pc === tc) && endpoints[drawing.number].some(([er, ec]) => er === tr && ec === tc)) {
                                    sounds.connect(); // Play connection sound
                                    drawing.path.push([tr, tc]);
                                    paths[drawing.number] = drawing.path.slice();
                                    drawing = null;
                                    drawBoard();
                                    checkWin();
                                    return;
                                }
                                // If empty or already in path, continue
                                if (!drawing.path.some(([pr, pc]) => pr === tr && pc === tc) && !tval) {
                                    sounds.connect(); // Play connection sound
                                    drawing.path.push([tr, tc]);
                                    drawBoard();
                                }
                            }
                        }
                    }
                };
                
                cell.ontouchend = (e) => {
                    e.preventDefault();
                    if (drawing) {
                        drawing = null;
                        drawBoard();
                    }
                };
                
                boardDiv.appendChild(cell);
            }
        }
    }
    // Helper
    function isAdjacent(a, b) {
        const dr = Math.abs(a[0] - b[0]);
        const dc = Math.abs(a[1] - b[1]);
        return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
    }
    function isCellBlocked([r, c], number) {
        // Can't cross other paths
        for (let n in paths) {
            if (n !== String(number) && paths[n].some(([pr, pc]) => pr === r && pc === c)) return true;
        }
        // Can't cross own path except at endpoints
        if (paths[number] && paths[number].some(([pr, pc]) => pr === r && pc === c)) return true;
        return false;
    }
    function getColor(n) {
        // Pick a color for each number
        const colors = ['#2E9DF7', '#FFC907', '#4FCB53', '#F5402C', '#8BD1CB', '#FF902A'];
        return colors[(n-1)%colors.length];
    }
    function checkWin() {
        // All cells filled and all paths connect endpoints
        let filled = 0;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                let inPath = false;
                for (let n in paths) {
                    if (paths[n].some(([pr, pc]) => pr === r && pc === c)) inPath = true;
                }
                if (inPath || grid[r][c]) filled++;
            }
        }
        if (filled === size*size && Object.keys(paths).length === Object.keys(endpoints).length) {
            solved = true;
            sounds.complete(); // Play completion sound
            domEffects.createCelebration(); // Add celebration effects
            domEffects.createWaterDrops(3); // Add water drops
            
            // Check milestone
            checkMilestones('puzzlePipeline', levelIndex + 1);
            
            // Remove any previous overlay
            let oldOverlay = document.getElementById('pp-win-overlay');
            if (oldOverlay) oldOverlay.remove();
            
            // Create overlay for centered win message
            const overlay = document.createElement('div');
            overlay.id = 'pp-win-overlay';
            overlay.className = 'pp-win-center';
            
            // Check if this is the last level for current difficulty
            const maxLevels = difficultySettings[currentDifficulty].puzzleLevels;
            const isLastLevel = levelIndex >= maxLevels - 1;
            
            if (isLastLevel) {
                overlay.innerHTML = `🎉 Water flows!<br>You completed ${difficultySettings[currentDifficulty].name}!<br>Back to the main hub...`;
            } else {
                overlay.innerHTML = `🎉 Water flows!<br>Level ${levelIndex + 1} complete!<br>Moving to Next Level...`;
            }
            
            document.body.appendChild(overlay);
            markPuzzlePipelineLevelComplete(levelIndex);
            
            if (isLastLevel) {
                setTimeout(() => {
                    overlay.remove();
                    showMainMenu();
                    // If player finished all, record time and update leaderboard
                    if (currentPlayer && currentPlayer.clearFlow && currentPlayer.puzzlePipelineLevels === maxLevels) {
                        const end = Date.now();
                        let start = parseInt(localStorage.getItem('cw_startTime_' + currentPlayer.email) || '0', 10);
                        if (!start) start = end;
                        const duration = Math.floor((end - start) / 1000);
                        let leaderboard = JSON.parse(localStorage.getItem('cw_leaderboard') || '[]');
                        leaderboard.push({ name: currentPlayer.name, email: currentPlayer.email, time: duration });
                        leaderboard.sort((a, b) => a.time - b.time);
                        localStorage.setItem('cw_leaderboard', JSON.stringify(leaderboard));
                    }
                }, 2000);
            } else {
                setTimeout(() => {
                    overlay.remove();
                    startPuzzlePipeline(levelIndex + 1);
                }, 1500);
            }
        } else {
            messageDiv.textContent = '';
        }
    }
    
    // Prevent page scrolling when touching the game board on mobile
    boardDiv.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Reset
    document.getElementById('pp-reset').onclick = () => {
        sounds.click(); // Add click sound
        paths = {};
        drawing = null;
        solved = false;
        messageDiv.textContent = '';
        drawBoard();
    };
    // Next Level
    if (!document.getElementById('pp-next-level')) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'main-btn';
        nextBtn.id = 'pp-next-level';
        nextBtn.textContent = 'Next Level';
        nextBtn.onclick = () => {
            let next = (levelIndex + 1) % levels.length;
            startPuzzlePipeline(next);
        };
        boardDiv.parentElement.appendChild(nextBtn);
    }
    // Initial draw
    drawBoard();
    messageDiv.textContent = '';
}

// --- Puzzle Pipeline now has responsive design and works well on all devices ---

// --- Player Registration and Per-Player Progress ---
// Store player info and progress in localStorage by email
const playerForm = document.getElementById('player-form');
const playerNameInput = document.getElementById('player-name');
const playerEmailInput = document.getElementById('player-email');
let currentPlayer = null;

function loadPlayer(email) {
    const data = localStorage.getItem('cw_player_' + email);
    if (data) {
        return JSON.parse(data);
    }
    return { name: '', email: email, clearFlow: false, puzzlePipeline: false, puzzlePipelineLevels: 0 };
}
function savePlayer(player) {
    localStorage.setItem('cw_player_' + player.email, JSON.stringify(player));
}

playerForm.onsubmit = function(e) {
    e.preventDefault();
    const name = playerNameInput.value.trim();
    const email = playerEmailInput.value.trim().toLowerCase();
    if (!name || !email) return;
    currentPlayer = loadPlayer(email);
    currentPlayer.name = name;
    savePlayer(currentPlayer);
    playerForm.style.display = 'none';
    mainMenu.querySelector('.water-tank-container').style.display = '';
    mainMenu.querySelector('.game-buttons').style.display = '';
    updateProgress();
};

// Hide main menu content until player logs in
if (!currentPlayer) {
    mainMenu.querySelector('.water-tank-container').style.display = 'none';
    mainMenu.querySelector('.game-buttons').style.display = 'none';
}

// Update progress logic for per-player
function updateProgress() {
    if (!currentPlayer) return;
    let completedCF = currentPlayer.clearFlow ? 1 : 0;
    let completedPP = currentPlayer.puzzlePipelineLevels || 0;
    let percent = 0;
    if (completedCF) percent += 50;
    percent += completedPP * 10;
    if (percent > 100) percent = 100;
    waterFill.style.height = `${percent}%`;
    progressText.textContent = `Progress: ${completedCF + completedPP}/6 games completed`;
    if (completedCF && completedPP === 5) {
        showCelebration();
    }
}

// Update game completion to per-player
function markClearFlowComplete() {
    if (!currentPlayer) return;
    currentPlayer.clearFlow = true;
    savePlayer(currentPlayer);
    updateProgress();
}
function markPuzzlePipelineLevelComplete(level) {
    if (!currentPlayer) return;
    if (level + 1 > (currentPlayer.puzzlePipelineLevels || 0)) {
        currentPlayer.puzzlePipelineLevels = level + 1;
        if (level === 4) currentPlayer.puzzlePipeline = true;
        savePlayer(currentPlayer);
    }
    updateProgress();
}

// Show charity info section after tank is filled
function showCharityInfo() {
    mainMenu.style.display = 'none';
    gameSection.style.display = 'none';
    celebrationSection.style.display = 'none';
    document.getElementById('charity-info-section').style.display = '';
}

// Subscribe form logic
const subscribeForm = document.getElementById('subscribe-form');
if (subscribeForm) {
    subscribeForm.onsubmit = function(e) {
        e.preventDefault();
        const email = document.getElementById('subscribe-email').value.trim();
        if (email) {
            alert(`Thank you for subscribing, ${email}!`);
            subscribeForm.reset();
        }
    };
}

// --- Update game logic to use per-player progress ---
// In Clear the Flow, call markClearFlowComplete() on win
// In Puzzle Pipeline, call markPuzzlePipelineLevelComplete(levelIndex) on win

// --- Patch: Ensure progress updates immediately on level clear ---
// In Puzzle Pipeline, after checkWin() and marking level complete, call updateProgress() right away

// --- Track start time when player starts first game ---
playClearFlowBtn.onclick = () => {
    if (currentPlayer && !localStorage.getItem('cw_startTime_' + currentPlayer.email)) {
        localStorage.setItem('cw_startTime_' + currentPlayer.email, Date.now().toString());
    }
    mainMenu.style.display = 'none';
    gameSection.style.display = '';
    celebrationSection.style.display = 'none';
    // Show the 2048-style game grid and score
    gameSection.innerHTML = `
        <h2>🚰 Clear the Flow</h2>
        <div id="cf-score">Score: 0</div>
        <div class="cf-board" id="cf-board"></div>
        <div class="cf-controls">
            <button class="main-btn" id="cf-reset">Reset</button>
            <button class="main-btn" id="back-menu-1">Back to Menu</button>
        </div>
        <div id="cf-message"></div>
    `;
    startClearFlowGame();
    document.getElementById('back-menu-1').onclick = showMainMenu;
    document.getElementById('cf-reset').onclick = startClearFlowGame;
};

// --- Show leaderboard on main menu ---
function showLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('cw_leaderboard') || '[]');
    if (!leaderboard.length) return '';
    let html = '<div class="leaderboard"><h3>🏆 Fastest Water Cleaners</h3><table><tr><th>Name</th><th>Time (s)</th></tr>';
    leaderboard.slice(0, 10).forEach(entry => {
        html += `<tr><td>${entry.name}</td><td>${entry.time}</td></tr>`;
    });
    html += '</table></div>';
    return html;
}

// Patch: Insert leaderboard into main menu
mainMenu.insertAdjacentHTML('beforeend', showLeaderboard());

// On page load, show main menu and update progress
showMainMenu();

// Temporary testing functionality
document.addEventListener('DOMContentLoaded', () => {
    const testBtn = document.getElementById('test-celebration');
    if (testBtn) {
        testBtn.onclick = () => {
            sounds.click();
            showCelebration();
        };
    }
});
