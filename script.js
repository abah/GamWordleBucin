// Game Constants
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const ANIMATION_DURATION = 500; // ms

// Game State
let currentWord = '';
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;
let gameWon = false;

// DOM Elements
const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const messageContainer = document.getElementById('message-container');
const messageText = document.getElementById('message-text');
const resultModal = document.getElementById('result-modal');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const correctWordElement = document.getElementById('correct-word');
const playAgainButton = document.getElementById('play-again');

// Bucin Words Database (5 letters)
const bucinWords = [
    'RINDU', 'BAPER', 'SAYANG', 'CINTA', 'KANGEN',
    'BUCIN', 'JODOH', 'PACAR', 'KASMARAN', 'MESRA',
    'CINTA', 'KASIH', 'KAMU', 'CEPET', 'NUNGGU',
    'PAPTT', 'GHOST', 'TOXIC', 'VIBES', 'SLAY',
    'MOOD', 'BAPER', 'GALAU', 'SEDIH', 'PUTUS',
    'SESAL', 'MARAH', 'KESAL', 'CUEK', 'GOMBAL'
];

// Bucin Responses
const responses = {
    correct: [
        "Duh, kalau peka ke aku gini dari dulu, pasti udah jadian!",
        "Wah, kamu emang bucin sejati. Pas banget sama kamu!",
        "Cie, yang jago nebak. Kayak jago nebak perasaan dia ya?",
        "Mantap! Skill bucin kamu level expert nih!",
        "Wah, kamu pinter banget! Sayang dia nggak pernah notice ya?"
    ],
    wrong: [
        "Coba yang lain, kayaknya masih kurang usaha nih!",
        "Kamu yakin? Mirip kayak pas kamu ngejar dia, tapi tetap salah.",
        "Hmm, kurang tepat. Kayak hubungan kalian ya?",
        "Salah! Tapi jangan nyerah, dia juga belum tentu yang terbaik kok.",
        "Masih belum tepat. Sabar ya, cinta butuh perjuangan."
    ],
    invalidWord: [
        "Kata apa itu? Kayak chat kamu yang nggak pernah dibales.",
        "Kata tidak valid! Kayak status hubungan kalian ya?",
        "Hmm, kata ini nggak masuk akal. Kayak harapan kamu sama dia.",
        "Kata ini nggak ada di kamus bucin kita. Coba lagi!",
        "Kata ini nggak valid. Jangan ngasal kayak kamu ngasih kode ke dia."
    ],
    gameWon: [
        "SELAMAT! Kamu berhasil! Sayang ya, cuma menang di game, bukan di hatinya.",
        "HEBAT! Kamu menang! Kalau aja kamu sebagus ini pas PDKT sama dia.",
        "KEREN! Kamu berhasil! Skill nebak kata kamu bagus, skill nebak perasaan dia... hmm.",
        "MANTAP! Kamu menang! Coba deh skill ini dipake buat move on juga.",
        "PERFECT! Kamu berhasil! Andai hubungan kalian semulus permainan ini ya."
    ],
    gameLost: [
        "Tenang... yang penting bukan hubungan kalian yang gagal.",
        "Kamu gagal di sini, tapi jangan sampai gagal move on juga.",
        "Yah, kalah. Tapi nggak sesakit diputusin kan?",
        "Game over! Tapi hidup masih panjang, masih banyak yang bisa di-bucin-in.",
        "Sayang sekali! Tapi setidaknya kamu nggak di-ghosting sama game ini."
    ]
};

// Initialize Game
function initGame() {
    createBoard();
    createKeyboard();
    currentWord = getRandomWord();
    isGameOver = false;
    gameWon = false;
    currentRow = 0;
    currentTile = 0;
    
    // For debugging
    console.log("Secret word:", currentWord);
}

// Get Random Word
function getRandomWord() {
    return bucinWords[Math.floor(Math.random() * bucinWords.length)];
}

// Create Game Board
function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.row = i;
            tile.dataset.col = j;
            row.appendChild(tile);
        }
        
        board.appendChild(row);
    }
}

// Create Keyboard
function createKeyboard() {
    keyboard.innerHTML = '';
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];
    
    rows.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.classList.add('keyboard-row');
        
        row.forEach(key => {
            const keyButton = document.createElement('div');
            keyButton.classList.add('key');
            keyButton.textContent = key;
            
            if (key === 'ENTER' || key === '⌫') {
                keyButton.classList.add('wide');
            }
            
            keyButton.addEventListener('click', () => handleKeyPress(key));
            keyboardRow.appendChild(keyButton);
        });
        
        keyboard.appendChild(keyboardRow);
    });
}

// Handle Key Press
function handleKeyPress(key) {
    if (isGameOver) return;
    
    if (key === '⌫') {
        deleteLetter();
    } else if (key === 'ENTER') {
        submitGuess();
    } else if (/^[A-Z]$/.test(key) && currentTile < WORD_LENGTH) {
        addLetter(key);
    }
}

// Add Letter to Current Tile
function addLetter(letter) {
    if (currentTile < WORD_LENGTH) {
        const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile}"]`);
        tile.textContent = letter;
        tile.classList.add('filled');
        currentTile++;
    }
}

// Delete Letter from Current Tile
function deleteLetter() {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile}"]`);
        tile.textContent = '';
        tile.classList.remove('filled');
    }
}

// Submit Guess
function submitGuess() {
    if (currentTile !== WORD_LENGTH) {
        showMessage(getRandomResponse('invalidWord'));
        shakeRow();
        return;
    }
    
    const guess = getCurrentWord();
    
    // Check if word is valid (in this simple version, we'll just check if it's 5 letters)
    if (guess.length !== WORD_LENGTH) {
        showMessage(getRandomResponse('invalidWord'));
        shakeRow();
        return;
    }
    
    // Check guess against current word
    const result = checkGuess(guess);
    updateTiles(result);
    updateKeyboard(guess, result);
    
    // Check if game is won or lost
    if (guess === currentWord) {
        gameWon = true;
        isGameOver = true;
        setTimeout(() => {
            showGameOverModal(true);
        }, WORD_LENGTH * ANIMATION_DURATION + 500);
    } else if (currentRow === MAX_ATTEMPTS - 1) {
        isGameOver = true;
        setTimeout(() => {
            showGameOverModal(false);
        }, WORD_LENGTH * ANIMATION_DURATION + 500);
    } else {
        // Show response message
        if (result.some(r => r === 'correct' || r === 'present')) {
            showMessage(getRandomResponse('correct'));
        } else {
            showMessage(getRandomResponse('wrong'));
        }
        
        // Move to next row
        currentRow++;
        currentTile = 0;
    }
}

// Get Current Word from Tiles
function getCurrentWord() {
    let word = '';
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${i}"]`);
        word += tile.textContent;
    }
    return word;
}

// Check Guess Against Current Word
function checkGuess(guess) {
    const result = Array(WORD_LENGTH).fill('absent');
    const wordArray = currentWord.split('');
    const guessArray = guess.split('');
    
    // First pass: check for correct positions
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArray[i] === wordArray[i]) {
            result[i] = 'correct';
            wordArray[i] = null;
        }
    }
    
    // Second pass: check for present but wrong position
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (result[i] !== 'correct') {
            const index = wordArray.indexOf(guessArray[i]);
            if (index !== -1) {
                result[i] = 'present';
                wordArray[index] = null;
            }
        }
    }
    
    return result;
}

// Update Tiles with Result
function updateTiles(result) {
    for (let i = 0; i < WORD_LENGTH; i++) {
        setTimeout(() => {
            const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${i}"]`);
            tile.classList.add('flip');
            
            setTimeout(() => {
                tile.classList.add(result[i]);
            }, ANIMATION_DURATION / 2);
            
            setTimeout(() => {
                tile.classList.remove('flip');
            }, ANIMATION_DURATION);
        }, i * ANIMATION_DURATION / 2);
    }
}

// Update Keyboard with Result
function updateKeyboard(guess, result) {
    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = guess[i];
        const keyElement = Array.from(document.querySelectorAll('.key')).find(key => 
            key.textContent.trim() === letter && !key.classList.contains('wide')
        );
        
        if (keyElement) {
            // Only update if the new state is "better" than the current state
            if (result[i] === 'correct') {
                keyElement.classList.remove('present', 'absent');
                keyElement.classList.add('correct');
            } else if (result[i] === 'present' && !keyElement.classList.contains('correct')) {
                keyElement.classList.remove('absent');
                keyElement.classList.add('present');
            } else if (!keyElement.classList.contains('correct') && !keyElement.classList.contains('present')) {
                keyElement.classList.add('absent');
            }
        }
    }
}

// Shake Row for Invalid Word
function shakeRow() {
    const tiles = document.querySelectorAll(`.tile[data-row="${currentRow}"]`);
    tiles.forEach(tile => {
        tile.classList.add('shake');
        setTimeout(() => {
            tile.classList.remove('shake');
        }, 500);
    });
}

// Show Message
function showMessage(message) {
    messageText.textContent = message;
    messageContainer.classList.remove('hidden');
    
    setTimeout(() => {
        messageContainer.classList.add('hidden');
    }, 3000);
}

// Get Random Response
function getRandomResponse(type) {
    const responseArray = responses[type];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

// Show Game Over Modal
function showGameOverModal(won) {
    resultTitle.textContent = won ? 'MENANG! 🎉' : 'KALAH! 💔';
    resultMessage.textContent = won ? getRandomResponse('gameWon') : getRandomResponse('gameLost');
    correctWordElement.textContent = `Kata yang benar: ${currentWord}`;
    resultModal.classList.remove('hidden');
    
    // Check for Easter egg
    if (won) {
        checkEasterEgg();
    } else {
        checkFailedGamesCount();
    }
}

// Reset Game
function resetGame() {
    resultModal.classList.add('hidden');
    messageContainer.classList.add('hidden');
    initGame();
}

// Event Listeners
playAgainButton.addEventListener('click', resetGame);

// Keyboard Event Listener
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    
    const key = e.key.toUpperCase();
    
    if (key === 'BACKSPACE' || key === 'DELETE') {
        deleteLetter();
    } else if (key === 'ENTER') {
        submitGuess();
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key);
    }
});

// Initialize Game on Load
document.addEventListener('DOMContentLoaded', initGame);

// Easter Egg: If win in first try
function checkEasterEgg() {
    if (gameWon && currentRow === 0) {
        setTimeout(() => {
            showMessage("Pasti stalk story dia dulu, ya?! 👀");
        }, WORD_LENGTH * ANIMATION_DURATION + 1000);
    }
}

// Track failed attempts for special message
let failedGamesCount = 0;

function checkFailedGamesCount() {
    if (!gameWon) {
        failedGamesCount++;
        
        if (failedGamesCount >= 3) {
            setTimeout(() => {
                const wantHelp = confirm("Mau dibantu balikan sama dia? Pilih: [OK] / [CANCEL tapi sebenernya mau]");
                if (wantHelp) {
                    alert("Maaf, kami hanya bisa bantu kamu move on. Yuk main lagi!");
                } else {
                    alert("Pilihan yang bijak. Dia memang tidak pantas untukmu. Yuk main lagi!");
                }
                failedGamesCount = 0;
            }, 2000);
        }
    }
} 