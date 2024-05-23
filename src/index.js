import { StandardCards, DeckOfCards } from "@andrewscripts/deck-of-cards.js";
import dragula from "dragula";

/**
 * @typedef {Object} MO52Card
 * @prop {number} numberRank
 * @prop {string} nameRank
 * @prop {string} initial // The card's "symbol"
 * @prop {"Clubs" | "Hearts" | "Spades" | "Diamonds" | "Joker"} suit
 * @prop {string} name
 * @prop {number} value
 * @prop {boolean} facingDown
 */

const suitIcons = {
  C: "♣️",
  H: "❤️",
  S: "♠️",
  D: "♦️",
};

// Initialize Deck
const BaseCards = /** @type {MO52Card[]} */ (StandardCards.standard52DeckOfCards).map((card) => {
  if (card.nameRank !== "Ace") {
    card.value = card.numberRank + 2;
  }
  if (card.initial === "10") {
    card.initial = "X";
  }
  card.suit = suitIcons[card.suit[0]];
  card.facingDown = true;
  return card;
});
BaseCards.push({ ...StandardCards.FancyJoker, value: 0, facingDown: true });
const moDeck = new DeckOfCards(BaseCards);

// Initialize Piles
const OuterPileIDs = ["b1", "c1", "d1", "a2", "e2", "a3", "e3", "a4", "e4", "b5", "c5", "d5"];
const InnerPileIDs = ["b2", "c2", "d2", "b3", "c3", "d3", "b4", "c4", "d4"];

const PILES = {
  a2: { cards: [] },
  a3: { cards: [] },
  a4: { cards: [] },
  b1: { cards: [] },
  b2: { cards: [] },
  b3: { cards: [] },
  b4: { cards: [] },
  b5: { cards: [] },
  c1: { cards: [] },
  c2: { cards: [] },
  c3: { cards: [] },
  c4: { cards: [] },
  c5: { cards: [] },
  d1: { cards: [] },
  d2: { cards: [] },
  d3: { cards: [] },
  d4: { cards: [] },
  d5: { cards: [] },
  e2: { cards: [] },
  e3: { cards: [] },
  e4: { cards: [] },
  e5: { cards: moDeck.drawPile },
};

// Get templates for later
const faceUpTemplate = /** @type {HTMLTemplateElement} */ (document.getElementById("faceUpCardTemplate"));
const faceDownTemplate = /** @type {HTMLTemplateElement} */ (document.getElementById("faceDownCardTemplate"));
const emptyTemplate = /** @type {HTMLTemplateElement} */ (document.getElementById("emptyCardTemplate"));

/** @param {MO52Card} card */
function isRoyal(card) {
  return card.value > 10;
}

let CommandManager;

function newGame() {
  // setup a new command manager for this game
  CommandManager = createCommandManager();

  // Collect all cards from all piles

  // Shuffle cards
  moDeck.shuffle(3);

  // Deal cards out to central piles
  let allPilesDealt = false;
  let royals = [];
  const innerPilesList = Array.from(InnerPileIDs);

  while (!allPilesDealt) {
    const card = moDeck.drawFromDrawPile(1)[0];

    // If Royal, set aside
    if (isRoyal(card)) {
      royals.push(card);
    } else {
      // Else, deal to an empty center pile that isn't c3
      const currentPile = innerPilesList.shift();
      // Skip the center pile
      if (currentPile !== "c3") {
        card.facingDown = false;
        PILES[currentPile].cards.push(card);
      }
    }
    if (innerPilesList.length === 0) {
      allPilesDealt = true;
    }
  }

  // Add Royals (if any) back to top of draw pile
  moDeck.addToTopOfDrawPile(royals);

  // Lastly, render the current state of the piles
  renderCards();
}

document.getElementById("newGameButton")?.addEventListener("click", () => newGame());
document.getElementById("undoButton")?.addEventListener("click", () => CommandManager.undo());
document.getElementById("redoButton")?.addEventListener("click", () => CommandManager.redo());

/**
 * @param {MO52Card} chosenCard
 * @param {number} index
 */
function makeFaceUpCard(chosenCard, index) {
  // Clone Template
  const faceUpCard = /** @type {HTMLElement} */ (faceUpTemplate?.content.cloneNode(true));

  // Get main element and add color and index to it
  const cardEl = faceUpCard.querySelector(".mo-card");
  if (cardEl) {
    cardEl.setAttribute("style", `--index: ${index}`);
  }

  // Set card's rank, suit, and name
  faceUpCard.querySelectorAll(".mo-card__rank").forEach((rankDiv) => {
    rankDiv.innerHTML = chosenCard.initial;
  });
  faceUpCard.querySelectorAll(".mo-card__suit").forEach((rankDiv) => {
    rankDiv.innerHTML = chosenCard.suit;
  });
  const nameEl = faceUpCard.querySelector(".mo-card__name");
  if (nameEl) nameEl.innerHTML = `${chosenCard.name}`;

  return /** @type {Node} */ (faceUpCard);
}

/** @param {number} index */
function makeFaceDownCard(index) {
  const faceDownCard = /** @type {HTMLElement} */ (faceDownTemplate?.content.cloneNode(true));
  const fdCardEl = faceDownCard.querySelector(".mo-card");
  if (fdCardEl) fdCardEl.setAttribute("style", `--index: ${index}`);
  return faceDownCard;
}

/** @param {number} index */
function makeEmptyCard(index) {
  const emptyCard = /** @type {HTMLElement} */ (emptyTemplate?.content.cloneNode(true));
  const emptyCardEl = emptyCard.querySelector(".mo-card");
  if (emptyCardEl) emptyCardEl.setAttribute("style", `--index: ${index}`);
  return emptyCard;
}

function renderCards() {
  Object.entries(PILES).forEach(([pileName, { cards }]) => {
    // For each pile, render out cards
    // Make all of the cards
    const cardEls = /** @type {MO52Card[]} */ (cards).map((card, index) => {
      if (card.facingDown) {
        return makeFaceDownCard(index);
      } else {
        return makeFaceUpCard(card, index);
      }
    });

    const nextIndex = cardEls.length;
    const emptyCard = makeEmptyCard(nextIndex);
    cardEls.push(emptyCard);

    // Next, append cards to pile
    const pileEl = document.querySelector(`#${pileName}.pile`);
    pileEl?.replaceChildren(...cardEls);
  });

  // Render the draw pile top card, too
  const topCard = moDeck.drawPile[0];
  topCard.facingDown = false;
  let cardEl = makeFaceUpCard(topCard, 0);
  const pileEl = document.querySelector(`#e5.pile`);
  pileEl?.replaceChildren(cardEl);
}

/**
 * @param {string} fromPile
 * @param {string} toPile
 */
function shiftCards(fromPile, toPile) {
  // get top card from origin pile
  const topCard = PILES[fromPile].cards.shift();

  // if card found, add it to destination pile and reveal next top card
  if (topCard) {
    // get next top card and reveal it (if there is one)
    if (PILES[fromPile].cards.length) PILES[fromPile].cards[0].facingDown = false;

    PILES[toPile].cards.unshift(topCard);
  }

  // re-render cards
  renderCards();
}

// Function to create commandManagers, should be one per game to manage history (undo/redo)
const createCommandManager = () => {
  /** @type {{fromPile: string, toPile: string}[]} */
  // @ts-ignore
  let history = [null];
  let position = 0;

  return {
    /**
     * @param {string} fromPile
     * @param {string} toPile
     */
    doShift(fromPile, toPile) {
      // If current position is anywhere other than the end of the history array, keep only the past history
      if (position < history.length - 1) {
        history = history.slice(0, position + 1);
      }

      history.push({ fromPile, toPile });
      position += 1;
      shiftCards(fromPile, toPile);
    },

    undo() {
      if (position > 0) {
        const { fromPile, toPile } = history[position];
        position -= 1;
        shiftCards(toPile, fromPile);
      }
    },

    redo() {
      if (position < history.length - 1) {
        position += 1;
        const { fromPile, toPile } = history[position];
        shiftCards(fromPile, toPile);
      }
    },
  };
};

/** Drag and drop stuff */
const pileEls = Array.from(document.getElementsByClassName("pile"));
console.log("pileEls:", pileEls);
const drake = dragula(pileEls);
drake.on("drop", (_, target, source) => {
  const fromPile = source.id;
  const toPile = target.id;
  CommandManager.doShift(fromPile, toPile);
});

document.addEventListener("DOMContentLoaded", function () {
  newGame();
});
