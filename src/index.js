import dragula from "dragula";
import { collectAndShuffleCards, dealOutInitialCards, getTopCard, PILES } from "./Initializers";
import { createCommandManager } from "./CommandManager";
import { renderCards } from "./Renderers";
import { isValidPile, getValidPiles } from "./Validators";

// Initialize CommandManager var for later use
let CommandManager;

// Initializes a new game
function newGame() {
  // setup a new command manager for this game
  CommandManager = createCommandManager();

  // Collect all cards from all piles
  collectAndShuffleCards();

  // Deal cards out to central piles
  dealOutInitialCards();

  // Lastly, render the current state of the piles
  renderCards();
}

// Setup 'onload' event listener
document.addEventListener("DOMContentLoaded", function () {
  newGame();
});

// Setup button event listeners
document.getElementById("newGameButton")?.addEventListener("click", () => newGame());
document.getElementById("undoButton")?.addEventListener("click", () => CommandManager.undo());
document.getElementById("redoButton")?.addEventListener("click", () => CommandManager.redo());

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

/** NOTE: Drag and drop stuff */
const pileEls = Array.from(document.getElementsByClassName("pile"));
const drake = dragula(pileEls, {
  moves: function (_, source) {
    return source ? source.classList.contains("pile--drawpile") : false;
  },
  accepts: function (_, toPileEl, fromPileEl) {
    const fromPile = fromPileEl?.id;
    const toPile = toPileEl?.id;
    return fromPile && toPile ? isValidPile(fromPile, toPile) : false;
  },
});

drake.on("drag", function (_, source) {
  // Grab a copy of the top card from the source pile
  const card = getTopCard(source.id);
  const validPiles = getValidPiles(card);

  if (validPiles.length) {
    highlightValidPiles(validPiles);
  }
});

drake.on("drop", function (_, target, source) {
  removeHighlights();
  const fromPile = source.id;
  const toPile = target.id;

  CommandManager.doShift(fromPile, toPile);
});
