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
const OuterPileIDs = ["b1", "c1", "d1", "a2", "e2", "a3", "e3", "a4", "e4", "b5", "c5", "d5"];
const InnerPileIDs = ["b2", "c2", "d2", "b3", "c3", "d3", "b4", "c4", "d4"];

// Initialize Piles
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

  // TODO: Collect all cards from all piles

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
    // For each pile, render out cards in reverse order, so that [0] ends up with the highest index (but only for inner piles)
    const cardsClone = Array.from(cards);
    // if (InnerPileIDs.includes(pileName)) cardsClone.reverse();
    const cardEls = cardsClone.map((card, index) => {
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
  let cardEl = makeFaceUpCard(topCard, 99);
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
    // If top card is an Ace or Joker, move the whole "to" pile to the bottom of the draw pile before moving the top card
    if (topCard.nameRank === "Ace" || topCard.nameRank === "Joker") {
      const cards = /** @type {MO52Card[]} */ (PILES[toPile].cards).splice(0);
      PILES.e5.cards.push(...cards);
    }

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

// Counts up value of pile's cards, used for royal piles
const getPileValue = (/** @type {MO52Card[]} */ pileCards) => {
  return pileCards.reduce((acc, card) => {
    return (acc += card.value);
  }, 0);
};

// Checks if a royal card is present and face-down
const checkIfRoyalDefeated = (/** @type {MO52Card[]} */ pileCards) => {
  return pileCards.some((card) => isRoyal(card) && card.facingDown);
};

// Function to determine which piles are 'legal' targets for drag and drop
const getValidPiles = (/** @type {number} */ cardValue) => {
  const validInnerIds = InnerPileIDs.reduce((acc, pileID) => {
    // Get top card, if any
    const topPileCard = /** @type {MO52Card[]} */ (PILES[pileID].cards).slice(0)[0];

    // If a Royal, skip the inner IDs
    if (cardValue > 10) {
      return acc;
    }

    // If an Ace or Joker, add the pileID
    if (cardValue <= 1) {
      acc.push(pileID);
    }

    // Check if topPileCard is same or lower value, or if pile is empty
    if ((topPileCard && topPileCard.value <= cardValue) || !topPileCard) {
      acc.push(pileID);
    }

    return acc;
  }, /** @type {string[]} */ ([]));

  if (validInnerIds.length) {
    return validInnerIds;
  } else {
    const validOuterIds = OuterPileIDs.reduce((acc, pileID) => {
      // Check if empty
      const pileCards = /** @type {MO52Card[]} */ (PILES[pileID].cards).slice(0);
      if (!pileCards) {
        acc.push(pileID);
      }

      // If there's a royal, check that the royal hasn't already been defeated
      const defeatedRoyal = checkIfRoyalDefeated(pileCards);
      if (defeatedRoyal) {
        return acc;
      }

      // Check that the total value won't exceed 21
      const pileValue = getPileValue(pileCards);
      if (pileValue + cardValue < 21) {
        acc.push(pileID);
      }

      return acc;
    }, /** @type {string[]} */ ([]));

    if (validOuterIds.length) {
      return validOuterIds;
    }
  }

  return [];
};

// Function to highlight 'legal' drop targets
const highlightValidPiles = (/** @type {string[]} */ validPiles) => {
  validPiles.forEach((pileId) => {
    const pileEl = document.getElementById(pileId);
    pileEl?.classList.add("pile--valid");
  });
};

// Function to clear highlighted valid piles
const removeHighlights = () => {
  const currentHighlights = Array.from(document.getElementsByClassName("pile--valid"));
  currentHighlights.forEach((el) => el.classList.remove("pile--valid"));
};

/** Drag and drop stuff */
const pileEls = Array.from(document.getElementsByClassName("pile"));
const drake = dragula(pileEls, {
  moves: function (_, source) {
    if (source?.classList.contains("pile--inner") || source?.classList.contains("pile--outer")) {
      return false;
    }
    return true;
  },
});
drake.on("drag", (_, source) => {
  // Grab a copy of the top card from the 'source' pile
  const card = /** @type {MO52Card[]} */ (PILES[source.id].cards).slice(0)[0];
  const cardValue = card.value;
  const validPiles = getValidPiles(cardValue);

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

// TODO: Improve `getValidPiles` for royals to show "correct" placements
// TODO: Handle a game over scenario (in RenderCards, not Highlighter)
// TODO: Handle a game won scenario (in RenderCards)
// TODO: Handle undoing an ace or joker
// TODO: handle adding "armor" to royals
// TODO: handle lining up enough points to kill a royal
// TODO: Handle a royal getting too strong (21 points IIRC)
// TODO: Add "tap to peek" somehow so that people can see what cards are in each inner pile
// TODO: Add an interactive tutorial