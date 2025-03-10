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
let debugMode = true; // Aktifkan mode debug untuk membantu troubleshooting

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
const mobileInput = document.getElementById('mobile-input');
const gameContainer = document.querySelector('.game-container');
const focusIndicator = document.getElementById('focus-indicator');

// Bucin Words Database (5 letters)
const bucinWords = [
    'RINDU', // 5 huruf
    'BAPER', // 5 huruf
    'CINTA', // 5 huruf
    'BUCIN', // 5 huruf
    'JODOH', // 5 huruf
    'PACAR', // 5 huruf
    'MESRA', // 5 huruf
    'KASIH', // 5 huruf
    'KALEM', // 5 huruf
    'CAPER', // 5 huruf
    'SABAR', // 5 huruf
    'GALAU', // 5 huruf
    'SEDIH', // 5 huruf
    'PUTUS', // 5 huruf
    'SESAL', // 5 huruf
    'MARAH', // 5 huruf
    'KESAL'  // 5 huruf
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

// Fungsi untuk memvalidasi bahwa semua kata memiliki 5 huruf
function validateWordLength() {
    const invalidWords = [];
    for (let i = 0; i < bucinWords.length; i++) {
        if (bucinWords[i].length !== 5) {
            invalidWords.push(`"${bucinWords[i]}" (${bucinWords[i].length} huruf)`);
        }
    }
    
    if (invalidWords.length > 0) {
        console.error(`Error: Kata-kata berikut tidak memiliki 5 huruf: ${invalidWords.join(', ')}`);
    } else {
        console.log("Semua kata memiliki 5 huruf ✓");
    }
}

// Panggil fungsi validasi saat inisialisasi
validateWordLength();

// Initialize Game
function initGame() {
    createBoard();
    createKeyboard();
    setupMobileKeyboard();
    
    // Pilih kata rahasia sekali saja saat game dimulai
    currentWord = getRandomWord();
    isGameOver = false;
    gameWon = false;
    currentRow = 0;
    currentTile = 0;
    
    // Untuk debugging
    if (debugMode) {
        console.log("Secret word:", currentWord);
    }
}

// Get Random Word
function getRandomWord() {
    // Pastikan semua kata memiliki 5 huruf
    const validWords = bucinWords.filter(word => word.length === 5);
    
    if (validWords.length === 0) {
        console.error("Tidak ada kata 5 huruf dalam database!");
        return "BUCIN"; // Default fallback
    }
    
    // Hapus duplikat dalam validWords
    const uniqueValidWords = [...new Set(validWords)];
    
    // Log untuk debugging
    if (debugMode) {
        console.log(`Choosing from ${uniqueValidWords.length} valid words`);
        
        // Periksa apakah ada duplikat yang dihapus
        if (uniqueValidWords.length < validWords.length) {
            console.warn(`${validWords.length - uniqueValidWords.length} kata duplikat dihapus`);
        }
    }
    
    const randomWord = uniqueValidWords[Math.floor(Math.random() * uniqueValidWords.length)];
    
    // Pastikan kata yang dipilih memiliki tepat 5 huruf
    if (randomWord.length !== 5) {
        console.error(`Error: Selected word "${randomWord}" does not have 5 letters!`);
        return "BUCIN"; // Default fallback
    }
    
    return randomWord;
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
            
            keyButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling to game container
                handleKeyPress(key);
            });
            keyboardRow.appendChild(keyButton);
        });
        
        keyboard.appendChild(keyboardRow);
    });
    
    // Add info text for mobile users
    if (isMobileDevice()) {
        const infoText = document.createElement('p');
        infoText.classList.add('keyboard-info');
        infoText.textContent = 'Ketuk di mana saja untuk menggunakan keyboard HP';
        keyboard.appendChild(infoText);
    }
}

// Handle Key Press
function handleKeyPress(key) {
    if (isGameOver) return;
    
    // Gunakan debounce sederhana untuk mencegah input ganda
    if (handleKeyPress.lastKeyTime && Date.now() - handleKeyPress.lastKeyTime < 100) {
        return; // Abaikan input jika terlalu cepat setelah input sebelumnya
    }
    handleKeyPress.lastKeyTime = Date.now();
    
    if (key === '⌫') {
        deleteLetter();
    } else if (key === 'ENTER') {
        submitGuess();
    } else if (/^[A-Z]$/.test(key) && currentTile < WORD_LENGTH) {
        addLetter(key);
    }
    
    // Refocus mobile input after each key press
    if (isMobileDevice()) {
        setTimeout(focusMobileInput, 10);
    }
}

// Add Letter to Current Tile
function addLetter(letter) {
    if (currentTile < WORD_LENGTH) {
        const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile}"]`);
        tile.textContent = letter;
        tile.classList.add('filled');
        currentTile++;
        
        // Give visual feedback when reaching max letters
        if (currentTile === WORD_LENGTH) {
            const rowTiles = document.querySelectorAll(`.tile[data-row="${currentRow}"]`);
            rowTiles.forEach(tile => {
                tile.classList.add('ready');
                setTimeout(() => {
                    tile.classList.remove('ready');
                }, 100);
            });
        }
    } else {
        // Visual feedback that max letters reached
        const rowTiles = document.querySelectorAll(`.tile[data-row="${currentRow}"]`);
        rowTiles.forEach(tile => {
            tile.classList.add('shake');
            setTimeout(() => {
                tile.classList.remove('shake');
            }, 300);
        });
    }
    
    // Refocus mobile input after adding letter
    if (isMobileDevice()) {
        setTimeout(focusMobileInput, 10);
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
    
    // Refocus mobile input after deleting letter
    if (isMobileDevice()) {
        setTimeout(focusMobileInput, 10);
    }
}

// Submit Guess
function submitGuess() {
    // Pastikan semua 5 kotak terisi
    if (currentTile !== WORD_LENGTH) {
        showMessage(`Kata harus ${WORD_LENGTH} huruf! Masih kurang ${WORD_LENGTH - currentTile} huruf lagi.`);
        shakeRow();
        return;
    }
    
    const guess = getCurrentWord();
    
    // Log untuk debugging
    if (debugMode) {
        console.log(`Row ${currentRow}: Guessing "${guess}" against secret "${currentWord}"`);
    }
    
    // Pastikan kata memiliki tepat 5 huruf
    if (guess.length !== WORD_LENGTH) {
        showMessage(`Kata harus tepat ${WORD_LENGTH} huruf!`);
        shakeRow();
        return;
    }
    
    // Opsional: Validasi kata ada dalam database
    // Uncomment kode di bawah ini jika ingin membatasi hanya kata dalam database
    /*
    if (!bucinWords.includes(guess)) {
        showMessage(`"${guess}" bukan kata bucin yang valid! ${getRandomResponse('invalidWord')}`);
        shakeRow();
        return;
    }
    */
    
    // Check guess against current word
    const result = checkGuess(guess);
    updateTiles(result);
    updateKeyboard(guess, result);
    
    // Check if game is won or lost
    if (result.every(status => status === 'correct')) {
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
    // Pastikan currentWord tidak kosong atau undefined
    if (!currentWord || currentWord.length !== WORD_LENGTH) {
        console.error("Error: Invalid secret word!", currentWord);
        // Pilih kata baru jika kata saat ini tidak valid
        currentWord = getRandomWord();
        console.log("New secret word:", currentWord);
    }
    
    const result = Array(WORD_LENGTH).fill('absent');
    
    // Log untuk debugging
    if (debugMode) {
        console.log(`Checking guess "${guess}" against secret "${currentWord}"`);
    }
    
    // Create copies of the arrays to work with
    const secretLetters = currentWord.split('');
    const guessLetters = guess.split('');
    
    // First pass: Mark correct positions (green)
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] === secretLetters[i]) {
            result[i] = 'correct';
            secretLetters[i] = null; // Mark as used in secret word
            guessLetters[i] = null;  // Mark as processed in guess
        }
    }
    
    // Second pass: Mark present but wrong position (yellow)
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] !== null) { // Skip already processed letters
            const letterIndex = secretLetters.indexOf(guessLetters[i]);
            if (letterIndex !== -1) {
                result[i] = 'present';
                secretLetters[letterIndex] = null; // Mark as used
            }
            // If letterIndex is -1, the result remains 'absent' (gray)
        }
    }
    
    // Log hasil untuk debugging
    if (debugMode) {
        console.log(`Result: ${result.join(', ')}`);
    }
    
    return result;
}

// Update Tiles with Result
function updateTiles(result) {
    // Log untuk debugging
    if (debugMode) {
        console.log(`Updating tiles for row ${currentRow} with result: ${result.join(', ')}`);
    }
    
    for (let i = 0; i < WORD_LENGTH; i++) {
        setTimeout(() => {
            const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${i}"]`);
            if (!tile) {
                console.error(`Tile not found: row=${currentRow}, col=${i}`);
                return;
            }
            
            tile.classList.add('flip');
            
            setTimeout(() => {
                // Hapus kelas warna yang mungkin sudah ada
                tile.classList.remove('correct', 'present', 'absent');
                // Tambahkan kelas warna baru
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
    // Log untuk debugging
    if (debugMode) {
        console.log(`Updating keyboard for guess: ${guess}`);
    }
    
    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = guess[i];
        if (!letter) continue; // Skip null letters (already processed in checkGuess)
        
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
        } else if (debugMode) {
            console.error(`Key element not found for letter: ${letter}`);
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
    
    // Jika input berasal dari mobile input field, abaikan
    // karena sudah ditangani oleh handleMobileInput
    if (e.target === mobileInput) return;
    
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
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Focus mobile input on page load for mobile devices
    if (isMobileDevice()) {
        setTimeout(focusMobileInput, 500);
    }
});

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

// Setup Mobile Keyboard
function setupMobileKeyboard() {
    // Focus input field when game container is clicked
    gameContainer.addEventListener('click', focusMobileInput);
    
    // Handle input from mobile keyboard
    mobileInput.addEventListener('input', handleMobileInput);
    
    // Handle backspace and enter on mobile
    mobileInput.addEventListener('keydown', handleMobileKeydown);
    
    // Show focus indicator on mobile
    if (isMobileDevice()) {
        showFocusIndicator();
    }
}

// Check if device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Focus mobile input field
function focusMobileInput() {
    // Kosongkan input field sebelum fokus untuk mencegah input ganda
    mobileInput.value = '';
    
    // Fokus ke input field
    mobileInput.focus();
    gameContainer.classList.add('keyboard-active');
    
    // Scroll to make sure the game board is visible when keyboard appears
    if (isMobileDevice()) {
        setTimeout(() => {
            window.scrollTo({
                top: board.offsetTop - 50,
                behavior: 'smooth'
            });
        }, 300);
    }
    
    // Hide focus indicator after focusing
    setTimeout(() => {
        focusIndicator.classList.remove('visible');
    }, 1000);
}

// Show focus indicator
function showFocusIndicator() {
    focusIndicator.classList.add('visible');
    
    // Hide after 3 seconds
    setTimeout(() => {
        focusIndicator.classList.remove('visible');
    }, 3000);
}

// Handle input from mobile keyboard
function handleMobileInput(e) {
    // Mencegah input ganda dengan membersihkan input field terlebih dahulu
    const input = e.data;
    mobileInput.value = ''; // Kosongkan input field segera
    
    // Hanya proses satu karakter pada satu waktu
    if (input && input.length === 1 && /^[a-zA-Z]$/.test(input)) {
        // Gunakan setTimeout untuk memastikan input diproses setelah field dikosongkan
        setTimeout(() => {
            handleKeyPress(input.toUpperCase());
        }, 10);
    }
}

// Handle keydown events from mobile keyboard
function handleMobileKeydown(e) {
    // Gunakan debounce sederhana untuk mencegah input ganda
    if (handleMobileKeydown.lastKeyTime && Date.now() - handleMobileKeydown.lastKeyTime < 200) {
        e.preventDefault();
        return; // Abaikan input jika terlalu cepat setelah input sebelumnya
    }
    handleMobileKeydown.lastKeyTime = Date.now();
    
    if (e.key === 'Backspace') {
        deleteLetter();
        e.preventDefault();
    } else if (e.key === 'Enter') {
        submitGuess();
        e.preventDefault();
    }
} 