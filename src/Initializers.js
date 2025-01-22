import { DeckOfCards, StandardCards } from "@andrewscripts/deck-of-cards.js";

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

export const suitIcons = {
  C: "♣️",
  H: "❤️",
  S: "♠️",
  D: "♦️",
  J: "🤪",
};

// Initialize Cards
const BaseCards = /** @type MO52Card[] */ (StandardCards.standard52DeckOfCards).map((card) => {
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
export const moDeck = new DeckOfCards(BaseCards); // Pile Ids for inner and outer piles, used for iterating over piles

export const InnerPileIds = ["b2", "c2", "d2", "b3", "c3", "d3", "b4", "c4", "d4"];
export const OuterPileIds = ["b1", "c1", "d1", "a2", "e2", "a3", "e3", "a4", "e4", "b5", "c5", "d5"];
// Initialize Piles
/** @type Piles */

export let PILES = {
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

export function replacePiles(newPiles) {
  PILES = newPiles;
}
export function dealOutInitialCards() {
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
} /** @param {import("./Initializers").MO52Card} card */

// Needed here to prevent circular dependency
export function isRoyal(card) {
  return card.value > 10;
}
