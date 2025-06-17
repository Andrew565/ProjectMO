import { collectAndShuffleCards, dealOutInitialCards } from "./Initializers";
import { createCommandManager } from "./CommandManager";
import { renderCards } from "./Renderers";
import { isValidPile, getValidPiles } from "./Validators";
import { getTopCard } from "./Helpers";
import { createGameManager } from "./GameManager";

// Initialize CommandManager var for later use
let CommandManager;

// Initialize GameManager var for later use
/** @type {import("./GameManager").GameManager} */
let GameManager;

// Initializes a new game
function newGame() {
  // Setup a new command manager for this game
  CommandManager = createCommandManager();

  // Setup a new game manager for this game
  GameManager = createGameManager();

  // Collect all cards from all piles
  collectAndShuffleCards();

  // Deal cards out to central piles
  dealOutInitialCards();

  // Lastly, render the current state of the piles
  renderCards();

  // Highlight valid moves for the card in the draw pile
  highlightValidPilesForDrawPile();
}

// Setup 'onload' event listener
document.addEventListener("DOMContentLoaded", function () {
  newGame();

  // Setup click listeners for card placement
  const pileElements = Array.from(document.getElementsByClassName("pile"));
  pileElements.forEach(pileEl => {
    if (pileEl.id !== "e5") { // Only add listeners to non-draw piles
      pileEl.addEventListener("click", function() {
        const targetPileId = pileEl.id;
        if (pileEl.classList.contains("pile--valid")) {
          CommandManager.doShift("e5", targetPileId);
          GameManager.tick(targetPileId);
          renderCards();
          highlightValidPilesForDrawPile();
        }
      });
    }
  });
});

// Setup button event listeners
document.getElementById("newGameButton")?.addEventListener("click", () => newGame());
document.getElementById("undoButton")?.addEventListener("click", () => {
  CommandManager.undo(); // This already calls renderCards()
  highlightValidPilesForDrawPile();
});

document.getElementById("redoButton")?.addEventListener("click", () => {
  CommandManager.redo(); // This already calls renderCards()
  highlightValidPilesForDrawPile();
});

// Highlights 'legal' drop targets
/** @param {string[]} validPiles */
function highlightValidPiles(validPiles) {
  validPiles.forEach((pileId) => {
    const pileEl = document.getElementById(pileId);
    pileEl?.classList.add("pile--valid");
  });
}

// Clears highlighted valid piles
function removeHighlights() {
  const currentHighlights = Array.from(document.getElementsByClassName("pile--valid"));
  currentHighlights.forEach((el) => el.classList.remove("pile--valid"));
}

function highlightValidPilesForDrawPile() {
  removeHighlights(); // Clear any existing highlights first
  const card = getTopCard("e5");
  if (card) {
    const validPiles = getValidPiles(card);
    if (validPiles.length) {
      highlightValidPiles(validPiles);
    }
  }
}
