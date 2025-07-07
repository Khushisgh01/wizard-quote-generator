const quoteText = document.getElementById("quote-text");
const quoteChar = document.getElementById("quote-character");
const newQuoteBtn = document.getElementById("new-quote");
const addFavBtn = document.getElementById("add-favorite");
const clearFavBtn = document.getElementById("clear-favorites");
const favList = document.getElementById("favorites-list");
const toggleThemeBtn = document.getElementById("toggle-theme");

// === State ===
let currentQuote = "";
let currentCharacter = "";

// === Fetch Quotes ===
async function getQuote() {
  try {
    const res = await fetch("https://hp-api.onrender.com/api/spells");
    const data = await res.json();
    const spell = data[Math.floor(Math.random() * data.length)];
    currentQuote = spell.name;
    currentCharacter = spell.description || "No description available.";
    quoteText.textContent = `"${currentQuote}"`;
    quoteChar.textContent = `✨ ${currentCharacter}`;
    animateQuote();
  } catch (err) {
    quoteText.textContent = "⚠️ Failed to fetch spell.";
    quoteChar.textContent = "";
  }
}

function animateQuote() {
  const box = document.querySelector(".quote-box");
  box.style.opacity = 0;
  setTimeout(() => (box.style.opacity = 1), 300);
}

// === Favorites ===
function addToFavorites() {
  if (!currentQuote) return;
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  const newFav = { spell: currentQuote, description: currentCharacter };
  if (!favs.some(fav => fav.spell === newFav.spell)) {
    favs.push(newFav);
    localStorage.setItem("favorites", JSON.stringify(favs));
    displayFavorites();
  }
}

function displayFavorites() {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  favList.innerHTML = "";
  favs.forEach(fav => {
    const li = document.createElement("li");
    li.textContent = `"${fav.spell}" — ${fav.description}`;
    favList.appendChild(li);
  });
}

function clearFavorites() {
  localStorage.removeItem("favorites");
  displayFavorites();
}

// === Theme Toggle ===
toggleThemeBtn.addEventListener("click", () => {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  toggleThemeBtn.textContent = newTheme === "dark" ? "🌙 Toggle Theme" : "☀️ Toggle Theme";
});

// === Magical Cursor Trail ===
document.addEventListener("mousemove", e => {
  const trail = document.querySelector(".cursor-trail");
  const dot = document.createElement("div");
  dot.classList.add("cursor-dot");
  dot.style.left = `${e.clientX}px`;
  dot.style.top = `${e.clientY}px`;
  trail.appendChild(dot);

  // Remove dot after animation ends
  setTimeout(() => dot.remove(), 800);
});

// === Event Listeners ===
newQuoteBtn.addEventListener("click", getQuote);
addFavBtn.addEventListener("click", addToFavorites);
clearFavBtn.addEventListener("click", clearFavorites);

// === Initial Run ===
displayFavorites();

