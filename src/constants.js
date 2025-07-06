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
  C: "♣",
  H: "♥",
  S: "♠",
  D: "♦",
  J: "☹︎", // Joker
  any: "★"
};

// Suit colors for when suit is not a match
// Key: card.suit
export const suitColor = {
  [suitIcons["C"]]: "Black",
  [suitIcons["H"]]: "Red",
  [suitIcons["S"]]: "Black",
  [suitIcons["D"]]: "Red",
  [suitIcons["C"] + suitIcons["S"]]: "Black", // Clubs and Spades
  [suitIcons["H"] + suitIcons["D"]]: "Red", // Hearts and Diamonds
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

  // Setup suit icons
  card.suit = suitIcons[card.suit[0]];

  // Rename Royals to their number rank and provide target hints
  if (card.nameRank === "Jack") {
    card.initial = "11";
    card.suit = suitIcons["any"];
  } else if (card.nameRank === "Queen") {
    card.initial = "12";
    if (card.suit === suitIcons["C"] || card.suit === suitIcons["S"]) {
      card.suit = suitIcons["C"] + suitIcons["S"]; // Clubs and Spades
    } else {
      card.suit = suitIcons["H"] + suitIcons["D"]; // Hearts and Diamonds
    }
  } else if (card.nameRank === "King") {
    card.initial = "13";
  }

  // Turn all cards face-down to start
  card.facingDown = true;

  return card;
});

// Add a Joker with value of 0
BaseCards.push({ ...StandardCards.FancyJoker, initial: "0", value: 0, facingDown: true, suit: suitIcons["J"] });

// Initialize Deck
export const moDeck = new DeckOfCards(BaseCards);

// Pile Ids for inner and outer piles, used for iterating over piles
export const InnerPileIds = ["b2", "c2", "d2", "b3", "c3", "d3", "b4", "c4", "d4"];
export const OuterPileIds = ["b1", "c1", "d1", "a2", "e2", "a3", "e3", "a4", "e4", "b5", "c5", "d5"];

// Lists the nearest inner pile for a given outer pile key
export const NearestInnerPile = {
  b1: "b2",
  c1: "c2",
  d1: "d2",
  a2: "b2",
  e2: "d2",
  a3: "b3",
  e3: "d3",
  a4: "b4",
  e4: "d4",
  b5: "b4",
  c5: "c4",
  d5: "d4",
};

// Rows and columns along with their royals, used to check if the royal has been defeated
// Key: the "to pile", aka the pile a card was just dropped on
// Value: the unit(s) which need to be checked for 'defeat' condition (1 or 2 units per key, 2 if on a corner)
/** @type {{[x: string]: Array<{cardsToCheck: string[], royalPile: string}>}} */
export const RoyalUnits = {
  b2: [
    { cardsToCheck: ["c2", "d2"], royalPile: "e2" },
    { cardsToCheck: ["b3", "b4"], royalPile: "b5" },
  ],
  c2: [{ cardsToCheck: ["c3", "c4"], royalPile: "c5" }],
  d2: [
    { cardsToCheck: ["c2", "b2"], royalPile: "a2" },
    { cardsToCheck: ["d3", "d4"], royalPile: "d5" },
  ],
  b3: [{ cardsToCheck: ["c3", "d3"], royalPile: "e3" }],
  c3: [], // Center can't trigger any kills
  d3: [{ cardsToCheck: ["c3", "b3"], royalPile: "a3" }],
  b4: [
    { cardsToCheck: ["c4", "d4"], royalPile: "e4" },
    { cardsToCheck: ["b3", "b2"], royalPile: "b1" },
  ],
  c4: [{ cardsToCheck: ["c3", "c2"], royalPile: "c1" }],
  d4: [
    { cardsToCheck: ["c4", "b4"], royalPile: "a4" },
    { cardsToCheck: ["d3", "d2"], royalPile: "d1" },
  ],
};

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

// Helper function to replace PILES with one from history
export function replacePiles(newPiles) {
  PILES = newPiles;
}
