// --- SAVE DATA ---
let currency = parseInt(localStorage.getItem("currency") || "0");
let purchasedThemes = JSON.parse(localStorage.getItem("themes") || "[]");
let hintCount = parseInt(localStorage.getItem("hints") || "0");

// --- GAME VARIABLES ---
let difficulty = 1;
let score = 0;
let correctIndex;
let timerStart = 0;

// --- UI ELEMENTS ---
const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const shopScreen = document.getElementById("shopScreen");
const settingsScreen = document.getElementById("settingsScreen");

function updateUI() {
    document.getElementById("currencyDisplay").innerText = `Points: ${currency}`;
    document.getElementById("currencyDisplayShop").innerText = `Points: ${currency}`;
    document.getElementById("currentTheme").innerText = document.body.classList.contains("dark") ? "Dark" : "Default";
}

updateUI();

// NAVIGATION
function goHome() {
    hideAll();
    homeScreen.classList.remove("hidden");
    updateUI();
}

function openShop() {
    hideAll();
    shopScreen.classList.remove("hidden");
}

function openSettings() {
    hideAll();
    settingsScreen.classList.remove("hidden");
}

function hideAll() {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
}

// GAME START
function startGame() {
    hideAll();
    gameScreen.classList.remove("hidden");
    difficulty = 1;
    score = 0;
    nextRound();
}

// GENERATE GAME GRID
function nextRound() {
    timerStart = performance.now();

    document.getElementById("scoreDisplay").innerText = `Score: ${score}`;
    
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    const baseColor = randomColor();
    let diffColor = adjustColor(baseColor, difficulty * 3);

    correctIndex = Math.floor(Math.random() * 9);

    for (let i = 0; i < 9; i++) {
        const div = document.createElement("div");
        div.classList.add("gridItem");

        // Mobile-friendly square coloring
        div.style.background = i === correctIndex ? diffColor : baseColor;

        div.onclick = () => handleGuess(i);
        grid.appendChild(div);
    }

    // Auto-hint
    if (hintCount > 0) {
        hintCount--;
        localStorage.setItem("hints", hintCount);
        highlightCorrect();
    }
}

function handleGuess(i) {
    const timeTaken = (performance.now() - timerStart) / 1000;

    if (i === correctIndex) {
        score += Math.max(1, Math.floor(10 - timeTaken));
        difficulty++;
        nextRound();
    } else {
        endGame();
    }
}

function endGame() {
    currency += score;
    localStorage.setItem("currency", currency);
    alert(`Game Over! You earned ${score} points.`);
    goHome();
}

// UTILITIES
function randomColor() {
    const r = Math.floor(Math.random()*255);
    const g = Math.floor(Math.random()*255);
    const b = Math.floor(Math.random()*255);
    return `rgb(${r}, ${g}, ${b})`;
}

function adjustColor(rgb, amount) {
    let [r,g,b] = rgb.match(/\d+/g).map(Number);
    r = Math.min(255, r + amount);
    g = Math.min(255, g + amount);
    b = Math.min(255, b + amount);
    return `rgb(${r}, ${g}, ${b})`;
}

function highlightCorrect() {
    const items = document.querySelectorAll(".gridItem");
    let item = items[correctIndex];
    item.style.outline = "4px solid yellow";
    item.style.outlineOffset = "-4px";
}

// SHOP ITEMS
function buyHint() {
    if (currency >= 10) {
        currency -= 10;
        hintCount++;
        save();
        updateUI();
        alert("Hint purchased!");
    } else {
        alert("Not enough points!");
    }
}

function buyTheme(name) {
    if (name === "dark") {
        if (purchasedThemes.includes("dark")) return alert("Already purchased!");
        if (currency < 50) return alert("Not enough points!");
        currency -= 50;
        purchasedThemes.push("dark");
    }
    save();
    updateUI();
}

function applyTheme(name) {
    if (name === "dark" && !purchasedThemes.includes("dark")) {
        alert("You must buy this theme first!");
        return;
    }
    document.body.className = name === "dark" ? "dark" : "";
    save();
}

function save() {
    localStorage.setItem("currency", currency);
    localStorage.setItem("themes", JSON.stringify(purchasedThemes));
    localStorage.setItem("hints", hintCount);
}
