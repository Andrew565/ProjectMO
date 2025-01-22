import { StandardCards, DeckOfCards } from "@andrewscripts/deck-of-cards.js";
import dragula from "dragula";

/**
 * @typedef {Object} MO52Card
 * @prop {number} numberRank
 * @prop {string} nameRank
 * @prop {string} initial // The card's "symbol"
 * @prop {string} suit
 * @prop {string} name
 * @prop {number} value
 * @prop {boolean} facingDown
 */
/**
 * @typedef {{[x: string]: {cards: MO52Card[]}}} Piles
 */

const suitIcons = {
  C: "♣️",
  H: "❤️",
  S: "♠️",
  D: "♦️",
  J: "🤪",
};

// Initialize Cards
const BaseCards = /** @type {MO52Card[]} */ (StandardCards.standard52DeckOfCards).map((card) => {
  // Adjust value for zero-based numberRank
  if (card.nameRank !== "Ace") {
    card.value = card.numberRank + 2;
  }

  // Set Aces to value of 1
  if (card.nameRank === "Ace") {
    card.value = 1;
  }

  // Rename 10 to X so it centers better
  if (card.initial === "10") {
    card.initial = "X";
  }

  // Setup suit icons
  card.suit = suitIcons[card.suit[0]];
  // Turn all cards face-down to start
  card.facingDown = true;

  return card;
});
// Add a Joker with value of 0
BaseCards.push({ ...StandardCards.FancyJoker, initial: "0", value: 0, facingDown: true, suit: suitIcons["J"] });
// Initialize Deck
const moDeck = new DeckOfCards(BaseCards);

// Initialize Pile IDs
const OuterPileIds = ["b1", "c1", "d1", "a2", "e2", "a3", "e3", "a4", "e4", "b5", "c5", "d5"];
const InnerPileIds = ["b2", "c2", "d2", "b3", "c3", "d3", "b4", "c4", "d4"];

// Initialize Piles
/** @type Piles */
let PILES = {
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

// Get card templates for later
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
  Object.entries(PILES).forEach(([pileId, { cards }]) => {
    if (pileId !== "e5") {
      const pileCards = cards.splice(0);
      moDeck.addToDrawPile(pileCards);
    }
  });

  // Shuffle cards
  moDeck.shuffle(3);

  // Deal cards out to central piles
  dealOutInitialCards();

  // Lastly, render the current state of the piles
  renderCards();
}

// Setup button event listeners
document.getElementById("newGameButton")?.addEventListener("click", () => newGame());
document.getElementById("undoButton")?.addEventListener("click", () => CommandManager.undo());
document.getElementById("redoButton")?.addEventListener("click", () => CommandManager.redo());

function dealOutInitialCards() {
  let allPilesDealt = false;
  let royals = [];
  const innerPilesList = Array.from(InnerPileIds);

  while (!allPilesDealt) {
    const card = moDeck.drawFromDrawPile(1)[0];
    card.facingDown = false;

    // If Royal, set aside
    if (isRoyal(card)) {
      card.facingDown = true;
      royals.push(card);
    } else {
      // Else, deal to an empty center pile that isn't c3
      const currentPile = innerPilesList.shift();
      // Skip the center pile
      if (currentPile && currentPile !== "c3") {
        PILES[currentPile].cards.push(card);
      }
    }

    if (innerPilesList.length === 0) {
      allPilesDealt = true;
    }
  }

  // Add Royals (if any) back to top of draw pile
  moDeck.addToTopOfDrawPile(royals);
  // Flip over top draw pile card
  moDeck.drawPile[0].facingDown = false;
}

function setElInnerHTML(cardEl, selector, value) {
  const selectedEl = cardEl.querySelector(selector);
  if (selectedEl) selectedEl.innerHTML = value;
}

/**
 * @param {MO52Card} chosenCard
 * @param {number} index
 */
function makeFaceUpCard(chosenCard, index) {
  // Clone Template
  const faceUpCard = /** @type {HTMLElement} */ (faceUpTemplate?.content.cloneNode(true));

  // Get main element and add index to it
  const cardEl = faceUpCard.querySelector(".mo-card");
  if (cardEl) {
    cardEl.setAttribute("style", `--index: ${index}`);
  }

  // Set card's rank, suit, and name
  setElInnerHTML(faceUpCard, ".mo-card__rank", chosenCard.initial);
  setElInnerHTML(faceUpCard, ".mo-card__suit", chosenCard.suit);
  setElInnerHTML(faceUpCard, ".mo-card__name", chosenCard.name);

  return faceUpCard;
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
    const cardsClone = Array.from(cards);

    // For each inner pile, render out cards in reverse order, so that [0] ends up with the highest index
    if (InnerPileIds.includes(pileName)) cardsClone.reverse();

    // Make card elements
    const cardEls = cardsClone.map((card, index) => {
      if (card.facingDown) {
        return makeFaceDownCard(index);
      } else {
        // Set the index to 99 for the top card of draw pile
        if (pileName === "e5") index = 99;

        return makeFaceUpCard(card, index);
      }
    });

    // Add an empty card to the bottom of the pile (makes drag n drop easier)
    const nextIndex = cardEls.length;
    const emptyCard = makeEmptyCard(nextIndex);
    cardEls.push(emptyCard);

    // Next, append cards to pile
    const pileEl = document.querySelector(`#${pileName}.pile`);
    pileEl?.replaceChildren(...cardEls);
  });
}

/**
 * @param {string} fromPile
 * @param {string} toPile
 */
function shiftCards(fromPile, toPile) {
  // get top card from origin pile
  const topCard = PILES[fromPile].cards.shift();

  // if card found, process it (if needed), then add it to destination pile and reveal next top card
  if (topCard) {
    // If top card is an Ace or Joker, move the whole "to" pile to the bottom of the draw pile before moving the top card
    if (topCard.nameRank === "Ace" || topCard.nameRank === "Joker") {
      const cards = /** @type {MO52Card[]} */ (PILES[toPile].cards).splice(0);
      PILES.e5.cards.push(...cards);
    }

    // get next top card and reveal it (if there is one)
    if (PILES[fromPile].cards.length) PILES[fromPile].cards[0].facingDown = false;

    PILES[toPile].cards.unshift(topCard);
  }
}

// Function to create commandManagers, should be one per game to manage history (undo/redo)
const createCommandManager = () => {
  /** @type {{prevPile: Piles, nextPile: Piles}[]} */
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

      // Make a clone of the state before shifting
      const prevPile = structuredClone(PILES);

      // Do the shift
      shiftCards(fromPile, toPile);

      // Make a clone of the state after shifting
      const nextPile = structuredClone(PILES);

      // Save the states to history
      history.push({ prevPile, nextPile });
      position += 1;

      // Finally, do a render
      renderCards();
    },

    undo() {
      // Check if at beginning of history (no undo state to undo to)
      if (position > 0) {
        // Get the previous history
        const { prevPile } = history[position];

        // Shift the history position back one
        position -= 1;

        // Replace the current PILES with the previous state
        PILES = prevPile;
      }

      // Finally, do a render
      renderCards();
    },

    redo() {
      // Check if at end of history (no redo state to redo to)
      if (position < history.length - 1) {
        // Increase the history position by one
        position += 1;

        // Get the prior state
        const { nextPile } = history[position];

        // Replace the current state with the next one
        PILES = nextPile;
      }

      // Finally, do a render
      renderCards();
    },
  };
};

// Counts up value of pile's cards, used for royal piles
function getPileValue(/** @type {MO52Card[]} */ pileCards) {
  return pileCards.reduce((acc, card) => {
    return (acc += card.value);
  }, 0);
}

// Checks if a royal card is present and face-down
function checkIfRoyalDefeated(/** @type {MO52Card[]} */ pileCards) {
  return pileCards.some((card) => isRoyal(card) && card.facingDown);
}

// Function to determine which piles are 'legal' targets for drag and drop
function getValidPiles(/** @type {MO52Card} */ card) {
  let validOuterIds;

  // If a Royal, skip the inner IDs
  if (isRoyal(card)) {
    validOuterIds = getValidOuterPiles(card);
    return validOuterIds.length ? validOuterIds : [];
  }

  return getValidInnerPiles(card);
}

/**
 * Function to check which outer piles might be valid for a given card
 * @param {MO52Card} card
 */
function getValidOuterPiles(card) {
  return OuterPileIds.reduce((acc, pileId) => {
    const pileCards = /** @type {MO52Card[]} */ (PILES[pileId].cards).slice(0);

    // Check if empty
    if (!pileCards) {
      acc.push(pileId);
    }

    // If there's a royal, check that the royal hasn't already been defeated
    if (checkIfRoyalDefeated(pileCards)) {
      return acc;
    }

    // Check that the total value won't exceed 21
    const pileValue = getPileValue(pileCards);
    if (pileValue + card.value < 21) {
      acc.push(pileId);
    }

    return acc;
  }, /** @type {string[]} */ ([]));
}

/**
 * Function to check which inner piles might be valid for a given card
 * @param {MO52Card} card
 */
function getValidInnerPiles(card) {
  return InnerPileIds.reduce((acc, pileId) => {
    // If an Ace or Joker, add the pileId and return early
    if (card.value <= 1) {
      acc.push(pileId);
    } else {
      // Get top card, if any
      const topPileCard = /** @type {MO52Card[]} */ (PILES[pileId].cards).slice(0)[0];

      // Check if topPileCard is same or lower value, or if pile is empty
      if ((topPileCard && topPileCard.value <= card.value) || !topPileCard) {
        acc.push(pileId);
      }
    }

    return acc;
  }, /** @type {string[]} */ ([]));
}

/**
 * Checks if the toPile is a valid location for the top card of the fromPile
 * @param {string} fromPile
 * @param {string} toPile
 * @returns {boolean}
 */
function isValidPile(fromPile, toPile) {
  const card = PILES[fromPile].cards.slice(0)[0];
  const validPiles = getValidPiles(card);
  const retVal = validPiles.includes(toPile);
  return retVal;
}

// Function to highlight 'legal' drop targets
function highlightValidPiles(/** @type {string[]} */ validPiles) {
  validPiles.forEach((pileId) => {
    const pileEl = document.getElementById(pileId);
    pileEl?.classList.add("pile--valid");
  });
}

// Function to clear highlighted valid piles
function removeHighlights() {
  const currentHighlights = Array.from(document.getElementsByClassName("pile--valid"));
  currentHighlights.forEach((el) => el.classList.remove("pile--valid"));
}

/** Drag and drop stuff */
const pileEls = Array.from(document.getElementsByClassName("pile"));
const drake = dragula(pileEls, {
  moves: function (_, source) {
    if (source?.classList.contains("pile--inner") || source?.classList.contains("pile--outer")) {
      return false;
    }
    return true;
  },
  accepts: function (_, toPileEl, fromPileEl) {
    const fromPile = fromPileEl?.id;
    const toPile = toPileEl?.id;
    if (fromPile && toPile) return isValidPile(fromPile, toPile);
    return false;
  },
});
drake.on("drag", (_, source) => {
  // Grab a copy of the top card from the 'source' pile
  const card = /** @type {MO52Card[]} */ (PILES[source.id].cards).slice(0, 1)[0];
  const validPiles = getValidPiles(card);

  if (validPiles.length) {
    highlightValidPiles(validPiles);
  }
});
drake.on("drop", (_, target, source) => {
  removeHighlights();
  const fromPile = source.id;
  const toPile = target.id;

  CommandManager.doShift(fromPile, toPile);
});

document.addEventListener("DOMContentLoaded", function () {
  newGame();
});
