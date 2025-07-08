// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

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

// Update progress logic for new tank rules
function updateProgress() {
    // Count completed games and levels
    let completedCF = progress.clearFlow ? 1 : 0;
    let completedPP = parseInt(localStorage.getItem('cw_puzzlePipelineLevels') || '0', 10);
    // Water tank: 0% at start, 50% for Clear the Flow, +10% per Puzzle Pipeline level
    let percent = 0;
    if (completedCF) percent += 50;
    percent += completedPP * 10;
    if (percent > 100) percent = 100;
    waterFill.style.height = `${percent}%`;
    progressText.textContent = `Progress: ${completedCF + completedPP}/6 games completed`;
    // If all done, show celebration
    if (completedCF && completedPP === 5) {
        showCelebration();
    }
}

// Show main menu
function showMainMenu() {
    mainMenu.style.display = '';
    gameSection.style.display = 'none';
    celebrationSection.style.display = 'none';
    updateProgress();
    // Ensure the mobile button is always present after registration
    if (!document.getElementById('play-puzzle-pipeline-mobile') && document.getElementById('play-puzzle-pipeline')) {
        const playPuzzlePipelineBtn = document.getElementById('play-puzzle-pipeline');
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'main-btn';
        mobileBtn.id = 'play-puzzle-pipeline-mobile';
        mobileBtn.textContent = 'Puzzle Pipeline (Mobile)';
        playPuzzlePipelineBtn.parentElement.appendChild(mobileBtn);
        mobileBtn.onclick = () => {
            mainMenu.style.display = 'none';
            gameSection.style.display = '';
            celebrationSection.style.display = 'none';
            // Show the mobile Puzzle Pipeline game
            gameSection.innerHTML = `
                <h2>🔗 Puzzle Pipeline (Mobile)</h2>
                <div id="pp-instructions-mobile">Draw a path with your finger to connect the numbers in order!</div>
                <div class="pp-board" id="pp-board-mobile"></div>
                <div class="pp-controls">
                    <button class="main-btn" id="pp-reset-mobile">Reset</button>
                    <button class="main-btn" id="pp-next-level-mobile">Next Level</button>
                    <button class="main-btn" id="back-menu-mobile">Back to Menu</button>
                </div>
                <div id="pp-message-mobile"></div>
            `;
            let currentLevel = 0;
            function launchMobileLevel(levelIdx) {
                startPuzzlePipelineMobile(levelIdx);
                document.getElementById('pp-next-level-mobile').onclick = () => {
                    currentLevel = (levelIdx + 1) % 5;
                    launchMobileLevel(currentLevel);
                };
                document.getElementById('pp-reset-mobile').onclick = () => launchMobileLevel(levelIdx);
            }
            launchMobileLevel(currentLevel);
            document.getElementById('back-mobile').onclick = showMainMenu;
        };
    }
}

// Show celebration screen
function showCelebration() {
    mainMenu.style.display = 'none';
    gameSection.style.display = 'none';
    celebrationSection.style.display = '';
    celebrationSection.innerHTML = `
        <div class="celebrate">
            <h2>🎉 You cleaned the water! 🎉</h2>
            <p>Thanks for playing and learning about clean water.</p>
            <p class="fact">💧 Did you know? Every $40 can bring clean water to one person for life!</p>
            <a href="https://www.charitywater.org/" target="_blank" class="main-btn">Learn more at charity: water</a>
            <button class="main-btn" id="reset-progress">Reset Progress</button>
        </div>
    `;
    // Add reset button event
    document.getElementById('reset-progress').onclick = () => {
        localStorage.removeItem('cw_clearFlow');
        localStorage.removeItem('cw_puzzlePipeline');
        localStorage.removeItem('cw_puzzlePipelineLevels');
        progress.clearFlow = false;
        progress.puzzlePipeline = false;
        showMainMenu();
    };
}

// Button event listeners
playClearFlowBtn.onclick = () => {
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
        scoreDiv.textContent = `Score: ${score}`;
        boardDiv.innerHTML = '';
        for (let r=0; r<4; r++) {
            for (let c=0; c<4; c++) {
                const tile = document.createElement('div');
                tile.className = 'cf-tile';
                tile.textContent = board[r][c] === 0 ? '' : board[r][c];
                tile.setAttribute('data-value', board[r][c]);
                boardDiv.appendChild(tile);
            }
        }
    }

    // Helper: Move and merge tiles
    function handleKey(e) {
        if (gameOver) return;
        let moved = false;
        if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) {
            let oldBoard = JSON.stringify(board);
            if (e.key === "ArrowLeft") moveLeft();
            if (e.key === "ArrowRight") moveRight();
            if (e.key === "ArrowUp") moveUp();
            if (e.key === "ArrowDown") moveDown();
            if (JSON.stringify(board) !== oldBoard) moved = true;
        }
        if (moved) {
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
        // Win if 2048 tile is present
        for (let r=0; r<4; r++) {
            for (let c=0; c<4; c++) {
                if (board[r][c] === 2048) {
                    messageDiv.innerHTML = '<span class="cf-win">🎉 You filtered the water!<br>Click Back to Menu.</span>';
                    window.onkeydown = null;
                    // Mark as complete in progress
                    localStorage.setItem('cw_clearFlow', 'done');
                    progress.clearFlow = true;
                    updateProgress();
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
    mainMenu.style.display = 'none';
    gameSection.style.display = '';
    celebrationSection.style.display = 'none';
    // Show the Puzzle Pipeline game
    gameSection.innerHTML = `
        <h2>🔗 Puzzle Pipeline</h2>
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
            <strong>How to Play Puzzle Pipeline:</strong><br>
            <ul>
                <li>Connect matching numbers by dragging a path between them.</li>
                <li>Paths can't cross or overlap each other.</li>
                <li>Fill the whole grid to win the level!</li>
                <li><b>You must connect the lowest-numbered pair first (start with 1), then the next lowest, and so on.</b></li>
                <li>Try all 5 levels. Each one gets a bit trickier!</li>
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
                                drawing.path.push([r, c]);
                                paths[drawing.number] = drawing.path.slice();
                                drawing = null;
                                drawBoard();
                                checkWin();
                                return;
                            }
                            // If empty or already in path, continue
                            if (!drawing.path.some(([pr, pc]) => pr === r && pc === c) && !val) {
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
            // Remove any previous overlay
            let oldOverlay = document.getElementById('pp-win-overlay');
            if (oldOverlay) oldOverlay.remove();
            // Create overlay for centered win message
            const overlay = document.createElement('div');
            overlay.id = 'pp-win-overlay';
            overlay.className = 'pp-win-center';
            if (levelIndex === levels.length - 1) {
                overlay.innerHTML = `🎉 Water flows!<br>You solved the pipeline!<br>Back to the main hub...`;
            } else {
                overlay.innerHTML = `🎉 Water flows!<br>You solved the pipeline!<br>Moving to Next Level...`;
            }
            document.body.appendChild(overlay);
            markPuzzlePipelineLevelComplete(levelIndex);
            if (levelIndex === levels.length - 1) {
                setTimeout(() => {
                    overlay.remove();
                    showMainMenu();
                    // If player finished all, record time and update leaderboard
                    if (currentPlayer && currentPlayer.clearFlow && currentPlayer.puzzlePipelineLevels === 5) {
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
    // Reset
    document.getElementById('pp-reset').onclick = () => {
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

// Add a button for mobile Puzzle Pipeline in the main menu
if (!document.getElementById('play-puzzle-pipeline-mobile')) {
    const mobileBtn = document.createElement('button');
    mobileBtn.className = 'main-btn';
    mobileBtn.id = 'play-puzzle-pipeline-mobile';
    mobileBtn.textContent = 'Puzzle Pipeline (Mobile)';
    // Insert after the desktop button
    playPuzzlePipelineBtn.parentElement.appendChild(mobileBtn);
    mobileBtn.onclick = () => {
        mainMenu.style.display = 'none';
        gameSection.style.display = '';
        celebrationSection.style.display = 'none';
        // Show the mobile Puzzle Pipeline game
        gameSection.innerHTML = `
            <h2>🔗 Puzzle Pipeline (Mobile)</h2>
            <div id="pp-instructions-mobile">Draw a path with your finger to connect the numbers in order!</div>
            <div class="pp-board" id="pp-board-mobile"></div>
            <div class="pp-controls">
                <button class="main-btn" id="pp-reset-mobile">Reset</button>
                <button class="main-btn" id="pp-next-level-mobile">Next Level</button>
                <button class="main-btn" id="back-menu-mobile">Back to Menu</button>
            </div>
            <div id="pp-message-mobile"></div>
        `;
        let currentLevel = 0;
        function launchMobileLevel(levelIdx) {
            startPuzzlePipelineMobile(levelIdx);
            document.getElementById('pp-next-level-mobile').onclick = () => {
                currentLevel = (levelIdx + 1) % 5;
                launchMobileLevel(currentLevel);
            };
            document.getElementById('pp-reset-mobile').onclick = () => launchMobileLevel(levelIdx);
        }
        launchMobileLevel(currentLevel);
        document.getElementById('back-mobile').onclick = showMainMenu;
    };
}

// --- Mobile-optimized Puzzle Pipeline (touch path-drawing) ---
function startPuzzlePipelineMobile(levelIndex = 0) {
    // Same levels as desktop
    const levels = [
        { grid: [ [1,0,0,2],[0,0,0,0],[0,0,0,0],[1,0,0,2] ], size: 4 },
        { grid: [ [1,0,0,0],[0,0,2,0],[0,3,1,0],[2,0,0,3] ], size: 4 },
        { grid: [ [1,3,0,0,0],[0,0,2,0,0],[0,0,1,0,0],[0,0,0,0,0],[2,0,0,0,3] ], size: 5 },
        { grid: [ [1,0,0,2,3],[0,2,3,0,0],[0,0,4,0,0],[5,0,0,0,0],[0,0,5,1,4] ], size: 5 },
        { grid: [ [1,0,0,2,0,0],[0,0,0,0,0,0],[0,3,0,0,0,0],[0,1,0,0,0,4],[0,4,2,0,0,0],[3,0,0,0,0,0] ], size: 6 }
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
    const boardDiv = document.getElementById('pp-board-mobile');
    const messageDiv = document.getElementById('pp-message-mobile');

    // Add instructions (only once)
    if (!document.getElementById('pp-instructions-mobile-box')) {
        const instr = document.createElement('div');
        instr.id = 'pp-instructions-mobile-box';
        instr.className = 'game-instructions';
        instr.innerHTML = `
            <strong>How to Play Puzzle Pipeline (Mobile):</strong><br>
            <ul>
                <li>Use your <b>finger</b> to draw a path between matching numbers.</li>
                <li>Paths can't cross or overlap each other.</li>
                <li>Fill the whole grid to win the level!</li>
                <li><b>You must connect the lowest-numbered pair first (start with 1), then the next lowest, and so on.</b></li>
                <li>Try all 5 levels. Each one gets a bit trickier!</li>
            </ul>
        `;
        boardDiv.parentElement.insertBefore(instr, boardDiv);
    }

    // Helper: find the next number to connect
    function getNextNumberToConnect() {
        const nums = Object.keys(endpoints).map(Number);
        const done = Object.keys(paths).map(Number);
        const remaining = nums.filter(n => !done.includes(n));
        return Math.min(...remaining);
    }

    // Draw the board
    function drawBoard() {
        boardDiv.innerHTML = '';
        boardDiv.style.gridTemplateColumns = `repeat(${size}, 60px)`;
        boardDiv.style.gridTemplateRows = `repeat(${size}, 60px)`;
        const nextNum = getNextNumberToConnect();
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const val = grid[r][c];
                const cell = document.createElement('div');
                cell.className = 'pp-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                // Show endpoint number
                if (val) {
                    cell.textContent = val;
                    cell.classList.add('pp-endpoint');
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
        for (let n in paths) {
            if (n !== String(number) && paths[n].some(([pr, pc]) => pr === r && pc === c)) return true;
        }
        if (paths[number] && paths[number].some(([pr, pc]) => pr === r && pc === c)) return true;
        return false;
    }
    function getColor(n) {
        const colors = ['#2E9DF7', '#FFC907', '#4FCB53', '#F5402C', '#8BD1CB', '#FF902A'];
        return colors[(n-1)%colors.length];
    }
    function checkWin() {
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
            let oldOverlay = document.getElementById('pp-win-overlay-mobile');
            if (oldOverlay) oldOverlay.remove();
            const overlay = document.createElement('div');
            overlay.id = 'pp-win-overlay-mobile';
            overlay.className = 'pp-win-center';
            if (levelIndex === levels.length - 1) {
                overlay.innerHTML = `🎉 Water flows!<br>You solved the pipeline!<br>Back to the main hub...`;
            } else {
                overlay.innerHTML = `🎉 Water flows!<br>You solved the pipeline!<br>Moving to Next Level...`;
            }
            document.body.appendChild(overlay);
            markPuzzlePipelineLevelComplete(levelIndex);
            setTimeout(() => {
                overlay.remove();
                if (levelIndex === levels.length - 1) {
                    showMainMenu();
                } else {
                    startPuzzlePipelineMobile(levelIndex + 1);
                }
            }, 1800);
        } else {
            messageDiv.textContent = '';
        }
    }
    // --- Touch controls for path drawing ---
    let lastCell = null;
    // Prevent scrolling when touching the board
    boardDiv.addEventListener('touchmove', function(e) {
        // Prevent the page from scrolling while playing
        e.preventDefault();
    }, { passive: false });
    boardDiv.ontouchstart = function(e) {
        if (solved) return;
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!target || !target.classList.contains('pp-cell')) return;
        const r = parseInt(target.dataset.row, 10);
        const c = parseInt(target.dataset.col, 10);
        const val = grid[r][c];
        const nextNum = getNextNumberToConnect();
        if (val && val === nextNum) {
            drawing = { number: val, path: [[r, c]] };
            lastCell = [r, c];
            drawBoard();
        }
    };
    boardDiv.ontouchmove = function(e) {
        if (!drawing || solved) return;
        // Prevent the page from scrolling while dragging
        e.preventDefault();
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!target || !target.classList.contains('pp-cell')) return;
        const r = parseInt(target.dataset.row, 10);
        const c = parseInt(target.dataset.col, 10);
        if (lastCell && (lastCell[0] !== r || lastCell[1] !== c)) {
            if (isAdjacent(lastCell, [r, c]) && !isCellBlocked([r, c], drawing.number)) {
                // If endpoint and matches, finish path
                const val = grid[r][c];
                if (val === drawing.number && !drawing.path.some(([pr, pc]) => pr === r && pc === c) && endpoints[drawing.number].some(([er, ec]) => er === r && ec === c)) {
                    drawing.path.push([r, c]);
                    paths[drawing.number] = drawing.path.slice();
                    drawing = null;
                    lastCell = null;
                    drawBoard();
                    checkWin();
                    return;
                }
                // If empty or not already in path, continue
                if (!drawing.path.some(([pr, pc]) => pr === r && pc === c) && !grid[r][c]) {
                    drawing.path.push([r, c]);
                    lastCell = [r, c];
                    drawBoard();
                }
            }
        }
    };
    boardDiv.ontouchend = function(e) {
        if (drawing) {
            drawing = null;
            lastCell = null;
            drawBoard();
        }
    };
    // Reset
    document.getElementById('pp-reset-mobile').onclick = () => {
        paths = {};
        drawing = null;
        solved = false;
        messageDiv.textContent = '';
        drawBoard();
    };
    // Next Level
    document.getElementById('pp-next-level-mobile').onclick = () => {
        let next = (levelIndex + 1) % levels.length;
        startPuzzlePipelineMobile(next);
    };
    // Initial draw
    drawBoard();
    messageDiv.textContent = '';
}

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
        showCharityInfo();
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
